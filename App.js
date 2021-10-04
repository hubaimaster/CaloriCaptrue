import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import OnBoardingScreen from './src/screen/OnBoardingScreen';
import EmailScreen from './src/screen/EmailScreen';
import RegisterBirthScreen from './src/screen/register/RegisterBirthScreen';
import RegisterGenderScreen from './src/screen/register/RegisterGenderScreen';
import RegisterSportsScreen from './src/screen/register/RegisterSportsScreen';
import RegisterProfileScreen from './src/screen/register/RegisterProfileScreen';
import MainTabView from './src/screen/main/MainTabView';
import RegisterPlaceScreen from './src/screen/register/RegisterPlaceScreen';
import RegisterNameScreen from './src/screen/register/RegisterNameScreen';
import ChatScreen from './src/screen/main/ChatScreen';
import OtherProfileScreen from './src/screen/main/OtherProfileScreen';


const Stack = createStackNavigator();

function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
          <Stack.Screen name="OnBoardingScreen" options={{ title: ' ', headerShown: false }} component={OnBoardingScreen} />
          <Stack.Screen name="EmailScreen" options={{ title: ' ', headerShown: true }} component={EmailScreen} />
          <Stack.Screen name="RegisterBirthScreen" options={{ title: ' ', headerShown: true }} component={RegisterBirthScreen} />
          <Stack.Screen name={"RegisterGenderScreen"} options={{title: ' ', headerShown: true}} component={RegisterGenderScreen}/>
          <Stack.Screen name={"RegisterNameScreen"} options={{title: ' ', headerShown: true}} component={RegisterNameScreen}/>
          <Stack.Screen name={"RegisterSportsScreen"} options={{title: ' ', headerShown: true}} component={RegisterSportsScreen}/>
          <Stack.Screen name={"RegisterPlaceScreen"} options={{title: ' ', headerShown: true}} component={RegisterPlaceScreen}/>
          <Stack.Screen name={"RegisterProfileScreen"} options={{title: ' ', headerShown: true}} component={RegisterProfileScreen}/>
          <Stack.Screen name={"ChatScreen"} options={{title: '매칭 채팅', headerShown: true}} component={ChatScreen}/>
          <Stack.Screen name={"OtherProfileScreen"} options={{title: '상대 프로필', headerShown: true}} component={OtherProfileScreen}/>


          <Stack.Screen name={"MainTabView"} options={{title: ' ', headerShown: false, gestureEnabled: false}} component={MainTabView}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
