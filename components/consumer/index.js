module.exports = () => (...params) => class consumer extends require('ut-port-amqp/consume')(...params) {
    get defaults() {
        return {
            namespace: 'consumer',
            imports: ['consumer']
        };
    }
};
