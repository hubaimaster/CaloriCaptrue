import {Image, Text, View, TextInput, KeyboardAvoidingView, StyleSheet, Alert} from 'react-native';
import * as React from 'react';
import { TextInputMask } from 'react-native-masked-text'
import {Input} from 'react-native-elements';
import TempValue from '../../util/TempValue';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../../res/Color';


function RegisterBirthScreen({ navigation }) {


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

    const [date, setDate] = React.useState('');
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

    const isValidDate = (targetDate) => {
        const tokens = targetDate.split('/');
        const year = parseInt(tokens[0]);
        const month = parseInt(tokens[1]);
        const day = parseInt(tokens[2]);
        if (year < 3000){
            if (0 < month && month <= 12){
                if (0 < day && day < 32){
                    return true;
                }
            }
        }
        return false;
    };

    const goNext = () => {
        if (isValidDate(date)){
            navigation.navigate("RegisterSportsScreen");
        }else{
            Alert.alert("생일이 유효하지 않습니다.");
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
                fontSize: 33,
                fontWeight: 'bold'
            }}>
                내 생일
            </Text>

            <Text style={{
                marginTop: 17,
                margin: 10,
                fontSize: 13,
                fontWeight: '200'
            }}>
                적절한 운동 상대를 찾기 위해 사용됩니다.
            </Text>

            <TextInputMask
                type={'datetime'}
                options={{
                    format: 'YYYY/MM/DD',
                }}
                value={date}
                onChangeText={text => {
                    setDate(text);
                    TempValue.set("register_birth", text);
                }}
                customTextInput={Input}

                // the props to be passed to the custom text input
                customTextInputProps={{
                    label:'년/월/일',
                    placeholder: '1996/07/22',
                    onSubmitEditing: ()=>{
                        goNext();
                    }
                }}

            />

            <View style={{
                marginBottom: 20,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}>

                <TouchableOpacity
                    style={[styles.button, styles.button, {marginBottom: 10}]}
                    onPress={() => {
                        TempValue.set("register_birth", null);
                        navigation.navigate("RegisterSportsScreen");
                    }}
                >
                    <Text style={{
                        color: '#333',
                        fontSize: 23,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>비공개</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.buttonFill, {marginBottom: 100}]}
                    onPress={() => {
                        goNext();
                    }}
                >
                    <Text style={{
                        color: 'white',
                        fontSize: 23,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>확인</Text>
                </TouchableOpacity>


            </View>



        </View>
        </KeyboardAvoidingView>
    );
}

export default RegisterBirthScreen;
