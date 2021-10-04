import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Color from '../../res/Color';
import Icon from 'react-native-vector-icons/FontAwesome';
import GPS from '../../location/GPS';
import API from '../../api/API';
import SearchMatchScreen from './SearchMatchScreen';
import MyMatchScreen from './MyMatchScreen';
import ProfileScreen from './ProfileScreen';
import OneSignal from 'react-native-onesignal';
import {Alert} from 'react-native';
import TempValue from '../../util/TempValue';



const Tab = createBottomTabNavigator();

export default function MainTabView({navigation}) {

    const [notificationCount, setNotificationCount] = React.useState(null);
    const [initRouteName, setInitRouteName] = React.useState('매칭 탐색');

    (async ()=>{
        /* O N E S I G N A L   S E T U P */
        OneSignal.setAppId("90fad01a-c583-404d-ab55-1dce9f417021");
        OneSignal.setLogLevel(6, 0);
        OneSignal.setRequiresUserPrivacyConsent(false);
        OneSignal.promptForPushNotificationsWithUserResponse(response => {
            console.log("Prompt response:", response);
        });

        /* O N E S I G N A L  H A N D L E R S */
        OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
            console.log("OneSignal: notification will show in foreground:", notifReceivedEvent);
            fetchNotifcationCounts();
            let notif = notifReceivedEvent.getNotification();
            if (TempValue.get('current_match_id') === notif.additionalData.match_id){
                notifReceivedEvent.complete();
            }else{
                notifReceivedEvent.complete(notif);
            }
        });
        OneSignal.setNotificationOpenedHandler(notification => {
            console.log("OneSignal: notification opened:", notification);
            const match_id = notification.notification.additionalData.match_id;
            // setInitRouteName('나의 매치');
            navigation.navigate('ChatScreen', {
                match_id
            });


        });
        OneSignal.setInAppMessageClickHandler(event => {
            console.log("OneSignal IAM clicked:", event);
        });
        OneSignal.addEmailSubscriptionObserver((event) => {
            console.log("OneSignal: email subscription changed: ", event);
        });
        OneSignal.addSubscriptionObserver(event => {
            console.log("OneSignal: subscription changed:", event);
            let push_id = event.to.userId;
            API.auth.setMe('push_id', push_id).then(data => {
                console.log(data);
            });
        });
        OneSignal.addPermissionObserver(event => {
            console.log("OneSignal: permission changed:", event);
        });

        const deviceState = await OneSignal.getDeviceState();
    })();

    const setLocations = async () => {
        // 사용자의 위도 경도를 가져와 인덱싱 작업
        GPS.requestLocationPermission();
        let location = await GPS.getCurrentLocation();
        let info = GPS.getNormalize(location);
        let me = await API.auth.getMe();
        let old_location = await API.database.queryItems("location", [
            {condition: 'eq', field: 'user_id', value: me.id, option: 'and'}
        ], 10, true);
        if (old_location.items.length > 0){
            let location_to_update = old_location.items[0];
            let response = await API.database.updateItem(location_to_update.id, info);
            // let response = await API.database.batchDeleteItems(old_location.items.map(item => {
            //     return item.id;
            // }));
        }else{
            let response = await API.database.createItem("location", info);
        }

    };

    const fetchNotifcationCounts = async () => {
        let count = 0;
        let response = await API.database.queryItems('match_notification', [], 1000);
        for (const item of response.items){
            TempValue.set("match_notification.count" + item.match_id, item.count);
            count += item.count;
        }
        if (count > 0){
            setNotificationCount(count);
        }else{
            setNotificationCount(null);
        }

    };

    React.useEffect(()=>{
        setLocations();
        fetchNotifcationCounts();
        TempValue.set("clearHandler", ()=>{
           fetchNotifcationCounts();
        });
    }, []);

    return (
        <Tab.Navigator
            initialRouteName={initRouteName}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === '매칭 탐색') {
                        return <Icon name={'eye'} size={size} color={color} />;
                    }
                    if (route.name === '나의 매치') {
                        return <Icon name={'users'} size={size} color={color} />;
                    }
                    if (route.name === '내 프로필') {
                        return <Icon name={'user'} size={size} color={color} />;
                    }
                },

            })}
            tabBarOptions={{
                activeTintColor: Color.primaryColor,
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="매칭 탐색" component={SearchMatchScreen} />
            <Tab.Screen name="나의 매치" component={MyMatchScreen} options={{ tabBarBadge: notificationCount }} listeners={{
                tabPress: e => {
                    // e.preventDefault(); // Use this to navigate somewhere else
                },
            }} />
            <Tab.Screen name="내 프로필" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
