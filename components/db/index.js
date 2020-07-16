
const errorsFactory = require('./errors');
module.exports = {
    ports: [
        function db(config = {}) {
            const namespace = config.namespace
                ? Array.from(new Set([`db/${config.service}`, ...config.namespace]))
                : [`db/${config.service}`];
            const imports = config.imports
                ? Array.from(new Set([`db/${config.service}`, ...config.imports]))
                : [`db/${config.service}`];

            return {
                id: 'db',
                createPort: require('ut-port-sql'),
                logLevel: 'trace',
                createTT: true,
                createCRUD: true,
                linkSP: true,
                namespace,
                imports,
                start() {
                    Object.assign(this.errors, errorsFactory(this.bus));
                }
            };
        }
    ]
};
