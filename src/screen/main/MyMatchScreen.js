import React, {Component} from 'react';
import {Alert, AppState, ScrollView} from 'react-native';
import {Text, Card} from 'react-native-ui-lib';
import {Button, View} from 'react-native-ui-lib/core';
import Color from '../../res/Color';
import CardImage from '../component/CardImage';
import API from '../../api/API';
import {Badge} from 'react-native-elements';
import TempValue from '../../util/TempValue'; //eslint-disable-line


function Cards(props) {

    const card = (match) => {
        return <Card key={match.id} onPressIn={()=>{
            match.onPress();
        }} row style={{marginBottom: 10}} onPress={() => {}}>

            <View padding-5>
                {match.opponent && match.opponent.profile_id ? <CardImage height={65} width={65} image_id={match.opponent.profile_id}/> : null}
            </View>

            <View  padding-10 flex>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginBottom: 1
                }} grey10>
                    {match.opponent.name}
                </Text>
                <Text style={{
                    marginTop: 2,
                    marginBottom: 2,
                    maxHeight: 20,
                    fontSize: 15
                }}  grey10>
                    {match.last_message ? match.last_message: "아직 대화가 없습니다."}
                </Text>
                <Text text90 style={{
                    color: '#999'
                }}>
                    {match.updated_date ? new Date(match.updated_date * 1000).toLocaleString(): new Date(match.creation_date * 1000).toLocaleString()}
                </Text>
            </View>

            <View padding-5>
                {TempValue.get("match_notification.count" + match.id) > 0 ? <Badge>{TempValue.get("match_notification.count" + match.id)}</Badge>: null}
            </View>

        </Card>
    };

    return props.matches.map(match => {
        return card(match);
    });

}


export default function MyMatchScreen({navigation}) {

    const [matches, setMatches] = React.useState([]);
    const [updateMatchs, setUpdateMatches] = React.useState(true);

    const getMatchs = async (startKey=null) => {
        let response = await API.database.queryItems('match', [], 1000, true, startKey, 'creation_date', {
            'opponent_id': 'opponent',
        });
        let ms = response.items.map(item => {
            item.onPress = () => {
                navigation.navigate("ChatScreen", {
                    match_id: item.id
                })
            };
            if (!item.opponent){
                item.opponent = {};
            }
            return item;
        });
        ms.sort((a, b)=>{
            if (a.updated_date && b.updated_date){
                return b.updated_date - a.updated_date;
            }
            return 0;
        });
        setMatches(ms);
    };

    const startUpdateGetMatch = async () => {
        while(updateMatchs){
            await getMatchs();
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
            setUpdateMatches(true);
            startUpdateGetMatch();
        }
        if (
            appState.current.match(/inactive|active/) &&
            nextAppState === 'background'
        ) {
            console.log('⚽️⚽️App has come to the background!');
            setUpdateMatches(false);
        }
        appState.current = nextAppState;
    };

    React.useEffect(()=>{
        // getMatchs();
        AppState.addEventListener('change', handleAppStateChange);
        startUpdateGetMatch();
        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
        };
    }, []);

    return (<ScrollView>
        <View flex padding-10 paddingT-60>
            <Text margin-10 marginB-25 style={{
                fontSize: 30,
                fontWeight: 'bold'
            }}>나의 매치</Text>
            {matches.length > 0 ? <Cards matches={matches}/> : <Text style={{
                fontSize: 20,
                fontWeight: '500',
                margin: 15,
                marginTop: 100,
                textAlign: 'center'
            }}>매칭 탐색에서 매치를 찾아보세요!</Text>}

        </View>


    </ScrollView>)

}
