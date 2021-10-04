import Network from "./network";


class Database {

    createItem = (partition, item) => {
        return Network.instance.post({
            module_name: 'cloud.database.create_item',
            partition, item
        });
    };

    updateItem = (itemId, item) => {
        return Network.instance.post({
            module_name: 'cloud.database.update_item',
            item_id: itemId,
            item
        });
    };

    getItem = (itemId) => {
        return Network.instance.post({
            module_name: 'cloud.database.get_item',
            item_id: itemId
        });
    };

    deleteItem = (itemId) => {
        return Network.instance.post({
            module_name: 'cloud.database.delete_item',
            item_id: itemId
        });
    };

    queryItems = (partition, query, limit=100, reverse=false, start_key=null, sort_key='creation_date', join={}) => {
        return Network.instance.post({
            module_name: 'cloud.database.query_items',
            partition, query, limit, reverse, start_key, sort_key, join
        });
    };

    batchUpdateItems = (pairs) => {
        return Network.instance.post({
            module_name: 'cloud.database.update_items',
            pairs
        })
    };

    batchDeleteItems = (item_ids) => {
        return Network.instance.post({
            module_name: 'cloud.database.delete_items',
            item_ids
        })
    };

    async *generateItems(partition, query, limit=100, reverse=false, sort_key='creation_date', join={}) {
        let start_key = null;
        let response = await this.queryItems(partition, query, limit, reverse, start_key, sort_key, join);
        start_key = response.end_key;
        for (let item of response.items){
            yield item;
        }
        while (start_key){
            let response = await this.queryItems(partition, query, limit, reverse, start_key, sort_key, join);
            start_key = response.end_key;
            for (let item of response.items){
                yield item;
            }
        }
    }

}

export default Database;
