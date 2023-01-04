
const amqp = require('amqplib');                         // Promise version
const amqp_callback = require('amqplib/callback_api');   // Callback version
const queue = process.env.QUEUE || 'hello world';

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

    // crea la cola si no existe
    await channel.assertQueue(queue, {
        durable: true // por defecto es true // necesario para la persistencia de datos en el servidor de rabbit
    })

    sleepLoop(messagesAmount, async () => {
        const message = {
            id: Math.random().toString(32).slice(2, 6),
            text: 'Hello world'
        }
    
        const sent = channel.sendToQueue(queue, Buffer.from(
            JSON.stringify(message)
        ), {
            persistent: true // para mantener la persistencia de datos en el servidor de rabbit
        });
    
        sent ?
        console.log(`sent message to ${queue} queue`, message) :
        console.log(`fail sending message to ${queue} queue`, message)
    })
}

producer()
    .catch((err) => {
    console.log(err);
    process.exit(1);
});

exit();