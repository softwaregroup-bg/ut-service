
const errorsFactory = require('./errors');
module.exports = ({namespace}) => (...params) => class db extends require('ut-port-sql')(...params) {
    get defaults() {
        return {
            createTT: true,
            createCRUD: true,
            linkSP: true,
            namespace: `db/${namespace}`,
            imports: [`db/${namespace}`, 'sql', 'db']
        };
    }

    handlers() {
        return {
            start() {
                Object.assign(this.errors, errorsFactory(this.bus));
            }
        };
    }
};
