module.exports = ({type}) => {
    return async function get(msg, $meta) {
        if (msg.id) {
            const cryptoData = await this.bus.importMethod('crypto.record.getBulk')(msg.id.split(','));
            return cryptoData.records.map(record => record.data);
        }
        return [];
    };
};
