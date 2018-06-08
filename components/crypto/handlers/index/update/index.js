exports.request = function(msg, $meta) {
    return {
        uri: '/api/configuration/index/',
        httpMethod: 'PUT',
        payload: msg
    };
};

exports.error = function(err, $meta) {
    if (err && err.code === 404) {
        throw this.errors['crypto.resourceAlreadyExists']({params: {
            resourceType: 'index'
        }});
    }
    throw err;
};
