module.exports = ({type, db}) => {
    return async function edit(msg, $meta) {
        const { id, data } = msg;
        const sync = ($meta.requestHeaders && $meta.requestHeaders['x-sync']) || false;
        const cryptoResult = await this.bus.importMethod('crypto.record.get')({id});
        if (db) {
            await this.bus.importMethod(`db/${$meta.method}`)(Object.assign({}, data, {externalId: id}));
        }
        try {
            await this.bus.importMethod('crypto.record.update')({id, type, data, sync});
        } catch (e) {
            if (db) {
                await this.bus.importMethod(`db/${$meta.method}`)(Object.assign({}, cryptoResult.data, {externalId: id}));
            }
            throw e;
        }
        return data;
    };
};
