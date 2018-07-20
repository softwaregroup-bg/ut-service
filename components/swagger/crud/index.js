const definitions = require('./definitions');
const routes = [
    require('./routes/add'),
    require('./routes/edit'),
    require('./routes/update'),
    require('./routes/fetch'),
    require('./routes/get'),
    require('./routes/remove')
];
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
        paths: model.filter(x => x).reduce((paths, spec) => {
            routes.forEach(route => {
                const {path, method, definition} = route(service, spec);
                if (!paths[path]) {
                    paths[path] = {};
                } else if (paths[path][method]) {
                    throw new Error(`Method: ${method} is already defined for path: ${path}`);
                }
                paths[path][method] = definition;
            });
            return paths;
        }, {}),
        definitions
    };
};
