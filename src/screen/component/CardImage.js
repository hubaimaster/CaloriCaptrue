import * as React from 'react';
import API from '../../api/API';
import ImageUtil from '../../util/ImageUtil';
import Ic from '../img/icon_fill.png';
import {View} from 'react-native-ui-lib/core';
import {Card} from 'react-native-ui-lib';
import {Alert} from 'react-native';


export default function CardImage(props) {

    const [image, setImage] = React.useState(null);
    const [imageId, setImageId] = React.useState(props.image_id);

    React.useEffect(()=>{
        setImageId(props.image_id);
        API.storage.downloadB64(image_id).then(data => {
            let b64 = data.file_b64;
            let imageB64 = ImageUtil.getImageBase64(b64);
            setImage(imageB64);
        });
    }, [imageId]);

    let height = 300;
    let width = 'auto';

    if (props.height){
        height = props.height;
    }
    if (props.width){
        width = props.width;
    }

    let image_id = props.image_id;
    if (!image_id){
        height = 0;
    }


    return <Card.Section imageSource={{uri: image}} imageStyle={{height: height, width: width}} style={{
            borderRadius: 10
        }}/>

}
