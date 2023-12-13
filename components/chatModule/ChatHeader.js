import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import userPic from "../../assets/userPic.png";
import female from "../../assets/female.png";
import { Entypo } from '@expo/vector-icons';
import { AirbnbRating } from 'react-native-ratings';
import { ratingCount } from "../../utils/ratingCount";
import { useState, useEffect } from "react";

const ChatHeader = ({ user }) => {
  const navigation = useNavigation();
  const [existingRating, setExistingRating] = useState({
    rating: 0,
    total: 0,
  });

  useEffect(() => {
    const getRating = async () => {
      const rating = await ratingCount(user?.id);
      setExistingRating(rating)
    }
    getRating()
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
         <Entypo name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.flexBar}>
        <View style={{ marginRight: 10 }}>
          <Text style={styles.heading}>{user?.username}</Text>
          <View style={{ marginTop: 0, flexDirection: "row", alignItems: "center" }}>
            <Text style={{ marginTop: 7 }}>{existingRating?.total} تقييم </Text>
            <AirbnbRating
              size={10}
              ratingContainerStyle={{ height: 10, padding: 0, margin: 0 }}
              isDisabled={true}
              defaultRating={existingRating?.rating}
              starContainerStyle={{ paddingBottom: 8 }}
            />
          </View>
        </View>
        <Image
          style={styles.img}
          source={user.gender === "Male" ? userPic : female}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: "#DFE1E3",
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 20,
    textAlign: "right",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  btnContainer: {
    backgroundColor: "#B99C28",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 25,
    borderRadius: 6,
  },
  btnText: {
    color: "white",
  },
  flexBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    height: 55,
    width: 55,
    marginRight: 5,
    borderWidth: 2,
    borderRadius: 40,
    borderColor: "#D4B745",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default ChatHeader;
