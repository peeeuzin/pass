use futures_lite::StreamExt;
use lapin::Channel;
use mongodb::bson::{doc, Document};
use serde::{Deserialize, Serialize};

pub enum AuthenticationMethod {
    Code,
    // OnePress
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct OAuthPayload {
    pub user_id: String,
}

pub async fn new_auth(channel: Channel) {
    channel
        .queue_declare("new_oauth", Default::default(), Default::default())
        .await
        .unwrap();

    let mut consumer = channel
        .basic_consume(
            "new_oauth",
            "engine_oauth",
            Default::default(),
            Default::default(),
        )
        .await
        .unwrap();

    while let Some(delivery) = consumer.next().await {
        let delivery = delivery.expect("error caught in consumer");
        match serde_json::from_slice(&delivery.data) {
            Ok(payload) => {
                handle_delivery(payload).await;
                delivery
                    .ack(Default::default())
                    .await
                    .expect("failed to ack");
            }

            Err(e) => {
                println!("Failed to deserialize payload: {}", e);
                delivery
                    .reject(Default::default())
                    .await
                    .expect("failed to reject");
            }
        }
    }
}

async fn handle_delivery(data: OAuthPayload) {
    let method = decide_method();

    manage_method(method, data).await;
}

fn decide_method() -> AuthenticationMethod {
    AuthenticationMethod::Code
}

async fn manage_method(method: AuthenticationMethod, data: OAuthPayload) {
    match method {
        AuthenticationMethod::Code => {
            use crate::database_mongo;

            let db = database_mongo().await;
            let collection = db.collection::<Document>("pending_oauth");

            let code = crate::utils::generate_code::gen();
            let query = doc! {
                "user_id": data.clone().user_id,
            };

            let new_doc = doc! {
                "user_id": data.user_id,
                "code": code,
                "created_at": chrono::Utc::now(),
            };

            println!("{}", code);

            if collection
                .find_one(query.clone(), None)
                .await
                .unwrap()
                .is_some()
            {
                collection
                    .update_one(
                        query,
                        doc! {
                            "$set": {
                                "code": code,
                                "created_at": chrono::Utc::now(),
                            }
                        },
                        None,
                    )
                    .await
                    .ok();
            } else {
                collection.insert_one(new_doc, None).await.ok();
            }
        }
    }
}
