const errorsFactory = require('./errors');
const sync = require('./sync');
module.exports = function crypto(config = {}) {
    return {
        ports: [
            function crypto(config = {}) {
                const port = {
                    id: 'crypto',
                    createPort: require('ut-port-http'),
                    logLevel: 'trace',
                    imports: ['crypto'],
                    namespace: ['crypto'],
                    url: 'http://127.0.0.1:8099',
                    mock: false,
                    autoSync: {
                        interval: 3000,
                        retries: 5
                    },
                    models: {},
                    raw: {
                        json: true,
                        jar: true,
                        strictSSL: false,
                        forever: true,
                        agentOptions: {
                            keepAliveMsecs: 30000,
                            maxFreeSockets: 1000
                        }
                    },
                    parseResponse: false,
                    start() {
                        Object.assign(this.errors, errorsFactory(this.bus));
                    },
                    ready() {
                        if (!this.config.autoSync) {
                            return;
                        }
                        return sync(this);
                    }
                };
                const handlers = config.mock ? require('./mock')() : require('./handlers');
                Object.keys(handlers).forEach(name => {
                    port[`crypto.${name}`] = handlers[name];
                });
                return port;
            }
        ]
    };
};
