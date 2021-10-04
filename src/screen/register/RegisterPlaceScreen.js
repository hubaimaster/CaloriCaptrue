import {Image, Text, View, TextInput, KeyboardAvoidingView, StyleSheet, Alert} from 'react-native';
import * as React from 'react';
import { TextInputMask } from 'react-native-masked-text'
import {Input} from 'react-native-elements';
import TempValue from '../../util/TempValue';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../../res/Color';
import GPS from '../../location/GPS';


function RegisterPlaceScreen({ navigation }) {


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

    const [place, setPlace] = React.useState(null);
    let dateInput = null;

    const handleChange = (date) => {
        setDate(date);
    };

    const focus = () => {
        if (!dateInput) {
            return;
        }

        dateInput.focus();
    };

    const requestLocation = () => {
        GPS.requestLocationPermission();
    };

    React.useEffect(()=>{
        requestLocation();
    }, []);

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
                fontSize: 18,
                fontWeight: 'bold'
            }}>
                운동 경력, 장소 및 시간대
            </Text>

            <Input
                label={'매칭을 위해 쓰입니다.'}
                placeholder='헬스 1년차, 강남역 2번 출구 스포애니, 평일 저녁'
                onChange={(e)=>{
                    let value = e.nativeEvent.text;
                    setPlace(value);
                    TempValue.set("register_place", value);
                }}
            />

            <View style={{
                marginBottom: 20,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonFill, {marginBottom: 100}]}
                    onPress={() => {
                        if (place && place.length >= 3){
                            navigation.navigate("RegisterProfileScreen");
                        }else{
                            Alert.alert("매칭 정보가 부족합니다", "운동 경력과 장소 시간대를 3글자 이상 입력해주세요.")
                        }

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
    );
}

export default RegisterPlaceScreen;
