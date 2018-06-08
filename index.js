const components = [
    require('./components/performance'),
    require('./components/script'),
    require('./components/swagger'),
    require('./components/console'),
    require('./components/crypto'),
    require('./components/db')
];
const utRun = require('ut-run');
module.exports = (params = {}, parent) => {
    // params.main = ({bus, config}) => components.map(component => component({bus, config}));
    params.main = components.concat(params.main).filter(x => x);
    return utRun.run(params, parent || module.parent);
};
