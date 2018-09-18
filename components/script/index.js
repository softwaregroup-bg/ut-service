const errorsFactory = require('./errors');
const methods = require('./methods');
const generateContextMethods = (port, context, method) => {
    port[method] = msg => context;
    if (typeof context === 'object' && !Array.isArray(context)) {
        Object.keys(context).forEach(key => {
            generateContextMethods(port, context[key], `${method}.${key}`);
        });
    };
};
module.exports = {
    ports: [
        function script(config = {}) {
            const port = {
                id: 'script',
                createPort: require('ut-port-script'),
                db: true,
                crypto: true,
                models: [],
                imports: [config.service],
                namespace: [config.service],
                start() {
                    Object.assign(this.errors, errorsFactory(this.bus));
                }
            };
            const {models = [], db = true, context = {}} = config;
            models.forEach(type => {
                const handlers = methods({type, db});
                Object.keys(handlers).forEach(action => {
                    port[`${config.service}.${type}.${action}`] = handlers[action];
                });
            });
            generateContextMethods(port, context, `${config.service}.context`);
            port[`${config.service}.health`] = msg => ({});
            return port;
        }
    ]
};
