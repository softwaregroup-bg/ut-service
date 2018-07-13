module.exports = ({type, db}) => {
    return async function edit(msg, $meta) {
        const { sync = false, id, data } = msg;
        const cryptoResult = await this.bus.importMethod('crypto.record.get')({id});
        const updatedRecord = this.merge({}, cryptoResult.data, data);
        if (db) {
            await this.bus.importMethod(`db/${$meta.method}`)(Object.assign({}, updatedRecord, {externalId: id}));
        }
        try {
            await this.bus.importMethod('crypto.record.update')({id, type, data: updatedRecord, sync});
        } catch (e) {
            if (db) {
                await this.bus.importMethod(`db/${$meta.method}`)(Object.assign({}, cryptoResult.data, {externalId: id}));
            }
            throw e;
        }
        return {id};
    };
};
