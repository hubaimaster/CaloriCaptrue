import React, { useState } from "react";
import {Alert, Modal, StyleSheet, Text, Pressable, View, Image} from 'react-native';
import Logo from '../img/icon_fill.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import Color from '../../res/Color';

const WelcomeScreen = (props) => {

    const getCheckTitle = (title, description) => {
        return <View style={styles.leftView}>
            <Text style={{fontSize: 11, fontWeight: '500', marginTop: 10}}>
                <Icon name={'check'} size={16} color={Color.primaryColor}/>
                {" " + title}</Text>
            <Text style={{fontSize: 11, fontWeight: '300', marginTop: 5}}>{description}</Text>
        </View>;
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                props.onClose();
            }}
            style={{
                width: '90%'
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Image style={{width: 50, height: 50}} source={Logo}/>
                    <Text style={{fontSize: 11, fontWeight: '700', marginTop: 10}}>헬스매치에 오신 것을 환영합니다.</Text>
                    <Text style={{fontSize: 11, fontWeight: '300', marginTop: 5}}>아래의 이용 규정을 지켜주세요.</Text>

                    {getCheckTitle("솔직하기", "원활한 매칭을 위해 운동경력, 나이, 종목 등을 솔직하게 공유해주세요.")}
                    {getCheckTitle("조심하기", "운동 매칭 상대를 잘 모르는 상태에서 개인정보를 알려주지 마세요.")}
                    {getCheckTitle("매너 있게 행동하기", "타인을 존중하고, 자신이 대우 받고 싶은 대로 타인을 대해주세요.")}


                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => props.onClose()}
                    >
                        <Text style={[styles.textStyle]}>알겠습니다</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

export default WelcomeScreen;

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
        padding: 10,
        elevation: 2,
        marginTop: 20,
        width: 150
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
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
