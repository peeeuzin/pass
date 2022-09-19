use dotenv::dotenv;
use lapin::Connection;
use mongodb::{options::ClientOptions, Client};
use std::env;

mod oauth;
mod utils;

#[tokio::main]
async fn main() {
    dotenv().ok();

    println!("[Engine] 🚀");

    // oauth service
    oauth::oauth().await;
}

async fn database_mongo() -> mongodb::Database {
    let database_addr = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let mut client_opts = ClientOptions::parse(&database_addr).await.unwrap();

    client_opts.app_name = Some("pass_engine".to_string());
    let client = Client::with_options(client_opts).unwrap();

    client.database("pass_engine")
}

async fn rabbitmq() -> Connection {
    let rabbitmq_addr = env::var("RABBITMQ_URL").expect("RABBITMQ_URL must be set");
    // Connect to RabbitMQ, if fail, repeat every 5 seconds
    loop {
        match lapin::Connection::connect(&rabbitmq_addr, Default::default()).await {
            Ok(connection) => {
                println!("[Engine] Connected to RabbitMQ");
                break connection;
            }
            Err(e) => {
                println!("[Engine] Failed to connect to RabbitMQ: {}", e);
                tokio::time::sleep(std::time::Duration::from_secs(5)).await;
            }
        }
    }
}
