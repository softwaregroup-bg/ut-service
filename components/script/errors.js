module.exports = (bus) => {
    let {defineError, getError, fetchErrors} = bus.errors;
    if (!getError('script')) {
        let Script = defineError('script', null, 'script error', 'error');
        defineError('resourceNotFound', Script, 'Resource not found. Resource type: {resourceType}');
        defineError('validationError', Script, 'Validation error: {paths}');
    }
    return fetchErrors('script');
};
