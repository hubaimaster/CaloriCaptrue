import {Image, Text, View, TextInput, KeyboardAvoidingView, StyleSheet, Pressable, Alert} from 'react-native';
import * as React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../../res/Color';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageUtil from '../../util/ImageUtil';
import TempValue from '../../util/TempValue';
import API from '../../api/API';


function RegisterProfileScreen({ navigation }) {


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

        textStyle: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center"
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center"
        }
    });

    const [profilePhoto, setProfilePhoto] = React.useState(null);
    let dateInput = null;

    const focus = () => {
        if (!dateInput) {
            return;
        }

        dateInput.focus();
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
                    TempValue.set("register_profile", b64);
                }
            },
        )
    };

    const goNext = async () => {
        let email = TempValue.get("register_email");
        let password = TempValue.get("register_password");
        let gender = TempValue.get("register_gender");
        let birth = TempValue.get("register_birth");
        let sports = TempValue.get("register_sports");
        let place = TempValue.get("register_place");
        let name = TempValue.get("register_name");
        let profile = profilePhoto;

        console.log("START");
        console.log(email);
        console.log(password);
        console.log(gender);
        console.log(birth);
        console.log(sports);
        console.log(place);
        console.log("END");

        if (!profile){
            Alert.alert("운동 경력을 유추할 수 있는 사진을 업로드해주세요.", "원활한 매칭을 위해 피드에 표시됩니다.");
            return;
        }

        let response = await API.auth.register(email, password, {
            gender, birth, sports, place, name
        });
        if (response.item){
            await API.auth.login(email, password);
            let profile_id = null;
            if (profile){
                let response = await API.storage.uploadB64(profile);
                profile_id = response.file_id;
            }else{
                Alert.alert("운동 경력을 유추할 수 있는 사진을 업로드해주세요.", "원활한 매칭을 위해 피드에 표시됩니다.");
                return;
            }
            let response = await API.auth.setMe('profile_id', profile_id);
            navigation.navigate("MainTabView");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
                flex: 1
            }}
        >
        <View style={{
            flex: 1,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            margin: 20
        }}>

            <Text style={{
                margin: 8,
                fontSize: 22,
                fontWeight: 'bold'
            }}>
                프로필 사진 등록
            </Text>

            <Text style={{
                margin: 8,
                fontSize: 15,
                fontWeight: '400'
            }}>
                운동 경력을 유추할 수 있는 프로필.
            </Text>

            <Image style={{flex:1, width: '100%', borderWidth: 1, borderColor: Color.primaryColor}} source={{uri: ImageUtil.getImageBase64(profilePhoto)}}/>
            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                    findPhoto();
                }}
            >
                <Text style={[styles.textStyle, {color: Color.primaryColor}]}>사진 찾기</Text>
            </Pressable>

            <View style={{
                marginBottom: 20,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonFill, {marginBottom: 100}]}
                    onPress={() => {
                        goNext();
                    }}
                >
                    <Text style={{
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>계속</Text>
                </TouchableOpacity>


            </View>

        </View>
        </KeyboardAvoidingView>
    );
}

export default RegisterProfileScreen;
