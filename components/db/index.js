
const errorsFactory = require('./errors');
module.exports = {
    ports: [
        function db(config = {}) {
            return {
                id: 'db',
                createPort: require('ut-port-sql'),
                logLevel: 'trace',
                createTT: true,
                createCRUD: true,
                linkSP: true,
                namespace: [`db/${config.service}`],
                imports: [`db/${config.service}`],
                start() {
                    Object.assign(this.errors, errorsFactory(this.bus));
                }
            };
        }
    ]
};
