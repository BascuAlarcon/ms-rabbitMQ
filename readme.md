dependencies - "amqplib": "^0.10.3"

docker run -d --hostname yt-rabbit -p 5672:5672 -p 8081:15672 --name yt-rabbit rabbitmq:3
para usar el sistema web de administración
docker run -d --hostname yt-rabbit -p 5672:5672 -p 8081:15672 --name yt-rabbit rabbitmq:3-management
para el uso de volumenes y persistencia
docker run -d -v $(pws)/rabbit-db:/var/lib/rabbitmq --hostname yt-rabbit -p 5672:5672 -p 8081:15672 --name yt-rabbit rabbitmq:3

exchange-fanout: funciona como un broadcast, envia todos los mensajes a todas las colas (que esten subscritos al exchange)
exchange-direct: tiene que coincidir la llave de enrutamiento y la cola
exchange-topic: el mensaje se lo envia a todos quienes cumplan con la llave del patron de enrutamiento
