module.exports = ({type}) => {
    return async function get(msg, $meta) {
        const idArray = msg.id.split(',');
        if (msg.id) {
            const cryptoData = await this.bus.importMethod('crypto.record.getBulk')(idArray);
            return cryptoData.records.reduce((all, record) => {
                all.push({
                    id: record.id,
                    data: record.data
                });
                return all;
            }, []);
        }
        return idArray.reduce((all, id) => {
            all.push({
                id,
                data: []
            });
            return all;
        }, []);
    };
};
