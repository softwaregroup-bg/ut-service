module.exports = (service, spec) => {
    let { name, schema } = spec;
    return {
        'x-bus-method': `${service}.${name}.add`,
        operationId: `add${name}`,
        tags: [name],
        description: `Creates a new ${name}.`,
        parameters: [{
            name: 'body',
            in: 'body',
            description: 'body',
            required: true,
            schema: schema
        }],
        responses: {
            default: {
                description: 'Invalid request.',
                schema: {
                    $ref: '#/definitions/error'
                }
            },
            200: {
                description: 'Successful request.',
                schema: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                }
            }
        }
    };
};
