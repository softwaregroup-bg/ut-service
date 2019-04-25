const errorsFactory = require('./errors');
const methods = require('./methods');
const generateContextMethods = (handlers, context, method) => {
    handlers[method] = msg => context;
    if (typeof context === 'object' && !Array.isArray(context)) {
        Object.keys(context).forEach(key => {
            generateContextMethods(handlers, context[key], `${method}.${key}`);
        });
    };
};

const generateMetaMethods = (handlers, models = {}, namespace) => {
    handlers[`${namespace}.health`] = msg => ({});
    handlers[`${namespace}.models`] = msg => (Object.keys(models).reduce((all, key) => {
        all[key] = `/meta/models/${key}`;
        return all;
    }, {}));
    Object.keys(models).forEach(name => {
        const model = models[name].schema;
        if (model) {
            handlers[`${namespace}.models.${name}`] = msg => model;
        }
    });
};

module.exports = ({namespace, models, context}) => (...params) => class script extends require('ut-port-script')(...params) {
    get defaults() {
        return {
            db: true,
            crypto: true,
            models: {},
            imports: [namespace],
            namespace: [namespace],
            start() {
                Object.assign(this.errors, errorsFactory(this.bus));
            }
        };
    }
    handlers() {
        const handlers = {
            start() {
                Object.assign(this.errors, errorsFactory(this.bus));
            }
        };
        const {db = true} = this.config;
        Object.keys(models).forEach(type => {
            const actions = methods({type, db});
            Object.keys(actions).forEach(action => {
                handlers[`${namespace}.${type}.${action}`] = actions[action];
            });
        });
        generateContextMethods(handlers, context, `${namespace}.context`);
        generateMetaMethods(handlers, models, namespace);
        return handlers;
    }
};
