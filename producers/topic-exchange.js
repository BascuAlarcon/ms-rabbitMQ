const amqp = require('amqplib');                         

const exchangeName = process.env.EXCHANGE || 'my-topic';
const exchangeType = 'topic';
const routingKey = process.env.ROUTING_KEY || '';

console.log({
    exchangeName,
    exchangeType,
    routingKey
});

const messagesAmount = 4;
const wait = 1000;

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

async function sleepLoop(number, cb){
    while(number--){
        await sleep(wait);
        cb();
    }
}

async function exit(){
    await sleep(messagesAmount * wait * 1.2);

    process.exit(0)
}

async function producer(){
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel(); 

    await channel.assertExchange(exchangeName, exchangeType);

    sleepLoop(messagesAmount, async () => {
        const message = {
            id: Math.random().toString(32).slice(2, 6),
            text: 'Hello world'
        }
    
        const sent = channel.publish(exchangeName, routingKey, Buffer.from(
            JSON.stringify(message)
        ));
    
        sent 
            ? console.log(`sent message to ${exchangeName} exchange`, message) 
            : console.log(`fail sending message to ${exchangeName} exchange`, message)
    })
}

producer()
    .catch((err) => {
    console.log(err);
    process.exit(1);
});

exit();