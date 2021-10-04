import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid, Platform} from 'react-native';
// Geolocation.setRNConfiguration(config);


class GPS {

    static getCurrentLocation = () => {
        return new Promise(resolve => {
            Geolocation.getCurrentPosition(info => {
                console.log(info);
                resolve(info);
            }, (error)=>{}, {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
        });
    };

    static requestLocationPermission = () => {
        (async ()=>{
            try {
                let granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "위치 권한이 필요합니다.",
                        message:
                            "가까운 사용자를 매칭하기 위해 사욜합니다.",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use the location");
                } else {
                    console.log("Location permission denied");
                }

                granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                    {
                        title: "위치 권한이 필요합니다.",
                        message:
                            "가까운 사용자를 매칭하기 위해 사욜합니다.",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use the location");
                } else {
                    console.log("Location permission denied");
                }
            } catch (err) {
                console.warn(err);
            }
        })();
        try {
            Geolocation.requestAuthorization();
        } catch (err) {
            console.warn(err);
        }
        if (Platform.OS === 'android'){

        }else if (Platform.OS === 'ios'){

        }
    };

    static getNormalize = (location) => {
        location = location.coords;
        let lat = location.latitude;
        let long = location.longitude;
        let info = {
            lat, long
        };
        if (lat < 10){
            lat = "00" + lat.toString();
        }else if (lat < 100){
            lat = "0" + lat.toString();
        }else{
            lat = lat.toString();
        }
        lat = lat.replace(".", "");

        if (long < 10){
            long = "00" + long.toString();
        }else if (lat < 100){
            long = "0" + long.toString();
        }else{
            long = long.toString();
        }
        long = long.replace(".", "");

        while (long.length > lat.length){
            lat += "0";
        }

        while (lat.length > long.length){
            long += "0";
        }

        while (16 > lat.length){
            lat += "0";
        }

        while (16 > long.length){
            long += "0";
        }

        lat = lat.substring(0, 16);
        long = long.substring(0, 16);

        let normalized = {};
        let count = 0;
        while (lat.length > 0){
            lat = lat.substring(0, lat.length - 1);
            long = long.substring(0, long.length - 1);
            normalized[count] = {
                lat, long
            };
            count++;
        }
        info.normalized = normalized;
        return info;
}

}

export default GPS;
