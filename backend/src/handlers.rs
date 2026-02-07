use axum::{
    extract::{Json, Request, State},
    http::{HeaderMap, StatusCode},
    middleware::Next,
    response::Response,
};
use std::time::{SystemTime, UNIX_EPOCH};
use tracing::{info, error};
use crate::state::{AppState, MessageLog, DashboardData, ContactPayload};
use sqlx::{query, query_as};
use validator::Validate;

// Middleware to track visitor count
pub async fn track_visitor(
    State(state): State<AppState>,
    request: Request,
    next: Next,
) -> Response {
    // Increment count for non-OPTIONS requests
    if request.method() != "OPTIONS" {
        // Asynchronously update DB
        let db = state.db.clone();
        tokio::spawn(async move {
            match query("UPDATE visitors SET count = count + 1 WHERE id = 1")
                .execute(&db)
                .await 
            {
                Ok(_) => info!("Visitor count updated"),
                Err(e) => error!("Failed to update visitor count: {}", e),
            }
        });
    }
    next.run(request).await
}

pub async fn health_handler() -> String {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards");
    
    // Return time in nanoseconds
    format!("{}", since_the_epoch.as_nanos())
}

pub async fn contact_handler(
    State(state): State<AppState>,
    Json(payload): Json<ContactPayload>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // Validate input
    if let Err(validation_errors) = payload.validate() {
        error!("Validation failed: {:?}", validation_errors);
        return Err(StatusCode::BAD_REQUEST);
    }
    
    info!("Received contact form submission: {:?}", payload);
    
    // Store message in Postgres
    if let Err(e) = query("INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)")
        .bind(&payload.name)
        .bind(&payload.email)
        .bind(&payload.message)
        .execute(&state.db)
        .await {
        error!("Failed to save message: {}", e);
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
    
    Ok(Json(serde_json::json!({
        "success": true,
        "message": "Message received successfully"
    })))
}

// The "Tricky" Dashboard Handler
pub async fn dashboard_handler(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<DashboardData>, StatusCode> {
    let magic = headers.get("x-magic-key").and_then(|v| v.to_str().ok());
    info!("Dashboard request: x-magic-key present={}", magic.is_some());

    // The "Magic" Operation: Must send 'x-magic-key: open-sesame' header
    let key_ok = headers
        .get("x-magic-key")
        .and_then(|v| v.to_str().ok())
        .map(|s| s.trim() == "open-sesame")
        .unwrap_or(false);

    if key_ok {
            info!("Dashboard: key valid, querying DB");
            // Fetch visitor count - resilient if row missing (e.g. fresh DB)
            #[derive(sqlx::FromRow)]
            struct CountRow { count: i64 }

            let visitor_count = match query_as::<_, CountRow>("SELECT count FROM visitors WHERE id = 1")
                .fetch_optional(&state.db)
                .await
            {
                Ok(Some(r)) => r.count,
                Ok(None) => 0,
                Err(e) => {
                    error!("DB error (visitors): {} - using 0", e);
                    0
                }
            };

            // Fetch recent messages (resilient: return empty on error so dashboard still loads)
            let recent_messages = match query_as::<_, MessageLog>(
                "SELECT id, name, email, message, created_at FROM messages ORDER BY created_at DESC LIMIT 50"
            )
            .fetch_all(&state.db)
            .await
            {
                Ok(rows) => rows,
                Err(e) => {
                    error!("DB error (messages): {} - returning empty list", e);
                    vec![]
                }
            };

            info!("Dashboard: returning 200 OK (visitors={}, messages={})", visitor_count, recent_messages.len());
            Ok(Json(DashboardData {
                visitor_count,
                recent_messages,
            }))
    } else {
        info!("Dashboard: key missing or invalid, returning 404");
        Err(StatusCode::NOT_FOUND)
    }
}
