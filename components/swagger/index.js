const crud = require('./crud');
module.exports = {
    ports: [
        function swagger(config = {}) {
            const {service, context = {}} = config;
            return {
                id: 'swagger',
                createPort: require('ut-port-swagger'),
                logLevel: 'trace',
                crud: crud(service, context),
                server: { // http server options
                    port: 9999
                }
            };
        }
    ]
};
