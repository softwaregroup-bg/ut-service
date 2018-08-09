const generateSchema = require('generate-schema');
const definitions = require('./definitions');
const routes = [
    require('./routes/add'),
    require('./routes/edit'),
    require('./routes/update'),
    require('./routes/fetch'),
    require('./routes/get'),
    require('./routes/remove')
];
const interpolationRegexp = /^\$\{[\w]+(\.[\w]+)*\}$/g;
const interpolate = (target, context) => {
    if (typeof target === 'string' && interpolationRegexp.test(target)) {
        const tokens = target.slice(2, -1).split('.');
        while (tokens.length) {
            context = context[tokens.shift()];
            if (!context) {
                return target;
            }
        }
        return context;
    }
    return target;
};

const preProcess = (schema, context) => {
    Object.keys(schema).forEach(key => {
        const value = schema[key];
        switch (typeof value) {
            case 'string':
                schema[key] = interpolate(value, context);
                break;
            case 'object':
                if (Array.isArray(value)) {
                    schema[key] = value.map(item => interpolate(item, context));
                } else {
                    schema[key] = preProcess(value, context);
                }
                break;
            default:
                break;
        }
    });
    return schema;
};

const generateContextRoutes = (context, path, paths = {}) => {
    const tokens = path.split('/').filter(x => x);
    const method = tokens.join('.');
    const schema = generateSchema.json(tokens.join(' '), context);
    // delete $schema property as it is in conflict with swagger 2 specification
    delete schema.$schema;
    paths[path] = {
        get: {
            operationId: method,
            tags: ['context'],
            description: method,
            'x-bus-method': method,
            responses: {
                default: {
                    description: 'Invalid request.',
                    schema: {
                        $ref: '#/definitions/error'
                    }
                },
                200: {
                    description: 'Record successfully obtained',
                    schema
                }
            }
        }
    };
    if (typeof context === 'object' && !Array.isArray(context)) {
        Object.keys(context).forEach(key => {
            generateContextRoutes(context[key], `${path}/${key}`, paths);
        });
    };

    return paths;
};

/**
 * @param {string} service - The name of the service. E.g
 * @returns {function} - a crud factory function
 */
module.exports = (service, context) => {
    /**
     * @param {object} options - the documentation properties that are needed to create the swagger spec
     * @param {object} options.schemas - a key-value collection of primary object schemas
     * @param {object} options.context - a key-value collection of context parameters.
     * values referencing them will be resolved automatically.
     * GET /context/a/b/c routes will be created automatically
     * @param {string} options.basePath - collection of schemas
     * @returns {object} - swagger document
     */
    return ({schemas = {}, basePath = '/api'}) => {
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
        const contextRoutes = generateContextRoutes(context, `/${service}/context`);
        const primaryRoutes = Object.keys(schemas).reduce((paths, name) => {
            const schema = preProcess(schemas[name], context);
            routes.forEach(route => {
                const {path, method, definition} = route(service, {name, schema});
                if (!paths[path]) {
                    paths[path] = {};
                } else if (paths[path][method]) {
                    throw new Error(`Method: ${method} is already defined for path: ${path}`);
                }
                paths[path][method] = definition;
            });
            return paths;
        }, {});
        swaggerDocument.paths = Object.assign({}, primaryRoutes, contextRoutes);
        return swaggerDocument;
    };
};
