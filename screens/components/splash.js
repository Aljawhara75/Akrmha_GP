import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthContext from "../contexts/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Keep the splash screen visible while we fetch resources

const MINIMUM_TIME_IN_MS_FOR_INTRO = 500;

function Splash({ navigation }) {
  const { signIn, user } = useContext(AuthContext);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      SplashScreen.hideAsync().then(async () => {
        console.log(`SplashScreen.hideAsync`, SplashScreen.hideAsync)
        const user = await AsyncStorage.getItem("user");
        if (user) {
          signIn(JSON.parse(user));
        }
      });
    }, MINIMUM_TIME_IN_MS_FOR_INTRO);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{
            width: 800,
            height: 300,
            marginBottom: 10,
            marginLeft: 20,
            bottom: 80,
          }}
          source={require("../assets/logo.png")}
        />
        <Text
          style={{
            fontSize: 18,
            color: "#707070",
            fontWeight: "bold",
            marginTop: 10,
            bottom: 70,
          }}
        >
          وَكُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا ۚ إِنَّهُ لَا يُحِبُّ
          الْمُسْرِفِينَ
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Splash;
