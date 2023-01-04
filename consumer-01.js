
const amqp = require('amqplib');                         
const queue = process.env.QUEUE || 'hello world';

function intensiveOperation(){
    let i = le9
    while(i--){}
}

async function consumer(){
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue()

    channel.consume(queue, message => {
        const content = JSON.parse(message.content.toString());

        intensiveOperation();

        console.log(`Received message from ${queue} queue`);
        console.log(content);

        channel.ack(message); // elimina el mensaje de la cola
    });
}


consumer()
    .catch((err) => {
    console.log(err);
    process.exit(1);
});