import {Alert} from 'react-native';


class ImageUtil {

    static getImageBase64 = (b64) => {
        console.log("b64:" + b64);
        return "data:image/png;base64," + b64;
    };

}

export default ImageUtil;
