use lapin::{Connection, ConnectionProperties};
use std::env;

mod oauth;

#[tokio::main]
async fn main() {
    let addr = env::var("RABBITMQ_URL").expect("RABBITMQ_URL must be set");

    // Connect to RabbitMQ, if fail, repeat every 5 seconds
    let conn = loop {
        match Connection::connect(&addr, ConnectionProperties::default()).await {
            Ok(connection) => break connection,
            Err(e) => {
                println!("Failed to connect to RabbitMQ: {}", e);
                tokio::time::sleep(std::time::Duration::from_secs(5)).await;
            }
        }
    };

    println!("[Engine] 🚀");

    // oauth service
    let channel = conn.create_channel().await.unwrap();
    oauth::oauth(channel).await;
}
