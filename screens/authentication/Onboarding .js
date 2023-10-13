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
import slides from "./slides";
import OnboardingItem from "./onBoardingItem";
import Paginator from "./pagitor";


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
          data={slides}
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

      <View style={{ alignItems: "center" ,}}>
        <Paginator data={slides} scrollX={scrollX} />
      </View>
      <View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("tabs")}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "400",
              fontSize: 14,
            }}
          >
            تسجيل الدخول
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("splash")}
        >
          <Text
            style={{
              color: "#B99C28",
              textAlign: "center",
              fontWeight: "400",
              fontSize: 14,
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
    backgroundColor: "#F7F9F9",
    //alignItems: 'center',
    justifyContent: "center",
  },

  registerButton: {
  //  padding: 18,
  justifyContent:'center',alignItems:'center',
    borderColor: "#B99C28",
    borderWidth: 1,
    borderRadius: 10,
//marginTop: 10,
   // marginBottom: 80,
   // marginLeft: 18,
   // marginRight: 18,
   width:'90%',
   height:50,
   marginHorizontal:'5%',
   //marginVertical:'2%',
   marginBottom:'5%'
  },

  loginButton: {
    backgroundColor: "#B99C28",
    justifyContent:'center',alignItems:'center',
   // padding: 18,
    borderRadius: 10,
  //  marginLeft: 18,
   // marginRight: 18,
    width:'90%',
    height:50,
   marginHorizontal:'5%',
   marginVertical:'2%',
  
  },
});
