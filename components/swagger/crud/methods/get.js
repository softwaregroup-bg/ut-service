module.exports = (service, spec) => {
    let { name, schema } = spec;
    return {
        'x-bus-method': `${service}.${name}.get`,
        operationId: `get${name}`,
        tags: [name],
        description: `Get a ${name}.`,
        parameters: [{
            name: 'id',
            in: 'query',
            description: 'id',
            required: true,
            type: 'array',
            items: {
                $ref: '#/definitions/uuid'
            },
            collectionFormat: 'csv'
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
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                $ref: '#/definitions/uuid'
                            },
                            data: schema
                        }
                    }
                }
            }
        }
    };
};
