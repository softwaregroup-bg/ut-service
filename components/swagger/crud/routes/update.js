module.exports = ({service, name, schema}) => {
    return {
        path: `/${service}/${name}`,
        method: 'put',
        spec: {
            'x-bus-method': `${service}.${name}.update`,
            operationId: `update${name}`,
            tags: [name],
            description: `Update a ${name}.`,
            parameters: [{
                name: 'body',
                in: 'body',
                description: 'body',
                required: true,
                schema: {
                    type: 'object',
                    required: [
                        'id',
                        'data'
                    ],
                    properties: {
                        id: {
                            $ref: '#/definitions/uuid'
                        },
                        sync: {
                            $ref: '#/definitions/sync'
                        },
                        data: schema
                    }
                }
            }],
            responses: {
                default: {
                    description: 'Invalid request.',
                    schema: {
                        $ref: '#/definitions/error'
                    }
                },
                200: {
                    description: 'Record successfully updated',
                    schema: {
                        type: 'object',
                        required: ['id'],
                        properties: {
                            id: {
                                $ref: '#/definitions/uuid'
                            }
                        }
                    }
                }
            }
        }
    };
};
