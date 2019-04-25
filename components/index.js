module.exports = () => function utService() {
    return {
        cache: require('./cache'),
        console: require('./console'),
        consumer: require('./consumer'),
        crypto: require('./crypto'),
        db: require('./db'),
        performance: require('./performance'),
        producer: require('./producer'),
        script: require('./script'),
        swagger: require('./swagger')
    };
};
