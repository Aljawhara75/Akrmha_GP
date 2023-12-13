import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, StyleSheet, View, Image } from "react-native";
import User from "../../assets/userPic.png";
import female from "../../assets/female.png"
import { AirbnbRating } from "react-native-ratings";
import { Ionicons } from "@expo/vector-icons";

export default function DetailScreenHeader({ name, gender, rating }) {

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.flexBar}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#2c3e50"
          onPress={() => {
            navigation.goBack(null);
          }}
        />
        {/* <Text>{city ? city : "الرئيسية"}</Text> */}
      </View>
      <View style={styles.userContainer}>
        <Image style={styles.userImg} source={gender === "Male" ? User : female} />
        <View>
          <Text style={styles.userName}>
            {name}
          </Text>
          <Text style={styles.ratingText}>{rating?.total} تقييم</Text>
          <View style={styles.ratingBar}>
            <View style={{ marginBottom: 8, marginRight: 5 }}>
              <AirbnbRating
                size={15}
                ratingContainerStyle={{ height: 10, padding: 0, margin: 0 }}
                isDisabled={true}
                defaultRating={rating?.rating}
                starContainerStyle={{ paddingBottom: 8 }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10
  },
  backArrow: {
    height: 20,
    width: 30,
    marginRight: 15,
  },
  flexBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  userContainer: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
  },
  userImg: {
    height: 50,
    width: 50,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#D4B745"
  },
  userName: {
    textAlign: "right",
    marginRight: 10,
  },
  ratingBar: {
    flexDirection: "row-reverse",
    // alignItems: "baseline",
  },
  ratingText: {
    color: "#B99C28",
    marginRight: 10,
    textAlign: "right",
  },
});
