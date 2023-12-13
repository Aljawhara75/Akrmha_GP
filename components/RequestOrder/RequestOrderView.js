import React, { useState } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Lunch from "../../assets/lunch.png";
import { useNavigation } from "@react-navigation/native";
import userPic from "../../assets/userPic.png";
import female from "../../assets/female.png"

export default function RequestOrderView({ distance, name, image, ownerDetails, currentUser }) {
  const navigation = useNavigation();


  return (
    <>
      <View style={styles.container}>
        <View style={styles.flexBar}>
          <TouchableOpacity style={styles.filledBtn}
            onPress={() => navigation.navigate("userChat", { user: ownerDetails, currentUserId: currentUser?.id })}
          >
            <Text style={styles.filledBtnText}>مراسلة</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.flexBar}>
          <View>
            <Text style={styles.dishName}>{name}</Text>
            <View style={{ ...styles.flexBar, gap: 5, justifyContent: 'flex-end' }}>
              <Text style={{ color: "#818181" }}>كم {distance}</Text>
              <Ionicons name="location" size={20} color="#818181" />
            </View>
          </View>
          <View style={styles.lunchImgContainer}>
            <Image style={styles.lunchImg} source={ownerDetails.gender === "Male" || ownerDetails.gender === "male" ? userPic : female} />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginTop: -2,
    marginBottom: 30,
  },
  flexBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  filledBtn: {
    backgroundColor: "#B99C28",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  filledBtnText: {
    color: "white",
  },
  dishName: {
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 17,
    color: 'black',
    width: 120
  },
  lunchImgContainer: {
    height: 45,
    width: 45,
    borderRadius: 300,
    backgroundColor: "#F7EAEB",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#D4B745",
    borderWidth: 2,
  },
  lunchImg: {
    height: 40,
    width: 40,
    borderRadius: 40
  },
});
