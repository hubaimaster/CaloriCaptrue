import axios from "axios/index"
import { AsyncStorage } from 'react-native';


class Network {

    API = null;
    static instance = new Network();

    constructor(props) {
        this.API = axios.create({
            baseURL: this.getBaseUrl(),
        });
    }

    getBaseUrl = () => {
        return 'https://bs16u2sg7d.execute-api.ap-northeast-2.amazonaws.com/prod_aws_interface/h5ZVNnK22YWqaLNxvkMerh';
    };

    setSessionId = (sessionId) => {
        if (sessionId){
            AsyncStorage.setItem('sessionId', sessionId);
        }else{
            AsyncStorage.setItem('sessionId', 'undefined');
        }

    };

    getSessionId = () => {
        let sessionId = AsyncStorage.getItem('sessionId');
        if (sessionId === null || sessionId === undefined || sessionId === 'undefined'){
            return null;
        }
        return sessionId;
    };

    post = (data) => {
        return new Promise(async (resolve) => {
            data['session_id'] = await this.getSessionId();
            this.API.post('/', data).then((response) => {
                if (Object.keys(response.data).includes('session_id')){
                    this.setSessionId(response.data.session_id);
                }
                resolve(response.data);
            }).catch(error=>{

            });
        })
    }

}

export default Network;
