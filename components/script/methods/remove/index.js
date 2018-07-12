module.exports = ({type, db}) => {
    return async function remove(msg, $meta) {
        const {id} = msg;
        await this.bus.importMethod('crypto.record.remove')({id});
        if (db) {
            await this.bus.importMethod(`db/${$meta.method}`)({externalId: id});
        }
        return {id};
    };
};
