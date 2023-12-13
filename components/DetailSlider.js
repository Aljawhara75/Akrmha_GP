import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import Slick from "react-native-slick";
import Saudi from "../assets/saudi.png";

export default function DetailSlider({ image }) {
  return (
    <View style={styles.cardContainer}>
      <Slick
        activeDotColor="#2C3E50"
        dotStyle={{ height: 11, width: 11, borderRadius: 20 }}
        activeDotStyle={{ height: 11, width: 11, borderRadius: 20 }}
        style={styles.wrapper}
        showsButtons={false}
      >
        <View style={styles.slide1}>
          <Image
            style={{ width: "100%", height: "100%" }}
            source={image && { uri: image }}
          />
        </View>
      </Slick>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 15,
    // flex:1
  },
  wrapper: {
    backgroundColor: "green",
    height: 200,
    // width:200
  },
  slide1: {
    // flex: 1,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  slide2: {
    // flex: 1,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5",
  },
  slide3: {
    // flex: 1,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9",
  },
  text: {
    color: "red",
    fontSize: 30,
    fontWeight: "bold",
  },
});
