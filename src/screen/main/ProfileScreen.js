import {Button, Text, View} from 'react-native-ui-lib/core';
import API from '../../api/API';
import * as React from 'react';
import {Alert, Image, Pressable, ScrollView, StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';
import TempValue from '../../util/TempValue';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../../res/Color';
import ImageUtil from '../../util/ImageUtil';
import {launchImageLibrary} from 'react-native-image-picker';

export default function ProfileScreen({navigation}) {

    const [profileId, setProfileId] = React.useState();
    const [name, setName] = React.useState();
    const [place, setPlace] = React.useState();
    const [sports, setSports] = React.useState([]);
    const [profilePhoto, setProfilePhoto] = React.useState(null);
    const [buttons, setButtons] = React.useState([]);
    const [sportItems, setSportItems] = React.useState([]);


    const getTextStyles = (sports, title) => {
        if (sports.includes(title)){
            return [styles.textStyle, styles.textOpen];
        }else{
            return [styles.textStyle, styles.textClose];
        }
    };

    const getButtonStyles = (sports, title) => {
        if (sports.includes(title)){
            return [styles.button, styles.buttonOpen];
        }else{
            return [styles.button, styles.buttonClose]
        }
    };

    const loadMe = async () => {
        let me = await API.auth.getMe();
        setName(me.name);
        setPlace(me.place);
        setProfileId(me.profile_id);
        setSports(me.sports);
        let data = await API.storage.downloadB64(me.profile_id);
        let b64 = data.file_b64;
        setProfilePhoto(b64);
        return me;
    };

    const findPhoto = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: true,
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.7,
            },
            (response) => {
                let b64 = response.base64;
                if (b64){
                    setProfilePhoto(b64);
                    (async ()=>{
                        let response = await API.storage.uploadB64(b64);
                        setProfileId(response.file_id);
                    })();
                }
            },
        )
    };


    const fetchSportButtons = async (sportItems, sports) => {
        let _buttons = [];
        sportItems.forEach(title => {
            let button =  <Pressable key={title.id}
                style={getButtonStyles(sports, title.id)}
                onPress={() => {
                    if (sports.includes(title.id)){
                        sports.splice(sports.indexOf(title.id), 1);
                    }else{
                        sports.push(title.id);
                    }
                    setSports(sports);
                    fetchSportButtons(sportItems, sports);
                }}
            >
                <Text style={getTextStyles(sports, title.id)}>{title.name}</Text>
            </Pressable>;
            _buttons.push(button);
        });
        setButtons(_buttons);
    };

    const fetchSportItems = async () => {
        let response = await API.database.queryItems('sport', []);
        return response.items;
    };

    React.useEffect(()=>{
        (async ()=>{
            let me = await loadMe();
            let sportItems = await fetchSportItems();
            setSports(me.sports);
            setSportItems(sportItems);
            await fetchSportButtons(sportItems, me.sports);
        })();
    }, []);

    const saveMe = async () => {
        await API.auth.setMe('name', name);
        await API.auth.setMe('profile_id', profileId);
        await API.auth.setMe('sports', sports);
        await API.auth.setMe('place', place);
        Alert.alert("저장되었습니다");
        await loadMe();
    };

    return (

        <ScrollView>
            <View flex padding-10 paddingT-60>
                <Text margin-10 marginB-25 style={{
                    fontSize: 30,
                    fontWeight: 'bold'
                }}>내 프로필</Text>


                <View style={{
                    flex: 1,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                }}>

                    <Input
                        label={'이름'}
                        placeholder='이름을 입력해주세요'
                        onChange={(e)=>{
                            let value = e.nativeEvent.text;
                            setName(value);
                        }}
                        value={name}
                    />

                    <Input
                        label={'운동 경력 및 시간대'}
                        placeholder='헬스 1년차, 강남역 2번 출구 스포애니, 평일 저녁'
                        onChange={(e)=>{
                            let value = e.nativeEvent.text;
                            setPlace(value);
                        }}
                        value={place}
                    />

                    <View style={{
                        marginBottom: 20,
                        flex: 1,
                        alignItems: 'center',
                    }}>


                        <Text style={{
                            margin: 8,
                            fontSize: 15,
                            fontWeight: '400'
                        }}>
                            운동 경력을 유추할 수 있는 프로필.
                        </Text>
                        <View style={{
                            flex: 1,
                            flexDirection: "row"
                        }}>
                            <Image style={{flex:1, width: '100%', height: 300, borderWidth: 1, borderColor: Color.primaryColor}} source={{uri: ImageUtil.getImageBase64(profilePhoto)}}/>
                        </View>
                        <Pressable
                            style={[styles.button, styles.buttonOpen]}
                            onPress={() => {
                                findPhoto();
                            }}
                        >
                            <Text style={[styles.textStyle, {color: Color.primaryColor}]}>사진 찾기</Text>
                        </Pressable>




                        <Text style={{
                            margin: 8,
                            marginTop: 50,
                            fontSize: 30,
                            fontWeight: 'bold'
                        }}>
                            매칭을 원하는 스포츠
                        </Text>

                        <View style={{
                            marginTop: 10,
                            flex: 3,
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}>
                            <ScrollView>
                                {buttons}
                            </ScrollView>


                        </View>


                        <TouchableOpacity
                            style={[styles.button, styles.buttonFill, {marginBottom: 100, marginTop: 30}]}
                            onPress={() => {
                                saveMe();
                            }}
                        >
                            <Text style={{
                                color: 'white',
                                fontSize: 23,
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}>저장</Text>
                        </TouchableOpacity>


                    </View>

                </View>


            </View>

            <View style={{
                padding: 20
            }}>
                <Button
                    style={{
                        width: '100%',
                        backgroundColor: '#ab5856',
                        marginBottom: 10,
                    }}
                    onPress={()=>{
                        Alert.alert("회원탈퇴 하시겠습니까?", "모든 매칭 기록이 삭제됩니다.", [
                            {
                                text: "취소",
                                onPress: () => {

                                },
                                style: "cancel"
                            },
                            { text: "확인", onPress: () => {
                                    API.auth.deleteMyMembership().then(data => {
                                        navigation.navigate("OnBoardingScreen");
                                    });
                                } }
                        ]);

                    }}
                    label={'회원탈퇴'}
                />
                <Button
                    style={{
                        width: '100%',
                        backgroundColor: '#999'
                    }}
                    onPress={()=>{
                        API.auth.logout().then(data=>{
                            navigation.navigate("OnBoardingScreen");
                        });
                    }}
                    label={'로그아웃'}
                />

            </View>


        </ScrollView>

    );
}

const styles = StyleSheet.create({
    leftView: {
        marginTop: 20,
        width: '100%',
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    centeredView: {
        flex: 1,
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        borderWidth: 2,
        padding: 10,
        elevation: 2,
        marginTop: 10,
        minWidth: '100%'
    },
    buttonOpen: {
        borderColor: Color.primaryColor,
    },
    buttonFill: {
        backgroundColor: Color.primaryColor,
        borderWidth: 0,
    },

    buttonClose: {
        borderColor: '#999',
    },


    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },


    textOpen: {
        color: Color.primaryColor,
    },
    textClose: {
        color: '#999',
    },
});
