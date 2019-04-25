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
                    if (!context) return schema;
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

const generateMetaRoutes = ({namespace, context = {}, models = {}, prefix = '/meta'}) => {
    const getPath = path => prefix ? `${prefix}${path}` : path;
    const contextRoutes = (data, path = '/context', paths = {}) => {
        const tokens = [namespace].concat(path.split('/').filter(x => x));
        const method = tokens.join('.');
        const schema = generateSchema.json(tokens.join(' '), data);
        // delete $schema property as it is in conflict with swagger 2 specification
        delete schema.$schema;
        paths[getPath(path)] = {
            get: {
                operationId: method,
                tags: ['metadata'],
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
        if (typeof data === 'object' && !Array.isArray(data)) {
            Object.keys(data).forEach(key => {
                contextRoutes(data[key], `${path}/${key}`, paths);
            });
        };

        return paths;
    };
    // context
    const routes = contextRoutes(context);
    // health
    routes[getPath('/health')] = {
        get: {
            operationId: `${namespace}.health`,
            tags: ['metadata'],
            description: `${namespace}.health`,
            'x-bus-method': `${namespace}.health`,
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
    // models
    routes[getPath('/models')] = {
        get: {
            operationId: `${namespace}.models`,
            tags: ['metadata'],
            description: `${namespace}.models`,
            'x-bus-method': `${namespace}.models`,
            responses: {
                default: {
                    description: 'Invalid request.',
                    schema: definitions.error
                },
                200: {
                    description: 'Models definitions',
                    schema: {
                        type: 'object',
                        properties: {},
                        additionalProperties: true
                    }
                }
            }
        }
    };
    Object.keys(models).forEach(key => {
        const schema = generateSchema.json(`model ${key}`, models[key]);
        // delete $schema property as it is in conflict with swagger 2 specification
        delete schema.$schema;
        routes[getPath(`/models/${key}`)] = {
            get: {
                operationId: `${namespace}.models.${key}`,
                tags: ['metadata'],
                description: `${namespace}.models.${key}`,
                'x-bus-method': `${namespace}.models.${key}`,
                responses: {
                    default: {
                        description: 'Invalid request.',
                        schema: definitions.error
                    },
                    200: {
                        description: `${key} model`,
                        schema
                    }
                }
            }
        };
    });
    return routes;
};

module.exports = ({namespace, context, models}) => {
    return (...params) => class swagger extends require('ut-port-swagger')(...params) {
        crud(config = {}) {
            return crud({namespace, models})(config);
        }
        handlers() {
            return {
                start() {
                    this.swaggerDocument = preProcess(this.swaggerDocument, context);
                    const metaRoutes = generateMetaRoutes({
                        namespace,
                        context,
                        models: Object.keys(models).reduce((all, key) => {
                            if (models[key].schema) {
                                all[key] = models[key].schema;
                            }
                            return all;
                        }, {})
                    });
                    Object.assign(this.swaggerDocument.paths, metaRoutes);
                }
            };
        }
    };
};
