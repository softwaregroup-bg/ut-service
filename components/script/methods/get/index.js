module.exports = ({type}) => {
    return async function get(msg, $meta) {
        const cryptoData = await this.bus.importMethod('crypto.record.getBulk')(msg.id.split(','));
        return cryptoData.records.map(record => {
            return {
                id: record.id,
                data: record.data
            };
        });
    };
};
