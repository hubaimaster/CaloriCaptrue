

class TempValue {

    static temp = {};

    static set(key, value){
        TempValue.temp[key] = value;
    }

    static get(key){
        return TempValue.temp[key];
    }

    static clear(){
        TempValue.temp = {};
    }

}


export default TempValue;
