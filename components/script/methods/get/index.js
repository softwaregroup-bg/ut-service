module.exports = ({type}) => {
    return async function get(msg, $meta) {
        const {id, data} = await this.bus.importMethod('crypto.record.get')({id: msg.id});
        return {id, data};
    };
};
