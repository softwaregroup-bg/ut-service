const {add, edit, update, fetch, get, remove} = require('./methods');
const definitions = require('./definitions');
module.exports = service => (model, basePath = '/api') => {
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
        basePath,
        paths: model.filter(x => x).reduce((all, spec) => {
            all[`/${service}/${spec.name}`] = {
                post: add(service, spec),
                get: get(service, spec),
                patch: edit(service, spec),
                put: update(service, spec),
                delete: remove(service, spec)
            };
            all[`/${service}/${spec.name}/search`] = {
                post: fetch(service, spec)
            };
            return all;
        }, {}),
        definitions
    };
};
