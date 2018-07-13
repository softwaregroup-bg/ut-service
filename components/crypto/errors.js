module.exports = (bus) => {
    const {defineError, getError, fetchErrors} = bus.errors;
    if (!getError('crypto')) {
        const Crypto = defineError('crypto', null, 'Crypto error', 'error');
        // constraint errors
        const Constraint = defineError('constraint', Crypto, 'Cryoto constraint error', 'error');
        defineError('notFound', Constraint, 'Crypto constraint not found');

        // index errors
        const Index = defineError('index', Crypto, 'cryoto constraint error', 'error');
        defineError('notFound', Index, 'Crypto index not found');

        // record errors
        const Record = defineError('record', Crypto, 'cryoto constraint error', 'error');
        defineError('notFound', Record, 'Crypto record not found');

        // health errors
        const Health = defineError('health', Crypto, 'cryoto constraint error', 'error');
        defineError('notFound', Health, 'Crypto health not found');
    }
    return fetchErrors('crypto');
};
