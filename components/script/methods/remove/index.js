module.exports = ({type, db}) => {
    return async function remove(msg, $meta) {
        await this.bus.importMethod('crypto.record.remove')({id: msg.id});
        if (db) {
            await this.bus.importMethod(`db/${$meta.method}`)({externalId: msg.id});
        }
        return msg;
    };
};
