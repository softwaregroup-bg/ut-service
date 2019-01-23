module.exports = ({service, name}) => {
    return {
        path: `/${name}/{id}`,
        method: 'delete',
        spec: {
            'x-bus-method': `${service}.${name}.remove`,
            operationId: `remove${name}`,
            tags: [name],
            description: `Remove ${name}.`,
            parameters: [{
                name: 'id',
                in: 'path',
                description: 'id',
                required: true,
                $ref: '#/definitions/uuid'
            }],
            responses: {
                default: {
                    description: 'Invalid request.',
                    schema: {
                        $ref: '#/definitions/error'
                    }
                },
                200: {
                    description: 'Record successfully deleted',
                    schema: {
                        type: 'object',
                        required: ['id'],
                        additionalProperties: false,
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
