import React, { useState } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import OrderQuantityComp from './OrderQuantityComp.js';
import { useNavigation } from "@react-navigation/native";
import female from "../../assets/female.png"
import user from "../../assets/userPic.png"

export default function OrderOverview({ distance, foodData, region, otherRegion, image, userName, donerInfo, currentUser }) {
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigation();
  const closeRBSheet = () => {
    this.RBSheet.close()
  }
  return (
    <>
      <View style={styles.container}>
        <View style={styles.flexBar}>
          <TouchableOpacity style={styles.filledBtn}
            onPress={() => navigation.navigate("userChat", { user: donerInfo, currentUserId: currentUser?.id })}
          >
            <Text style={styles.filledBtnText}>مراسلة </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.RBSheet.open()}
            style={styles.unfilledBtn}
          >
            <Text style={styles.unfilledBtnText}>الطلب الآن</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flexBar}>
          <View>
            <Text style={styles.dishName}>{userName}</Text>
            <View style={{ ...styles.flexBar, gap: 5 }}>
              <Text style={{ color: "#818181" }}>{Math.ceil(distance)} كم</Text>
              <Ionicons name="location" size={20} color="#818181" />
            </View>
          </View>
          <View style={styles.lunchImgContainer}>
            <Image style={styles.lunchImg} source={donerInfo.gender === "Male" ? user : female} />
          </View>
        </View>
      </View>
      <RBSheet
        ref={(ref) => {
          this.RBSheet = ref;
        }}
        height={350}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            // justifyContent: "center",
            // alignItems: "center",
          },
        }}
      >
        <OrderQuantityComp
          quantity={quantity}
          setQuantity={setQuantity}
          RBSheet={closeRBSheet}
          foodData={foodData}
          otherRegion={otherRegion}
          region={region}
          distance={distance}
        />
      </RBSheet>
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
    padding: 20,
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
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  filledBtnText: {
    color: "white",
  },
  unfilledBtnText: {
    color: "#B99C28",
  },
  dishName: {
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 17,
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
