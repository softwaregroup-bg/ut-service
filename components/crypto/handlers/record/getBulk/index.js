exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/bulk/',
        httpMethod: 'POST',
        payload: msg
    };
};

exports.error = function(msg, $meta) {
    throw this.errors.crypto({
        details: {
            statusCode: 403
        }
    });
};
