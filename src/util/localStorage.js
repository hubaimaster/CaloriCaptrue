import { AsyncStorage } from 'react-native';


class LocalStorage {

    static setValue(key, value){
        AsyncStorage.setItem(key, JSON.stringify(value));
    }

    static async getValue(key){
        return new Promise(((resolve, reject) => {
            AsyncStorage.getItem(key, (error, result) => {
                if (error){
                    reject(error);
                }else{
                    resolve(JSON.parse(result));
                }
            });
        }));
    }

    static async putValueToItem(itemName, key, value){
        let item = await LocalStorage.getValue(itemName);
        if (item){
            item[key] = value;
        }else{
            item = {
                key: value
            };
        }
        this.setValue(itemName, item);
        alert(JSON.stringify(LocalStorage.getItem(itemName)));
        return true;
    }

    static async getItem(itemName){
        return await LocalStorage.getValue(itemName);
    }

    static async getValueInItem(itemName, key){
        let item = await LocalStorage.getItem(itemName);
        return item[key];
    }


}

export default LocalStorage;
