exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/remove/',
        httpMethod: 'DELETE',
        payload: msg
    };
};

exports.error = function(err, $meta) {
    throw this.errors.crypto({
        cause: err,
        details: {
            statusCode: 404
        }
    });
};
