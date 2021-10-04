import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {Alert, AlertButton, AlertOptions, AppState, FlatList, Text, TouchableOpacity} from 'react-native';
import API from '../../api/API';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    View,
    Dialog,
    Button
} from 'react-native-ui-lib';
import Service from '../../api/Service';
import OneSignal from 'react-native-onesignal';
import TempValue from '../../util/TempValue';
import CardImage from '../component/CardImage';

export default function ChatScreen({ navigation, route }) {

    const matchId = route.params.match_id;
    const [messages, setMessages] = React.useState([]);
    const [match, setMatch] = React.useState(null);

    const [appendStartKey, setAppendStartKey] = React.useState(null);
    const [myId, setMyId] = React.useState(null);
    const [showDialog, setShowDialog] = React.useState(false);
    const [updateMessages, setUpdateMessages] = React.useState(true);
    const [stateOfApp, setStateOfApp] = React.useState(null);

    React.useLayoutEffect(()=>{

        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{margin: 10, marginRight: 20}} onPress={() => {
                    setShowDialog(true);
                }}>
                    <Icon name={ 'ellipsis-h' } size={25}/>
                </TouchableOpacity>
            ),
        });
    });

    const getLocationOfUser = async (user_id) => {
        let response = await API.database.queryItems("location", [
            {condition: 'eq', field: 'user_id', value: user_id, option: 'and'}
        ], 100, true, null, 'creation_date', {
            user_id: 'user'
        });
        let locations = response.items;
        if (locations.length > 0){
            return locations[0];
        }
        return null;
    };

    const appendChats = async (limit=100) => {
        let response = await API.database.queryItems('chat', [{
            condition: 'eq', field: 'match_id', value: matchId, option: 'and'
        }], limit, true, appendStartKey, 'creation_date', {
            'user_id': 'user'
        });
        let _messages = [];
        let items = response.items;
        for (const _item of items){
            let _message = {
                _id: _item['id'],
                text: _item['text'],
                createdAt: new Date(_item.creation_date * 1000),
                user: {
                    _id: _item['user']['id'],
                    name: _item['user']['name'],
                    avatar: _item['user']['profile_id']
                }
            };
            _messages.push(_message);
        }
        setMessages(_messages)
    };

    const setMatchLastMessage = async (message) => {
        let response = await API.database.updateItem(matchId, {
            'last_message': message,
            'updated_date': (+ new Date()) / 1000
        });
        return response
    };

    const startAppendChat = async () => {
        while (updateMessages){
            console.log("APPEND");
            await appendChats();
        }
    };

    const fecthMatch = async () => {
        const response = await API.database.getItem(matchId);
        setMatch(response.item);
    };

    const clearMatchCount = async () => {
        let response = await API.database.queryItems('match_notification', [
            {condition: 'eq', field: 'match_id', value: matchId, option: 'and'}
        ]);
        for (let item of response.items){
            TempValue.set("match_notification.count" + matchId, 0);
            let response = await API.database.deleteItem(item.id);
        }
        let clearHandler = TempValue.get('clearHandler');
        if (clearHandler){
            clearHandler();
        }
    };

    const appState = React.useRef(AppState.currentState);

    const handleAppStateChange = nextAppState => {
        console.log('⚽️appState nextAppState', appState.current, nextAppState);
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('⚽️⚽️App has come to the foreground!');
            setUpdateMessages(true);
            (async ()=>{
                // await fecthMatch();
                await fetchMyId();
                startAppendChat();
            })();
        }
        if (
            appState.current.match(/inactive|active/) &&
            nextAppState === 'background'
        ) {
            console.log('⚽️⚽️App has come to the background!');
            setUpdateMessages(false);
        }
        appState.current = nextAppState;
    };

    React.useEffect(() => {
        TempValue.set('current_match_id', matchId);
        clearMatchCount();
        (async ()=>{
            // await fecthMatch();
            await fetchMyId();
            startAppendChat();
        })();
        AppState.addEventListener('change', handleAppStateChange);
        // setMessages([
        //     {
        //         _id: 1,
        //         text: 'Hello developer',
        //         createdAt: new Date(),
        //         user: {
        //             _id: 2,
        //             name: 'React Native',
        //             avatar: 'https://placeimg.com/140/140/any',
        //         },
        //     }
        // ])
        return ()=>{
            TempValue.set('current_match_id', null);
            AppState.removeEventListener('change', handleAppStateChange);
            // setUpdateMessages(false);
        }
    }, [stateOfApp]);

    const createChat = async (message) => {
        let response = await API.database.createItem('chat', {
            match_id: matchId,
            text: message,
        });
        (async ()=>{
            await setMatchLastMessage(message)
        })();
        return response.item_id;
    };


    const onSend = React.useCallback((messages = []) => {
        (async ()=>{
            await createChat(messages[0].text);
            let response = await Service.pushNotification.sendPushNotification(matchId, messages[0].text);
            console.log(response);
        })();
    }, []);

    const fetchMyId = async () => {
        let me = await API.auth.getMe();
        setMyId(me.id);
    };

    const benMatch = async () => {
        let match = await API.database.getItem(matchId);
        let response = await API.database.createItem('ban', {
            ban_user_id: match.opponent_id
        });
        return response;
    };

    const deleteMatch = async () => {
          let response = await API.database.deleteItem(matchId);
          return response;
    };

    return (
        <View style={{
            flex:1,
            backgroundColor: '#fff'
        }}>

            <Dialog
                migrate
                useSafeArea
                bottom={true}
                visible={showDialog}
                onDismiss={()=>{
                    setShowDialog(false);
                }}
            >
                <View spread flex={1} style={{
                    alignContent: 'center',
                    justifyContent: 'center',
                }}>
                    <View marginT-20 marginH-20>
                        <Button marginT-10
                            onPress={()=>{
                                Alert.alert(
                                    "채팅 나가기",
                                    "채팅 기록이 삭제되며 매칭이 취소됩니다. 나가시겠습니까?",
                                    [
                                        {
                                            text: "취소",
                                            onPress: () => {

                                            },
                                            style: "cancel"
                                        },
                                        { text: "확인", onPress: () => {
                                                (async ()=>{
                                                    await deleteMatch();
                                                    navigation.goBack();
                                                })();
                                            } }
                                    ],
                                    { cancelable: false }
                                );
                            }}
                            label={"채팅 나가기"}
                        />

                        <Button marginT-10
                                backgroundColor={'#c85544'}
                            onPress={()=>{

                                Alert.alert(
                                    "차단 후 나가기",
                                    "채팅 기록이 삭제되며 매칭이 취소됩니다. 상대는 다시 매치를 걸 수 없습니다. 나가시겠습니까?",
                                    [
                                        {
                                            text: "취소",
                                            onPress: () => {

                                            },
                                            style: "cancel"
                                        },
                                        { text: "확인", onPress: () => {
                                                (async ()=>{
                                                    await benMatch();
                                                    await deleteMatch();
                                                    navigation.goBack();
                                                })();
                                            } }
                                    ],
                                    { cancelable: false }
                                );

                            }}
                            label={"차단 후 나가기"}
                        />

                        <Button marginT-10
                                backgroundColor={'#999'}
                            onPress={()=>{}}
                            label={"닫기"}
                        />

                    </View>
                </View>
            </Dialog>

            <GiftedChat
                onPressAvatar={(user)=>{
                    // let location = await getLocationOfUser(user._id);
                }}
                renderAvatar={(props) => {
                    return <TouchableOpacity onPress={async ()=>{
                        let location = await getLocationOfUser(props.currentMessage.user._id);
                        navigation.navigate('OtherProfileScreen', {
                            location
                        })
                    }}><CardImage height={36} width={36} image_id={props.currentMessage.user.avatar}/></TouchableOpacity>;
                }}
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: myId,
                }}
                placeholder={'메시지를 입력하세요'}
            />

        </View>


    )

}
