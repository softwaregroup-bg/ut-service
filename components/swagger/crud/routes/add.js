module.exports = ({service, name, schema}) => {
    return {
        path: `/${service}/${name}`,
        method: 'post',
        spec: {
            'x-bus-method': `${service}.${name}.add`,
            operationId: `add${name}`,
            tags: [name],
            description: `Creates a new ${name}.`,
            parameters: [{
                name: 'body',
                in: 'body',
                description: 'body',
                required: true,
                schema: {
                    type: 'object',
                    required: [
                        'data'
                    ],
                    properties: {
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
                201: {
                    description: 'Record successfully created',
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
