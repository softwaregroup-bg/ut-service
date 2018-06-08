const methods = {
    get: require('./get'),
    add: require('./add'),
    edit: require('./edit'),
    remove: require('./remove'),
    fetch: require('./fetch')
};

module.exports = ({type, db}) => {
    const api = {};
    Object.keys(methods).forEach(method => {
        api[method] = methods[method]({type, db});
    });
    return api;
};
