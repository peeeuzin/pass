import amqp from 'amqplib';

export async function createConnection() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    return connection;
}
