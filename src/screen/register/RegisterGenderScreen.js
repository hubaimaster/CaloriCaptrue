import {
    Image,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    TouchableOpacity, Alert,
} from 'react-native';
import * as React from 'react';
import { TextInputMask } from 'react-native-masked-text'
import {Input} from 'react-native-elements';
import TempValue from '../../util/TempValue';
import Color from '../../res/Color';
import LocalStorage from '../../util/localStorage';


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
        fontWeight: "500",
        textAlign: "center",
        fontSize: 20
    },

    textOpen: {
        color: Color.primaryColor,
    },
    textClose: {
        color: '#999',
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});


function RegisterGenderScreen({ navigation }) {

    const [gender, setGender] = React.useState(null);
    let dateInput = null;

    const getTextStyles = (targetGender) => {

        if (gender){
            if (targetGender === gender){
                return [styles.textStyle, styles.textOpen];
            }else{
                return [styles.textStyle, styles.textClose];
            }
        }else{
            return [styles.textStyle, styles.textClose];
        }
    };

    const getButtonStyles = (targetGender) => {
        if (gender){
            if (targetGender === gender){
                return [styles.button, styles.buttonOpen];
            }else{
                return [styles.button, styles.buttonClose];
            }
        }else{
            return [styles.button, styles.buttonClose]
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
                성별
            </Text>

            <View style={{
                marginTop: 60,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}>
                <Pressable
                    style={getButtonStyles('F')}
                    onPress={() => {
                        setGender('F')
                        TempValue.set("register_gender", 'F');
                    }}
                >
                    <Text style={getTextStyles('F')}>여성</Text>
                </Pressable>

                <Pressable
                    style={getButtonStyles('M')}
                    onPress={() => {
                        setGender('M');
                        TempValue.set("register_gender", 'M');
                    }}
                >
                    <Text style={getTextStyles('M')}>남성</Text>
                </Pressable>

                <Pressable
                    style={getButtonStyles('U')}
                    onPress={() => {
                        setGender('U');
                        TempValue.set("register_gender", 'U');
                    }}
                >
                    <Text style={getTextStyles('U')}>비공개</Text>
                </Pressable>

            </View>

            <View style={{
                marginBottom: 20,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonFill]}
                    onPress={() => {
                        if (gender){
                            navigation.navigate("RegisterBirthScreen");
                        }else{
                         Alert.alert("성별을 선택해주세요", "");
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

export default RegisterGenderScreen;
