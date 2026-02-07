use sqlx::PgPool;
use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use validator::Validate;

// Shared application state
#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
}

#[derive(Serialize, Clone, Debug, sqlx::FromRow)]
pub struct MessageLog {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub message: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize)]
pub struct DashboardData {
    pub visitor_count: i64,
    pub recent_messages: Vec<MessageLog>,
}

#[derive(Deserialize, Debug, Validate)]
pub struct ContactPayload {
    #[validate(length(min = 1, max = 100, message = "Name must be between 1 and 100 characters"))]
    pub name: String,
    
    #[validate(email(message = "Invalid email format"))]
    #[validate(length(max = 255, message = "Email must not exceed 255 characters"))]
    pub email: String,
    
    #[validate(length(min = 1, max = 5000, message = "Message must be between 1 and 5000 characters"))]
    pub message: String,
}
