exports.request = function(msg, $meta) {
    return {
        uri: `/api/configuration/index/${msg.documentType}/`,
        httpMethod: 'GET',
        allowedStatusCodes: msg.allowedStatusCodes
    };
};

exports.error = function(err, $meta) {
    if (err && err.code === 404) {
        throw this.errors['crypto.resourceNotFound']({params: {
            resourceType: 'index'
        }});
    }
    throw err;
};
