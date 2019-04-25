module.exports = () => (...params) => class producer extends require('ut-port-amqp/produce')(...params) {
    get defaults() {
        return {
            namespace: 'producer',
            imports: ['producer']
        };
    }
};
