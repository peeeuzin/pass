use futures_lite::stream::StreamExt;
use lapin::Channel;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct OAuthPayload {
    pub user_id: String,
}

pub async fn oauth(channel: Channel) {
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
        let data: OAuthPayload = serde_json::from_slice(&delivery.data).unwrap();
        println!("Received: {:?}", data);

        delivery
            .ack(Default::default())
            .await
            .expect("failed to ack");
    }
}
