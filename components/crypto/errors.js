module.exports = (bus) => {
    const {defineError, getError, fetchErrors} = bus.errors;
    if (!getError('crypto')) {
        const Crypto = defineError('crypto', null, 'Crypto error', 'error');
        // constraint errors
        const Constraint = defineError('constraint', Crypto, 'Crypto constraint error', 'error');
        defineError('notFound', Constraint, 'Crypto constraint not found');

        // index errors
        const Index = defineError('index', Crypto, 'Crypto index error', 'error');
        defineError('notFound', Index, 'Crypto index not found');

        // record errors
        const Record = defineError('record', Crypto, 'Crypto record error', 'error');
        defineError('notFound', Record, 'Crypto record not found');

        // health errors
        const Health = defineError('health', Crypto, 'Crypto health error', 'error');
        defineError('notFound', Health, 'Crypto health not found');
    }
    return fetchErrors('crypto');
};
