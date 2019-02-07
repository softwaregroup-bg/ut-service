const path = require('path');
const utRun = require('ut-run');
const components = [
    require('./components/performance'),
    require('./components/cache'),
    require('./components/script'),
    require('./components/swagger'),
    require('./components/console'),
    require('./components/crypto'),
    require('./components/amqp'),
    require('./components/db')
];
const defaultConfig = {
    producer: false,
    consumer: false,
    cache: false,
    console: false,
    crypto: false,
    db: false,
    performance: false,
    // don't disable script port by default as it doesn't require any particular settings
    // script: false,
    swagger: false
};

module.exports = Object.defineProperty(function utService() {
    return components.reduce((all, component) => {
        return {
            ports: all.ports.concat(component.ports)
        };
    }, {ports: []});
}, 'run', {
    value: async function run(params = {}, parent = module.parent) {
        if (!params.root) {
            params.root = path.dirname(parent.filename);
        }
        if (!params.resolve) {
            params.resolve = (request, options = {paths: parent.paths.concat(params.root)}) => {
                return require.resolve(request, options);
            };
        }
        const config = await utRun.getConfig(params, parent);
        if (!config.port) {
            config.port = {};
        }
        if (!config.port.service) {
            config.port.service = config.service;
        }
        params.config = Object.assign({}, defaultConfig, config);
        params.main = components.concat(params.main).filter(x => x);
        return utRun.run(params, parent);
    }
});
