import React, { useContext, useEffect } from "react";
import { View, Button, Alert, StatusBar, SafeAreaView, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./components/Register"; // Make sure the path is correct
import Login from "./components/Login";
import Onboarding from "./components/Onboarding";
import OTPVerification from "./components/OTPVerification";
import OnboardingItem from "./components/OnboardingItem";
import Slides from "./components/Slides";
import Splash from "./components/splash"; // Make sure the path is correct
import AuthContext, { AuthProvider } from "./contexts/auth";
import SearchPage from "./components/searchFood/SearchPage";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserWithPhoneAndUser } from "./api/database";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./components/firebase";
import Tabs from "./components/Tabs";
import Home from "./components/HomeScreen/Home";
import Menu from "./components/Menu";
import AddOne from "./components/AddOne";
import FoodCardDeatils from "./components/common/FoodCardDetails";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RequestOrder from "./components/RequestOrder/RequestOrder";
import OrderDetails from "./components/AcceptOrder/OrderDetails";
import MapScreen from "./components/searchFood/MapScreen";
import Chat from "./components/chatModule/Chat";
import EditProfile from "./components/EditProfile/EditProfile";
import Notification from "./components/HomeScreen/Notification";
// import messaging from '@react-native-firebase/messaging';
// import { Notifications } from 'react-native-notifications';

// import { StatusBar } from "expo-status-bar";

const Stack = createStackNavigator();

const TestScreen = () => {
  const testFunc = async () => {
    const userData = {
      mobileNum: "111",
      username: "bbb",
    };
    const result = await getUserWithPhoneAndUser(
      userData.mobileNum,
      userData.username
    );

    // Alert.alert(JSON.stringify(result, null, 2));

    if (result.success && result.found) {
      Alert.alert("حساب مٌسجل", result.message, [
        {
          text: "شكرًا",
          onPress: () => console.log("شكرًا Pressed"),
          style: "cancel",
        },
        {
          text: "تسجيل الدخول",
          onPress: () => console.log("تسجيل الدخول Pressed"),
          style: "default",
        },
      ]);
    } else if (result.success && !result.found) {
      console.log(
        `result.success && !result.found`,
        result.success && !result.found
      );

      await addDoc(collection(db, "users"), userData);
      // verficationResult && signIn(userData);
      // if add data to database, set isLogin to true and store user data
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Test" onPress={testFunc} />
    </View>
  );
};

const AppNavigator = () => {
  const { signed, signIn } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAsyncStorage = async () => {
      const localUser = await AsyncStorage.getItem("user");
      await signIn(JSON.parse(localUser));

      const user = localUser ? JSON.parse(localUser) : null;

      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Tabs" }], // Navigate to Tabs instead of Home
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Onboarding" }],
        });
      }
    };

    checkAsyncStorage();
  }, [signed]);

  return (
    <Stack.Navigator initialRouteName="Onboarding">
      {/* <Stack.Screen
        name="TestScreen"
        component={TestScreen}
        options={{ headerShown: false }}
      /> */}

      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="OTPVerification"
        component={OTPVerification}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Menu"
        component={Menu}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FoodDeatisScreen"
        component={FoodCardDeatils}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddOne"
        component={AddOne}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="requestOrder"
        component={RequestOrder}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="orderDeatils"
        component={OrderDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="mapScreen"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="userChat"
        component={Chat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
        <Stack.Screen
        name="notifications"
        component={Notification}
        options={{ headerShown: false, }}
      />
    </Stack.Navigator>
  );
};

export default function App() {

  // useEffect(() => {
  //   messaging().onNotificationOpenedApp(async (remoteMessage) => { });

  //   // Check whether an initial notification is available
  //   messaging()
  //     .getInitialNotification()
  //     .then(async (remoteMessage) => { });

  //   messaging().setBackgroundMessageHandler(async remoteMessage => {

  //     const { body, title } = remoteMessage.data;
          
  //     Notifications.postLocalNotification({
  //       title: title,
  //       body: body,
  //     });
  //   });

  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     try {

  //       const { body, title } = remoteMessage.data;

  //       Notifications.postLocalNotification({
  //         title: title,
  //         body: body,
  //       });
        
  //     } catch (error) {
  //       console.error('Error processing foreground notification:', error);
  //     }
  //   });

  //   return unsubscribe;

  // }, []);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flexGrow: 1, paddingTop: 10 }}>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AuthProvider>
              <AppNavigator />
            </AuthProvider>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
}
