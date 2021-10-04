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
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
} from 'react-native-admob'
import TempValue from '../../util/TempValue';


export default function SearchMatchScreen({navigation}) {

    let [end_key, setEndKey] = React.useState(null);
    let [locations, setLocations] = React.useState([]);
    let [locationUserIds, setLocationUserIds] = React.useState([]);
    let [loading, setLoading] = React.useState(false);

    let [sports, setSports] = React.useState([]);
    let [myLocation, setMyLocation] = React.useState(null);
    let [myInfo, setMyInfo] = React.useState(null);


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

    const createMatch = async (receiver_user_id) => {
        let response = await API.database.createItem('match', {
            receiver_user_id
        });
        return response.item_id;
    };

    const alreadyMatch = async (receiver_user_id) => {
        let response = await API.database.queryItems("match", []);
        return response.items.filter(item=> {
            if (receiver_user_id === item.user_id && myInfo.id === item.receiver_user_id){
                return true
            }
            if (receiver_user_id === item.receiver_user_id && myInfo.id === item.user_id){
                return true
            }
            return false;
        }).length > 0;
    };

    const getMatches = async () => {
        let response = await API.database.queryItems('match', [], 1000, true, null, 'creation_date', {
            'opponent_id': 'opponent',
        });
        return response.items;
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

    const amIBan = async (myId, receiver_user_id) => {
          let response = await API.database.queryItems('ban', [
              {condition: 'eq', field: 'user_id', value: receiver_user_id, option: 'and'},
              {condition: 'eq', field: 'ban_user_id', value: myId, option: 'and'},
          ]);
        if (response.items.length > 0){
            return true;
        }
        return false;
    };

    const initInfo = async () => {
        let sports = await getSports();
        TempValue.set('sports', sports);
        GPS.requestLocationPermission();
        let loc = await GPS.getCurrentLocation();
        let me = await API.auth.getMe();
        setSports(sports);
        setMyLocation(loc);
        TempValue.set('myLocation', loc);
        myInfo = me;
        setMyInfo(me);
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


    const renderCard = (location) => {
        return <Card key={location.id} style={{marginBottom: 10}} onPress={() => {}}>
            <Card.Section
                bg-white
                style={{padding: 10}}
            />

            <View paddingL-20 paddingR-20 bg-white marginB-20>
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

                <View row center>
                    <Button
                        style={{
                            marginTop: 18,
                            height: 40,
                            width: '100%',
                        }}
                        onPress={()=>{
                            (async ()=>{
                                if (location.user.id === myInfo.id){
                                    Alert.alert("자기 자신과는 매치할 수 없습니다.");
                                    return;
                                }
                                let iamBan = await amIBan(myInfo.id, location.user.id);
                                if (iamBan){
                                    Alert.alert("현재 이 유저와 매치할 수 없습니다.");
                                    return;
                                }
                                let alreadyMatched = await alreadyMatch();
                                if (alreadyMatched){
                                    Alert.alert("이미 매치된 상대입니다.");
                                    return;
                                }
                                let match_id = await createMatch(location.user.id);
                                locations = locations.filter(loc => {
                                    return loc.id !== location.id;
                                });
                                locationUserIds = locationUserIds.filter(locUserId => {
                                    return locUserId !== location.user.id;
                                });
                                setLocations(locations);
                                setLocationUserIds(locationUserIds);
                                navigation.navigate("ChatScreen", {
                                    match_id: match_id
                                });
                            })();
                        }}
                        label="매칭 하기"
                    />

                </View>

            </View>


        </Card>
    };

    const getNearLocations = async (level, start_key) => {
        // 가까운 유저 찾기 level: 0~16
        GPS.requestLocationPermission();
        let location = await GPS.getCurrentLocation();
        let info = GPS.getNormalize(location);

        let response = await API.database.queryItems("location", [{
            'condition': 'eq',
            'field': 'normalized.' + level + ".lat",
            'value': info.normalized[level + ""].lat,
            'option': 'and'
        }, {
            'condition': 'eq',
            'field': 'normalized.' + level + ".long",
            'value': info.normalized[level + ""].long,
            'option': 'and'
        }], 100, false, start_key, 'creation_date', {
            'user_id': 'user'
        });
        console.log(response);
        return response;
    };

    const getMoreLocations = async (level=11) => {
        setLoading(true);
        let _locations = await getNearLocations(level, end_key);
        let matches = await getMatches();
        const hasMatch = (receiver_user_id) => {
            let match = false;
            for (const m of matches){
                if (m.user_id === myInfo.id && m.receiver_user_id === receiver_user_id){
                    match = true;
                }
                if (m.user_id === receiver_user_id && m.receiver_user_id === myInfo.id){
                    match = true;
                }
            }
            return match;
        };
        for (const new_location of _locations.items){
            if (new_location.user && !locationUserIds.includes(new_location.user.id) && !hasMatch(new_location.user.id)){
                locations.push(new_location);
                locationUserIds.push(new_location.user.id);
            }
        }
        setLocationUserIds(locationUserIds);
        setLocations(locations);

        if (locations.length < 100 && level < 15){
            setEndKey(null);
            return getMoreLocations(level + 1);
        }
        setEndKey(_locations.end_key);
        setLoading(false);
        return locations;
    };

    const fetchMoreLocations = async () => {
        await getMoreLocations();
    };

    React.useEffect(()=>{
        // setLocations();
        (async () => {
            await initInfo();
            await fetchMoreLocations();
        })();
        return ()=>{
            setLocations([]);
            setLocationUserIds([]);
        }
    }, []);

    const canLoad = () => {
        return true;
    };

    const admobUnitId = Platform.OS === 'ios' ? 'ca-app-pub-1139869571888825/8398529262': 'ca-app-pub-1139869571888825/3025593714';

    return (<>
            {loading && <LoaderScreen color={Color.primaryColor} message="로드중..." overlay/>}
        <ScrollView bg-white>
            <View flex padding-10 paddingT-60 style={{flexDirection: "row"}}>
                <Text margin-10 marginB-25 style={{
                    fontSize: 30,
                    fontWeight: 'bold'
                }}>매칭 탐색</Text>
                <View style={{
                    justifyContent: 'flex-end',
                    alignContent: 'flex-end',
                    alignItems: 'flex-end',
                    flex: 1
                }}>
                    <TouchableOpacity style={{
                        marginRight: 15,
                        marginBottom: 28
                    }}
                        onPress={()=>{
                            fetchMoreLocations()
                        }}
                    >
                        <Icon name={'refresh'} size={25}/>
                    </TouchableOpacity>
                </View>

            </View>

            <View flex padding-10>
                {locations.map((item, idx) => {
                    if (idx % 7 === 0){
                        return <>{renderCard(item)}<View style={{
                            margin: 10,
                            alignItems: 'center',
                            marginBottom: 20
                        }}><AdMobBanner
                            adSize="mediumRectangle"
                            adUnitID={admobUnitId}
                            testDevices={[AdMobBanner.simulatorId]}
                            onAdFailedToLoad={error => console.error(error)}
                        /></View></>;
                    }
                    return renderCard(item);
                })}
            </View>

        </ScrollView>



        </>
    );
}
