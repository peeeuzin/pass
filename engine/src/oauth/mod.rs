mod new_auth;
mod user_authorize;

pub async fn oauth() {
    tokio::spawn(async move {
        let amqp = crate::rabbitmq().await;
        let channel = amqp.create_channel().await.unwrap();
        new_auth::new_auth(channel).await;
    });

    let amqp = crate::rabbitmq().await;
    let channel = amqp.create_channel().await.unwrap();
    user_authorize::user_authorize(channel).await;
}

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum ErrorCode {
    Unknown,
    InvalidRequest,
    InternalError,
    NotFound,
}

#[derive(Debug, Clone)]
pub struct Error {
    pub message: String,
    pub error_code: ErrorCode,
}

impl Error {
    pub fn to_json_bytes(&self) -> Vec<u8> {
        // parse error code to string
        let error_code = self.error_code.to_string();

        let json = serde_json::json!({
            "error": {
                "message": self.message,
                "error_code": error_code
            }
        });

        serde_json::to_vec(&json).unwrap()
    }
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{} - Error code: {}", self.message, self.error_code)
    }
}

impl std::fmt::Display for ErrorCode {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            ErrorCode::Unknown => write!(f, "Unkonwn error"),
            ErrorCode::InvalidRequest => write!(f, "Invalid request"),
            ErrorCode::InternalError => write!(f, "Internal error"),
            ErrorCode::NotFound => write!(f, "Not found"),
        }
    }
}
