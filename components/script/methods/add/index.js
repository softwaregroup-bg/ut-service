module.exports = ({type, db}) => {
    return async function add(msg, $meta) {
        // const async = $meta.requestHeaders['x-async'];
        const crypto = await this.bus.importMethod('crypto.record.add')({type, data: msg, skipIndex: db /* , async */});
        if (db) {
            msg.cryptoId = crypto.id;
            try {
                await this.bus.importMethod(`db/${$meta.method}`)(msg);
            } catch (e) {
                await this.bus.importMethod('crypto.record.remove')({id: crypto.id});
                throw e;
            }
            await this.bus.importMethod('crypto.record.index')({id: crypto.id});
        }
        return {
            id: crypto.id
        };
    };
};
