import {Image, Text, View, TextInput, KeyboardAvoidingView, Alert, StyleSheet} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Logo from './img/logo.png';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import API from '../api/API';
import WelcomeScreen from './register/WelcomScreen';
import LocalStorage from '../util/localStorage';
import TempValue from '../util/TempValue';
import Color from '../res/Color';
import GPS from '../location/GPS';



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


function EmailScreen({ navigation }) {

    const [mode, setMode] = React.useState(null);
    const [email, setEmail] = React.useState(null);
    const [name, setName] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = React.useState(false);

    React.useEffect(()=>{
        GPS.requestLocationPermission();
    }, []);

    const getLoginPasswordField = () => {
        return <>
            <Text style={{
                marginTop: 17,
                margin: 8,
                fontSize: 13,
                fontWeight: '200'
            }}>
                비밀번호를 입력해주세요
            </Text>
            <Input
                style={{
                    marginTop: -5,
                    width: 200
                }}
                secureTextEntry={true}
                onChange={(e)=>{
                    let value = e.nativeEvent.text;
                    setPassword(value);
                }}
                onSubmitEditing={()=>{
                    (async ()=>{
                        await goNext();
                    })();
                }}
                placeholder='비밀번호'
            />
        </>
    };


    const getRegisterField = () => {
        return <>
            <Text style={{
                marginTop: 17,
                margin: 8,
                fontSize: 13,
                fontWeight: '200'
            }}>
                사용하실 비밀번호를 입력해주세요.
            </Text>

            <Input
                style={{
                    marginTop: -5,
                    width: 200
                }}
                secureTextEntry={!passwordVisible}
                placeholder='7자리 이상의 비밀번호'
                onChange={(e)=>{
                    let value = e.nativeEvent.text;
                    setPassword(value);
                    TempValue.set("register_password", value);
                }}
                onSubmitEditing={()=>{
                    (async ()=>{
                        await goNext();
                    })();
                }}
                rightIcon={<Icon name={ passwordVisible ? 'eye' : 'eye-slash'} onPress={()=>{
                    setPasswordVisible(!passwordVisible)
                }} size={25}/>}
            />

        </>
    };

    const getForms = (formMode) => {
        if (formMode === 'login'){
            return getLoginPasswordField();
        }
        if (formMode === 'register'){
            return getRegisterField();
        }
        return null;
    };


    const hasEmail = async (emailAddr) => {
        let response = await API.auth.hasAccount(emailAddr);
        return response.has_account;
    };


    const goNext = async () => {
        if (mode === 'register'){
            setShowWelcomeModal(true);
        }
        if (mode === 'login'){
            API.auth.login(email, password).then(data => {
                if (data.session_id){
                    navigation.navigate("MainTabView");
                }else{
                    Alert.alert("로그인 정보가 틀렸습니다", "다시 확인해주세요");
                }
            });
        }
    };

    const nextButton = () => {
        if (mode){
            if (password && password.length >= 7){
                (async ()=>{
                    await goNext();
                })();
            }else {
                Alert.alert("유효한 비밀번호를 입력해주세요.");
            }

        }else{
            if (email && email.includes("@") && email.includes(".")){
                (async ()=>{
                    if (await hasEmail(email)){
                        setMode('login');
                    }else{
                        setMode('register');
                    }
                })();
            }else{
                Alert.alert("이메일 형식이 올바르지 않습니다.");
            }
        }
    };

    return (
        <>
            <WelcomeScreen modalVisible={showWelcomeModal} onClose={()=>{
                setShowWelcomeModal(!showWelcomeModal);
                navigation.navigate('RegisterNameScreen')
            }}/>
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
                이메일로 시작하기
            </Text>

            <Text style={{
                marginTop: 17,
                margin: 8,
                fontSize: 13,
                fontWeight: '200'
            }}>
                이메일 주소를 입력해주세요
            </Text>

            <Input
                style={{
                    marginTop: -5,
                    width: 200
                }}
                onChange={(e)=>{
                    setEmail(e.nativeEvent.text);
                    TempValue.set("register_email", e.nativeEvent.text);
                }}
                placeholder='email@example.com'
                keyboardType={'email-address'}
                onSubmitEditing={()=>{
                    nextButton();
                }}
            />

            {
                getForms(mode)
            }

            <View style={{
                marginBottom: 100,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonFill]}
                    onPress={() => {
                        nextButton();
                    }}
                >
                    <Text style={{
                        color: 'white',
                        fontSize: 23,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>계속</Text>
                </TouchableOpacity>


            </View>
        </View>
        </KeyboardAvoidingView>
            </>
    );

}

export default EmailScreen;
