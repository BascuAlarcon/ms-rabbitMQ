const amqp = require('amqplib');       

const queue = process.env.QUEUE || 'hello world';
const exchangeName = process.env.EXCHANGE || 'my-direct';
const exchangeType = 'direct';
const pattern = process.env.PATTERN || ''; // se asocia con el routingKey

console.log({
    queue,
    exchangeName,
    pattern
});

function intensiveOperation(){
    let i = 10000000
    while(i--){}
}

async function consumer(){
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue()

    await channel.assertExchange(exchangeName, exchangeType);

    await channel.bindQueue(queue, exchangeName, pattern)

    channel.consume(queue, message => {
        const content = JSON.parse(message.content.toString());

        intensiveOperation();

        console.log(`Received message from ${queue} queue`);
        console.log(content);

        channel.ack(message); 
    });
}


consumer()
    .catch((err) => {
    console.log(err);
    process.exit(1);
});