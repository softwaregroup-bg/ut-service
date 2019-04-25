const errorsFactory = require('./errors');
const sync = require('./sync');
module.exports = () => (...params) => class crypto extends require('ut-port-http')(...params) {
    get defaults() {
        return {
            id: 'crypto',
            logLevel: 'trace',
            namespace: ['crypto', 'test'],
            imports: ['crypto'],
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
            parseResponse: false
        };
    }
    handlers() {
        const handlers = this.config.mock ? require('./mock')() : require('./handlers');
        return Object.entries(handlers).reduce((all, [name, handler]) => {
            all[`crypto.${name}`] = handler;
            return all;
        }, {
            start() {
                Object.assign(this.errors, errorsFactory(this.bus));
            },
            ready() {
                return this.config.autoSync ? sync(this) : true;
            }
        });
    }
};
