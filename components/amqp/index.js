module.exports = {
    ports: [
        {
            id: 'consumer',
            createPort: require('ut-port-amqp/consume'),
            namespace: ['consumer'],
            imports: ['consumer']
        },
        {
            id: 'producer',
            createPort: require('ut-port-amqp/produce'),
            namespace: ['producer'],
            imports: ['producer']
        }
    ]
};
