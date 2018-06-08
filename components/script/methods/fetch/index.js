module.exports = ({type}) => {
    return async function fetch(msg) {
        msg.documentType = type;
        let cryptoResult = await this.bus.importMethod('crypto.record.fetch')(msg);
        return {
            pagination: cryptoResult.pagination,
            records: cryptoResult.records.map(record => {
                return {
                    id: record.id,
                    data: record.data
                };
            })
        };
    };
};
