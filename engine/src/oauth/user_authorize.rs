use super::{Error, Result};
use futures_lite::StreamExt;
use lapin::Channel;
use mongodb::bson::{doc, Document};
use serde::{Deserialize, Serialize};

use super::new_auth::AuthenticationMethod;

#[derive(Serialize, Deserialize, Debug, Clone)]
struct UserAuthorization {
    pub user_id: String,
    pub code: Option<String>,
}

pub async fn user_authorize(channel: Channel) {
    channel
        .queue_declare("user_authorize", Default::default(), Default::default())
        .await
        .unwrap();

    let mut consumer = channel
        .basic_consume(
            "user_authorize",
            "engine_oauth_user_authorize",
            Default::default(),
            Default::default(),
        )
        .await
        .unwrap();

    while let Some(delivery) = consumer.next().await {
        let delivery = delivery.expect("error caught in consumer");
        match serde_json::from_slice(&delivery.data) {
            Ok(payload) => {
                let payload: UserAuthorization = payload;

                match handle_delivery(payload.clone()).await {
                    Ok(r) => {
                        let json = serde_json::json!({
                            "user_id": payload.user_id,
                            "is_correct": r
                        });

                        let value = serde_json::to_vec(&json).unwrap();

                        channel
                            .basic_publish(
                                "",
                                "oauth_authorize",
                                Default::default(),
                                &value,
                                Default::default(),
                            )
                            .await
                            .unwrap();
                    }

                    Err(e) => {
                        channel
                            .basic_publish(
                                "",
                                "oauth_authorize",
                                Default::default(),
                                &e.to_json_bytes(),
                                Default::default(),
                            )
                            .await
                            .unwrap();
                    }
                }

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

async fn handle_delivery(data: UserAuthorization) -> Result<bool> {
    let method = decide_method(data.clone())?;

    manage_method(method, data).await
}

fn decide_method(data: UserAuthorization) -> Result<AuthenticationMethod> {
    if data.code.is_some() {
        Ok(AuthenticationMethod::Code)
    } else {
        Err(Error {
            message: "Invalid request".to_string(),
            error_code: super::ErrorCode::InvalidRequest,
        })
    }
}

async fn manage_method(method: AuthenticationMethod, data: UserAuthorization) -> Result<bool> {
    match method {
        AuthenticationMethod::Code => {
            use crate::database_mongo;

            let db = database_mongo().await;
            let collection = db.collection::<Document>("pending_oauth");

            let filter = doc! {
                "user_id": data.user_id,
            };

            let auth = collection.find_one(filter, None).await.unwrap();
            if let Some(doc) = auth {
                let code = doc.get_i32("code").unwrap();
                let code = code.to_string();

                if code == data.code.unwrap() {
                    collection.delete_one(doc, None).await.unwrap();

                    Ok(true)
                } else {
                    Ok(false)
                }
            } else {
                Err(Error {
                    message: "user.notfound".to_string(),
                    error_code: super::ErrorCode::NotFound,
                })
            }
        }
    }
}
