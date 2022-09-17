# Pass 🔑
A authenticator for your accounts.

## Components
 - **Engine**: The core of the Pass.
 - **API**: The API for the Pass.


## Running with Docker Compose
To run the Pass, you need to add `.env`, with following content:
```env
POSTGRES_USER=<postgres user>
POSTGRES_PASS=<postgres password>

RABBITMQ_USER=<rabbitmq user>
RABBITMQ_PASS=<rabbitmq password>
```

Then, run the following command:
```bash
docker compose --env-file .env up -d
```

# License
[Apache-3.0](./LICENSE)