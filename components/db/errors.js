module.exports = (bus) => {
    let {defineError, getError, fetchErrors} = bus.errors;
    if (!getError('db')) {
        let DB = defineError('db', null, 'db error', 'error');
        let Customer = defineError('customer', DB, 'customer error', 'error');
        defineError('smth', Customer, 'some error message', 'error');
    }
    return fetchErrors('db');
};
