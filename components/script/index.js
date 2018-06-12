const errorsFactory = require('./errors');
const methods = require('./methods');

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
            (config.models || []).forEach(type => {
                const handlers = methods({type});
                Object.keys(handlers).forEach(action => {
                    port[`${config.service}.${type}.${action}`] = handlers[action];
                });
            });
            return port;
        }
    ]
};
