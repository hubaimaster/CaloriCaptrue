import * as React from 'react';
import {Alert, ScrollView, TouchableOpacity} from 'react-native';
import Color from '../../res/Color';
import GPS from '../../location/GPS';
import API from '../../api/API';
import {View, Text, Card, Button, TextField} from 'react-native-ui-lib';
import CardImage from '../component/CardImage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Distance from '../../util/Distance';
import {LoaderScreen} from 'react-native-ui-lib';
import {Platform} from 'react-native';
import TempValue from '../../util/TempValue';


export default function OtherProfileScreen({navigation, route}){

    const myLocation = TempValue.get('myLocation');
    const sports = TempValue.get('sports');

    const getAge = (user) => {
        let birth = user.birth;
        if (!birth){
            return "비공개";
        }
        birth = birth.substring(2, 4);
        return birth + "년생";
    };

    const getSports = async () => {
        let mapping = {};
        let response = await API.database.queryItems("sport", []);
        for (const item of response.items){
            mapping[item.id] = item;
        }
        return mapping;
    };

    const getGender = (gender) => {
        if (gender === 'M'){
            return '남자';
        }
        if (gender === 'F'){
            return '여자';
        }
        return '비공개';
    };

    const getGenderColor = (gender) => {
        if (gender === 'M'){
            return Color.primaryColor;
        }
        if (gender === 'F'){
            return Color.secondaryColor;
        }
        return '#999';
    };


    const getDistanceString = (myLat, myLong, location) => {
        const distance = new Distance().calcCrow(myLat, myLong, location.lat, location.long);
        if (distance < 1){
            if (distance < 0.1){
                return "100m 거리"
            }else{
                return Math.round(distance * 1000) + "m 거리"
            }

        }
        return Math.round(distance * 100) / 100 + "km 거리"
    };

    const renderCard = (location) => {
        return <View key={location.id}  onPress={() => {}}>

            <View marginT-20 paddingL-20 paddingR-20 bg-white marginB-20>
                <View style={{
                    flex: 1,
                    flexDirection: 'row'
                }}>

                    <Text text40 color={'#111'}>
                        {location.user.name}

                    </Text>
                    <View style={{
                        marginLeft: 7,
                        backgroundColor: getGenderColor(location.user.gender),
                        borderRadius: 12,
                        height: 30,
                    }}>
                        <Text style={{
                            margin: 7,
                            height: 20,
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 13,
                            alignContent: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                        }}>
                            {getAge(location.user)} {getGender(location.user.gender)}
                        </Text>

                    </View>

                </View>
                <Text text90 marginL-2 marginT-2 color={'#111'}>
                    {getDistanceString(myLocation.coords.latitude, myLocation.coords.longitude, location)}{
                    location.user.sports.map(sport => {
                        return <Text> / {sports[sport].name}</Text>;
                    })
                }

                </Text>
                <Text row text70 marginB-15 color={'#777'}>
                    {location.user.place}
                </Text>

                <CardImage image_id={location.user.profile_id}/>

            </View>

        </View>
    };

    return <ScrollView style={{
        backgroundColor: 'white'
    }}>
            {renderCard(route.params.location)}
        </ScrollView>

};
