const crud = require('./crud');
module.exports = {
    ports: [
        function swagger(config = {}) {
            return {
                id: 'swagger',
                createPort: require('ut-port-swagger'),
                logLevel: 'trace',
                crud: crud(config.service),
                server: { // http server options
                    port: 9999
                }
            };
        }
    ]
};
