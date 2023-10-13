import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  Touchable,
} from "react-native";
import Slides from "../components/Slides";
import OnboardingItem from "../components/OnboardingItem";
import Paginator from "../components/Paginator";
// import Login from './components/Login'; // Check the relative path
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

export default function Onboarding({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current; //gets current board's index
  const SlidesRef = useRef(null);
  //moves the index to current screen
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  //makes the next page appear 50% when scrolling
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={Slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewConfig={viewConfig}
          ref={SlidesRef}
        />
      </View>

      <View style={{ alignItems: "center" }}>
        <Paginator data={Slides} scrollX={scrollX} />
      </View>
      <View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "400",
              fontSize: 20,
            }}
          >
            تسجيل الدخول
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text
            style={{
              color: "#B99C28",
              textAlign: "center",
              fontWeight: "400",
              fontSize: 20,
            }}
          >
            إنشاء حساب
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: 'center',
    justifyContent: "center",
  },

  registerButton: {
    padding: 18,
    borderColor: "#B99C28",
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 80,
    marginLeft: 18,
    marginRight: 18,
  },

  loginButton: {
    backgroundColor: "#B99C28",
    padding: 18,
    borderRadius: 10,
    marginLeft: 18,
    marginRight: 18,
  },
});
