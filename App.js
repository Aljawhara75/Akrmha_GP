//import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View,TouchableHighlight,Platform , I18nManager ,  } from 'react-native';
import { Feather,AntDesign ,FontAwesome5 ,MaterialIcons} from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Splash ,Onboarding } from './screens/authentication';
import { Akremha,List ,Message,Home,Search } from './screens/tabs';
import { Search_Map,Food_offer } from './screens/search';
import After_add from './screens/search/after_add';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const platform =Platform.OS === 'ios'?true:false
 /*const isRTLAndroid = Platform.OS === 'android' && I18nManager.isRTL;
    if (isRTLAndroid) {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
      
   // Expo.Updates.reload();
    } */
  
function MyTabs() {
  return (
    <Tab.Navigator 
    initialRouteName='Home'
     screenOptions={{
      tabBarStyle : {
        height:"10%",
       // justifyContent:'center',
        alignItems:'center',
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
       
      },
      tabBarHideOnKeyboard:'true',
      tabBarIconStyle:{
  
   marginVertical:'10%'
      },
   
   
    }} >
   
  
   
       <Tab.Screen name="message" component={Message} options={{ headerShown: false,
             tabBarLabel: ({focused})=>{return(<Text style ={ Platform.OS === 'ios'?{color:focused?'#B99C28':'black',fontSize:8,height:'50%',textAlignVertical:'center',marginTop:'10%',
              paddingTop:'25%'}:{color:focused?'#B99C28':'black',fontSize:8,height:'50%',textAlignVertical:'center',marginTop:'1%',
              paddingTop:'1%'} }>الرسائل </Text>)},
             tabBarIcon: ({ focused, size }) => {
            return (
              <MaterialIcons name="mail-outline" size={20} color={focused ? '#B99C28':"black"} style={{position:'absolute',top:15}} />
          )
          },
        }}

        />
            <Tab.Screen name="list" component={List}  options={{ headerShown: false,
           tabBarLabel: ({focused})=>{return(<Text style ={ Platform.OS === 'ios'?{color:focused?'#B99C28':'black',fontSize:8,height:'50%',textAlignVertical:'center',marginTop:'10%',
              paddingTop:'25%'}:{color:focused?'#B99C28':'black',fontSize:8,height:'50%',textAlignVertical:'center',marginTop:'1%',
              paddingTop:'1%'} }>القوائم </Text>)},
         tabBarIcon: ({ focused, size }) => {
        return (
          <FontAwesome5 name="file-alt" size={20}color={focused ? '#B99C28':"black"}style={{position:'absolute',top:15}}/>
      )
      },
       }}/>
        
      <Tab.Screen name="akremha" component={Akremha}  options={{ headerShown: false ,
             tabBarLabel: ({focused})=>{return(<Text style ={ Platform.OS === 'ios'?{color:focused?'#B99C28':'black',fontSize:8,height:'50%',textAlignVertical:'center',marginTop:'10%',
              paddingTop:'25%'}:{color:focused?'#B99C28':'black',fontSize:8,height:'50%',textAlignVertical:'center',marginTop:'1%',
              paddingTop:'1%'} }>اكرمها </Text>)},
             tabBarIconStyle:{
             marginTop:'10%'
             },
             tabBarIcon: ({ focused, size }) => {
            return (
              <AntDesign name="pluscircle" size={40} color="#B99C28"  style={{position:'absolute',top:-5}} />
          )
          },
      }}/>
           <Tab.Screen name="search" component={Search} options={{ headerShown: false,
         tabBarLabel: ({focused})=>{return(<Text style ={ Platform.OS === 'ios'?{color:focused?'#B99C28':'black',fontSize:8,height:'50%',textAlignVertical:'center',marginTop:'10%',
              paddingTop:'25%'}:{color:focused?'#B99C28':'black',fontSize:8,height:'50%',textAlignVertical:'center',marginTop:'1%',
              paddingTop:'1%'} }>البحث </Text>)},
         tabBarIcon: ({ focused, size }) => {
        return (
        <Feather name="search" size={20} color={focused ? '#B99C28':"black"}  style={{position:'absolute',top:15}}/>
      
      )
      },
     }} />
           <Tab.Screen name="Home" component={Home}  options={{ headerShown: false ,
    
        tabBarLabel: ({focused})=>{return(<Text style ={ Platform.OS === 'ios'?{color:focused?'#B99C28':'black',fontSize:8,height:'50%',textAlignVertical:'center',marginTop:'10%',
              paddingTop:'25%'}:{color:focused?'#B99C28':'black',fontSize:8,height:'50%',textAlignVertical:'center',marginTop:'1%',
              paddingTop:'1%'} }>الرئيسية </Text>)},
         tabBarIcon: ({ focused, size }) => {
        return (
         <Feather name="home" size={20} color={focused ? '#B99C28':"black"} style={{position:'absolute',top:15}} />
      
      )
      },
       }}/>
     
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    // Your code here
  }, []);
  return (
    
   <NavigationContainer>
    <Stack.Navigator initialRouteName="splash">
      <Stack.Screen name="tabs" component={MyTabs}  options={{ headerShown: false }} />
      <Stack.Screen name="search_map" component={Search_Map}  options={{ headerShown: false }} />
      <Stack.Screen name="food_offer" component={Food_offer}  options={{ headerShown: false }} />
      <Stack.Screen name="after_add" component={After_add}  options={{ headerShown: false }} />
      <Stack.Screen name="splash" component={Splash}  options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" component={Onboarding}  options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
