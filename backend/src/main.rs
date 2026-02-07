mod handlers;
mod state;

use axum::{
    middleware,
    routing::{get, post},
    Router,
};

use sqlx::postgres::PgPoolOptions;
use std::env;
use std::sync::Arc;
use std::time::Duration;
use tower_http::cors::CorsLayer;
use tower_http::limit::RequestBodyLimitLayer;
use tower_governor::{GovernorLayer, governor::GovernorConfigBuilder, key_extractor::PeerIpKeyExtractor};
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::state::AppState;
use crate::handlers::{health_handler, contact_handler, dashboard_handler, track_visitor};

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "backend=debug,tower_http=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load environment variables
    dotenvy::dotenv().ok();
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // Connect to PostgreSQL
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(3))
        .connect(&db_url)
        .await
        .expect("Failed to connect to Postgres.");

    // Run migrations
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to migrate database");

    // Initialize state
    let state = AppState { db: pool };

    // Configure CORS based on environment
    let frontend_origin = env::var("FRONTEND_URL").unwrap_or_else(|_| "http://localhost:3000".to_string());
    
    // Include OPTIONS so browser preflight gets valid CORS response
    let allowed_methods = [
        axum::http::Method::GET,
        axum::http::Method::POST,
        axum::http::Method::OPTIONS,
    ];
    let allowed_headers = [
        axum::http::header::CONTENT_TYPE,
        axum::http::HeaderName::from_static("x-magic-key"),
    ];

    // Parse CORS origin - if parsing fails, allow any for development
    let cors = if let Ok(origin) = frontend_origin.parse::<axum::http::HeaderValue>() {
        CorsLayer::new()
            .allow_origin(origin)
            .allow_methods(allowed_methods)
            .allow_headers(allowed_headers.clone())
    } else {
        info!("Using permissive CORS for development");
        CorsLayer::new()
            .allow_origin(tower_http::cors::Any)
            .allow_methods(allowed_methods)
            .allow_headers(allowed_headers)
    };

    // DDoS Protection: Rate limiting per IP
    // Allow 20 requests burst, then 1 request per second
    let governor_conf = Arc::new(
        GovernorConfigBuilder::default()
            .per_second(1) 
            .burst_size(20) 
            .key_extractor(PeerIpKeyExtractor)
            .finish()
            .expect("Failed to create rate limiter config")
    );

    // Request body size limit: 100KB is plenty for contact messages but prevents large payload attacks
    let body_limit_layer = RequestBodyLimitLayer::new(100 * 1024);

    // Timeout: Prevent slowloris attacks by timing out requests after 30 seconds
    use tower_http::timeout::TimeoutLayer;
    let timeout_layer = TimeoutLayer::with_status_code(axum::http::StatusCode::REQUEST_TIMEOUT, Duration::from_secs(30));

    // Security Headers
    use axum::http::header::{X_CONTENT_TYPE_OPTIONS, X_FRAME_OPTIONS};
    use axum::http::HeaderValue;
    use tower_http::set_header::SetResponseHeaderLayer;

    // Rate limit /health and /contact only; /dashboard bypasses (proxy from Next uses same IP and could hit limit)
    let api_rate_limited = Router::new()
        .route("/health", get(health_handler))
        .route("/contact", post(contact_handler))
        .layer(GovernorLayer::new(governor_conf));
    let api_dashboard = Router::new().route("/dashboard", get(dashboard_handler));
    let api_routes = api_rate_limited
        .merge(api_dashboard)
        .layer(body_limit_layer)
        .layer(timeout_layer)
        .layer(SetResponseHeaderLayer::overriding(X_CONTENT_TYPE_OPTIONS, HeaderValue::from_static("nosniff")))
        .layer(SetResponseHeaderLayer::overriding(X_FRAME_OPTIONS, HeaderValue::from_static("DENY")))
        .layer(middleware::from_fn_with_state(state.clone(), track_visitor))
        .with_state(state);

    let app = Router::new()
        .nest("/api", api_routes)
        .layer(cors);

    // Port configuration from environment variable (Cloud Run compatible)
    let port = env::var("PORT").unwrap_or_else(|_| "3001".to_string());
    let addr = format!("0.0.0.0:{}", port);
    
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect(&format!("Failed to bind to {}", addr));
    
    info!("Server running on {}", addr);
    
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .expect("Server error");
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    info!("Shutting down backend server...");
}
