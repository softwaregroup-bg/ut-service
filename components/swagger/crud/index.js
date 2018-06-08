const add = require('./add');
const edit = require('./edit');
const fetch = require('./fetch');
const get = require('./get');
const remove = require('./remove');
module.exports = service => model => { // name, schema
    if (!Array.isArray(model)) {
        model = [model];
    }
    return {
        swagger: '2.0',
        info: {
            title: `${service} service api`,
            description: `API for interacting with ${service} data.`,
            version: '1.0'
        },
        produces: ['application/json'],
        basePath: '/api',
        paths: model.reduce((all, spec) => {
            all[`/${service}/${spec.name}`] = {
                post: add(service, spec),
                get: get(service, spec),
                patch: edit(service, spec),
                delete: remove(service, spec)
            };
            all[`/${service}/${spec.name}/search`] = {
                post: fetch(service, spec)
            };
            return all;
        }, {}),
        definitions: {
            uuid: {
                type: 'string',
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$'
            },
            error: {
                type: 'object',
                properties: {
                    error: {
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string'
                            },
                            message: {
                                type: 'string'
                            }
                        },
                        required: ['type', 'message'],
                        additionalProperties: true
                    }
                },
                required: ['error']
            }
        }
    };
};
