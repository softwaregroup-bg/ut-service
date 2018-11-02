const crud = require('./crud');
const definitions = require('./definitions');
const generateSchema = require('generate-schema');
const interpolationRegex = /^\$\{[\w]+(\.[\w]+)*\}$/g;
const preProcess = (schema, context) => {
    switch (typeof schema) {
        case 'string':
            if (interpolationRegex.test(schema)) {
                const tokens = schema.slice(2, -1).split('.');
                while (tokens.length) {
                    context = context[tokens.shift()];
                    if (!context) {
                        return schema;
                    }
                }
                return context;
            }
            return schema;
        case 'object':
            if (Array.isArray(schema)) {
                return schema.map(item => preProcess(item, context));
            } else {
                return Object.keys(schema).reduce((all, key) => {
                    all[key] = preProcess(schema[key], context);
                    return all;
                }, {});
            }
        default:
            return schema;
    }
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
                    schema: definitions.error
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

const generateMetaRoutes = service => {
    const routes = {};
    routes[`/${service}/health`] = {
        get: {
            operationId: `${service}.health`,
            tags: ['context'],
            description: `${service}.health`,
            'x-bus-method': `${service}.health`,
            responses: {
                default: {
                    description: 'Invalid request.',
                    schema: definitions.error
                },
                200: {
                    description: 'Health status ok',
                    schema: {
                        type: 'object',
                        properties: {},
                        additionalProperties: false
                    }
                }
            }
        }
    };
    return routes;
};

module.exports = {
    ports: [
        function swagger(config = {}) {
            const {service, context = {}} = config;
            return {
                id: 'swagger',
                createPort: require('ut-port-swagger'),
                logLevel: 'trace',
                crud: crud(service),
                server: { // http server options
                    port: 9999
                },
                start() {
                    this.swaggerDocument = preProcess(this.swaggerDocument, context);
                    const contextRoutes = generateContextRoutes(context, `/${service}/context`);
                    const metaRoutes = generateMetaRoutes(service);
                    Object.assign(this.swaggerDocument.paths, contextRoutes, metaRoutes);
                }
            };
        }
    ]
};
