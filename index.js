const utRun = require('ut-run');
const components = [
    require('./components/performance'),
    require('./components/cache'),
    require('./components/script'),
    require('./components/swagger'),
    require('./components/console'),
    require('./components/crypto'),
    require('./components/db')
];

module.exports = Object.defineProperty(function utService() {
    return components.reduce((all, component) => {
        return {
            ports: all.ports.concat(component.ports)
        };
    }, {ports: []});
}, 'run', {
    value: function run(params = {}, parent) {
        params.main = components.concat(params.main).filter(x => x);
        return utRun.run(params, parent || module.parent);
    }
});
