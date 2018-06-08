exports.request = function(msg, $meta) {
    return {
        uri: `/api/record/${msg.id}/`,
        httpMethod: 'GET'
    };
};

exports.error = function(err, $meta) {
    if (err && err.code === 404) {
        throw this.errors['crypto.resourceNotFound']({params: {
            resourceType: 'record'
        }});
    }
    throw err;
};
