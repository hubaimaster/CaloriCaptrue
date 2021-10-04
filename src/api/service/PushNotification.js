import API from '../API';
import Config from '../Config';


export default class PushNotification {

    sendPushNotification = (match_id, message) => {
        return API.logic.runFunction(Config.functionName, {
            cmd: 'notification.send_notification',
            match_id, message
        })
    };

}
