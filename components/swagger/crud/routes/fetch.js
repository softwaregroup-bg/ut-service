module.exports = ({service, name, schema}) => {
    return {
        path: `/${service}/${name}/search`,
        method: 'post',
        definition: {
            'x-bus-method': `${service}.${name}.fetch`,
            operationId: `fetch${name}`,
            tags: [name],
            description: `Search for ${name} by specific criteria.`,
            parameters: [{
                name: 'body',
                in: 'body',
                description: 'body',
                required: true,
                schema: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        criteria: {
                            type: 'object',
                            description: 'Search criteria'
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                pageNumber: {
                                    type: 'integer',
                                    minimum: 0
                                },
                                pageSize: {
                                    example: 10,
                                    minimum: 1,
                                    type: 'integer'
                                }
                            }
                        }
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
                    description: 'Records successfully obtained',
                    schema: {
                        type: 'object',
                        required: ['records', 'pagination'],
                        properties: {
                            records: {
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
                            },
                            pagination: {
                                type: 'object',
                                required: [
                                    'pageNumber',
                                    'pageSize',
                                    'totalPages',
                                    'totalElements'
                                ],
                                properties: {
                                    pageNumber: {
                                        type: 'integer'
                                    },
                                    pageSize: {
                                        type: 'integer',
                                        minimum: 1
                                    },
                                    totalPages: {
                                        type: 'integer'
                                    },
                                    totalElements: {
                                        type: 'integer'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
};
