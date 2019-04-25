module.exports = () => function utService({config}) {
    const serviceContext = {
        models: config.models || {},
        context: config.context || {},
        namespace: config.namespace || 'service'
    };
    return {
        // cache: () => require('./components/cache')(serviceContext),
        // console: () => require('./components/console')(serviceContext),
        // consumer: () => require('./components/consumer')(serviceContext),
        crypto: () => params => class crypto extends require('ut-port-crypto')(params) {},
        db: () => require('./components/db')(serviceContext)
        // performance: () => require('./components/performance')(serviceContext),
        // producer: () => require('./components/producer')(serviceContext),
        // script: () => require('./components/script')(serviceContext),
        // swagger: () => require('./components/swagger')(serviceContext)
    };
};
