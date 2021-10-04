import {
    Image,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import * as React from 'react';
import { TextInputMask } from 'react-native-masked-text'
import {Input} from 'react-native-elements';
import TempValue from '../../util/TempValue';
import Color from '../../res/Color';
import API from '../../api/API';


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


function RegisterSportsScreen({ navigation }) {

    const [buttons, setButtons] = React.useState([]);
    const [sports, setSports] = React.useState([]);
    let dateInput = null;

    let sportItems = [];


    const getTextStyles = (title) => {
        if (sports.includes(title)){
            return [styles.textStyle, styles.textOpen];
        }else{
            return [styles.textStyle, styles.textClose];
        }
    };

    const getButtonStyles = (title) => {
        if (sports.includes(title)){
            return [styles.button, styles.buttonOpen];
        }else{
            return [styles.button, styles.buttonClose]
        }
    };

    const fetchSportButtons = async () => {
        // let titles = ['웨이트트레이닝', '유산소', '축구', '농구', '복싱', '주짓수', 'MMA'];
        let titles = [];
        if (sportItems.length === 0){
            let response = await API.database.queryItems("sport", []);
            titles = response.items;
            sportItems = titles;
        }else{
            titles = sportItems;
        }

        let _buttons = [];
        titles.forEach(title => {
            let button =  <Pressable
                style={getButtonStyles(title.id)}
                onPress={() => {
                    if (sports.includes(title.id)){
                        sports.splice(sports.indexOf(title.id), 1);
                    }else{
                        sports.push(title.id);
                    }

                    setSports(sports);
                    TempValue.set("register_sports", sports);
                    fetchSportButtons();
                }}
            >
                <Text style={getTextStyles(title.id)}>{title.name}</Text>
            </Pressable>;
            _buttons.push(button);
        });
        setButtons(_buttons);
    };

    const goNext = () => {
        if (sports.length === 0){
            Alert.alert("종목을 하나 이상 선택해주세요.");
        }else{
            navigation.navigate("RegisterPlaceScreen");
        }
    };

    React.useEffect(()=>{
        fetchSportButtons();
    }, []);

    // React.useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <TouchableOpacity style={{
    //                 marginRight: 20
    //             }}>
    //                 <Text style={{fontWeight: '600'}}>확인</Text>
    //             </TouchableOpacity>
    //         ),
    //     });
    // }, [navigation]);

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
                매칭을 원하는 스포츠
            </Text>

            <View style={{
                marginTop: 60,
                flex: 3,
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}>
                <ScrollView>
                    {buttons}
                </ScrollView>


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
                        goNext();
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

export default RegisterSportsScreen;
