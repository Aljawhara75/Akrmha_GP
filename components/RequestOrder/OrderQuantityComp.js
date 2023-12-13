import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import IncrementComp from "../common/IncrementComp.js";
import FilledBtn from "./FilledBtn.js";

export default function OrderQuantityComp({ quantity, setQuantity, RBSheet, foodData, otherRegion, region, distance }) {

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.contentFlex}>
          <Ionicons name="close-circle-outline" size={30} onPress={() => RBSheet()} />
          <Text style={styles.heading}>حدد الكمية المطلوبة</Text>
        </View>
        <Text style={styles.description}>يرجى تحديد الكمية المطلوبة</Text>
        <Text style={styles.incrementHeading}>
          الكمية<Text style={{ color: "red" }}>*</Text>
        </Text>
        <View>
          <IncrementComp quantity={quantity} setQuantity={setQuantity} foodData={foodData} />
        </View>
      </View>
      <View>
        <FilledBtn
          title="ارسال"
          foodData={foodData}
          otherRegion={otherRegion}
          region={region}
          quantity={quantity}
          distance={distance}
          RBSheet={RBSheet}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "space-between",
    height: "100%",
  },
  contentFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    color: "#2C3E50",
    fontSize: 22,
    fontWeight: "bold",
  },
  description: {
    textAlign: "right",
    color: "#7E7E7E",
  },
  incrementHeading: {
    textAlign: "right",
    marginTop: 50,
  },
});
