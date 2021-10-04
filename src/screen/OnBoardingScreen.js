import {Button, Text, View, Image} from 'react-native';
import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Logo from "./img/logo.png";
import {TouchableOpacity} from 'react-native-gesture-handler';
import API from '../api/API';
import BeautyWebView from 'react-native-beauty-webview';


function OnBoardingScreen({ navigation }) {

    const [loginView, setLoginView] = React.useState(null);
    const [showTerms, setShowTerms] = React.useState(false);
    const [showPrivacy, setShowPrivacy] = React.useState(false);

    const textStyle = {
        color: 'white',
        fontSize: 13, fontWeight: '200',
        marginLeft: 30, marginRight: 30,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    };

    const underlineTextStyle = {
        fontSize: 13, fontWeight: '500',
    };

    const checkLogin = () => {
        API.auth.getMe().then(me => {
            if (me){
                navigation.navigate("MainTabView");
            }else{
                setLoginView(<View style={{
                    marginTop: 100,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>

                    <Text style={textStyle}>
                        버튼을 눌러 다음으로 이동하시면, <Text onPress={()=>setShowTerms(true)} style={underlineTextStyle}>이용약관</Text>
                        에 동의하는 것으로 간주됩니다. HealthMatch 의 <Text onPress={()=>setShowPrivacy(true)} style={underlineTextStyle}>개인정보 취급방침</Text>에서 회원 정보 처리 방법을 확인하실 수 있습니다.
                    </Text>

                    <TouchableOpacity
                        style={{
                            marginTop: 50,
                            borderWidth:2,
                            borderColor:'rgba(255, 255, 255, 1)',
                            alignItems:'center',
                            justifyContent:'center',
                            height:50,
                            borderRadius:25,
                        }}
                        onPress={()=>{
                            navigation.navigate('EmailScreen')
                        }}
                    >
                        <Text style={{color: 'white', fontSize: 17, fontWeight: '600', marginLeft: 30, marginRight: 30}}>이메일로 로그인</Text>
                    </TouchableOpacity>


                </View>);
            }
        });
    };

    React.useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            checkLogin();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, []);

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>

            <BeautyWebView
                visible={showTerms} // Reguired for open and close
                onPressClose={() => setShowTerms(false)} // Reguired for closing the modal
                url={'http://healthmatch.s3-website.ap-northeast-2.amazonaws.com/terms.pdf'}
            />

            <BeautyWebView
                visible={showPrivacy} // Reguired for open and close
                onPressClose={() => setShowPrivacy(false)} // Reguired for closing the modal
                url={'http://healthmatch.s3-website.ap-northeast-2.amazonaws.com/privacy.html'}
            />

            <LinearGradient style={{
                flex: 1,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center'
            }} colors={['#4c669f', '#3b5998', '#192f6a']}>

                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image style={{width: 100, height: 100}} source={Logo}></Image>
                    <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>헬스 매치</Text>


                </View>

                {loginView}

            </LinearGradient>




        </View>
    );
}

export default OnBoardingScreen;
