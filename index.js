const utRun = require('ut-run');
const components = [
    require('./components/performance'),
    require('./components/script'),
    require('./components/swagger'),
    require('./components/console'),
    require('./components/crypto'),
    require('./components/db')
];

module.exports = Object.defineProperty(function utService() {
    return components;
}, 'run', {
    value: function run(params = {}, parent) {
        params.main = components.concat(params.main).filter(x => x);
        return utRun.run(params, parent || module.parent);
    }
});
