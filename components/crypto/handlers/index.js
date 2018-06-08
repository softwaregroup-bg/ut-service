const entities = {
    index: require('./index/index'),
    constraint: require('./constraint'),
    record: require('./record'),
    health: require('./health')
};
const conversions = {
    'request': 'send',
    'response': 'receive',
    'error': 'receive'
};
const defaultHooks = {
    request: function(msg, $meta) {
        return msg;
    },
    response: function(msg, $meta) {
        return msg.payload || {};
    },
    error: function(err, $meta) {
        throw this.errors.crypto(err);
    }
};

const handlers = {};

for (var entity in entities) {
    let methods = entities[entity];
    for (var method in methods) {
        let hooks = methods[method];
        for (var hook in defaultHooks) {
            handlers[`${entity}.${method}.${hook}.${conversions[hook]}`] = hooks[hook] || defaultHooks[hook];
        }
    };
};

module.exports = handlers;
