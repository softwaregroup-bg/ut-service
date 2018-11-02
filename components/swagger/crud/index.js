const definitions = require('../definitions');
const routes = [
    require('./routes/add'),
    require('./routes/edit'),
    require('./routes/update'),
    require('./routes/fetch'),
    require('./routes/get'),
    require('./routes/remove')
];

/**
 * @param {string} service - The name of the service. E.g
 * @returns {function} - a crud factory function
 */
module.exports = service => {
    /**
     * @param {object} options - the documentation properties that are needed to create the swagger spec
     * @param {object} options.schemas - a key-value collection of primary object schemas
     * @param {string} options.basePath - api base path
     * @returns {object} - swagger document
     */
    return (schemas = {}, basePath = '/api') => {
        const swaggerDocument = {
            swagger: '2.0',
            info: {
                title: `${service} service api`,
                description: `API for interacting with ${service} data.`,
                version: '1.0'
            },
            produces: ['application/json'],
            basePath,
            definitions
        };
        swaggerDocument.paths = Object.keys(schemas).reduce((paths, name) => {
            const schema = schemas[name];
            routes.forEach(route => {
                const {path, method, spec} = route({service, name, schema});
                if (!paths[path]) {
                    paths[path] = {};
                } else if (paths[path][method]) {
                    throw new Error(`Method: ${method} is already defined for path: ${path}`);
                }
                paths[path][method] = spec;
            });
            return paths;
        }, {});
        return swaggerDocument;
    };
};
