use dotenv::dotenv;
use mongodb::{options::ClientOptions, Client};
use std::env;

mod oauth;
mod utils;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let rabbitmq_addr = env::var("RABBITMQ_URL").expect("RABBITMQ_URL must be set");

    // Connect to RabbitMQ, if fail, repeat every 5 seconds
    let amqp = loop {
        match lapin::Connection::connect(&rabbitmq_addr, Default::default()).await {
            Ok(connection) => break connection,
            Err(e) => {
                println!("Failed to connect to RabbitMQ: {}", e);
                tokio::time::sleep(std::time::Duration::from_secs(5)).await;
            }
        }
    };

    println!("[Engine] 🚀");

    // oauth service
    let channel = amqp.create_channel().await.unwrap();
    oauth::oauth(channel).await;
}

async fn database_mongo() -> mongodb::Database {
    let database_addr = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let mut client_opts = ClientOptions::parse(&database_addr).await.unwrap();

    client_opts.app_name = Some("pass_engine".to_string());
    let client = Client::with_options(client_opts).unwrap();

    client.database("pass_engine")
}
