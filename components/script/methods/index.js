const methods = {
    get: require('./get'),
    add: require('./add'),
    edit: require('./edit'),
    update: require('./update'),
    remove: require('./remove'),
    fetch: require('./fetch')
};

module.exports = ({type, db = false}) => {
    const api = {};
    Object.keys(methods).forEach(method => {
        api[method] = methods[method]({type, db});
    });
    return api;
};
