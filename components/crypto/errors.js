module.exports = (bus) => {
    let {defineError, getError, fetchErrors} = bus.errors;
    if (!getError('crypto')) {
        let Crypto = defineError('crypto', null, 'crypto error', 'error');
        defineError('resourceNotFound', Crypto, 'Resource not found. Resource type: {resourceType}');
        defineError('resourceAlreadyExists', Crypto, 'Resource already exists. Resource type: {resourceType}');
    }
    return fetchErrors('crypto');
};
