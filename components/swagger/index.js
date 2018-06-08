const crud = require('./crud');
module.exports = {
    ports: [
        function swagger(config = {}) {
            // if (typeof config.swagger === 'function') {
            //     config.swaggerDocument = config.swagger(crud(config.service));
            //     delete config.swagger;
            // }
            return {
                id: 'swagger',
                createPort: require('ut-port-swagger'),
                logLevel: 'trace',
                crud: crud(config.service)
            };
        }
    ]
};
