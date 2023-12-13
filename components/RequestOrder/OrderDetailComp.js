import React from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";

export default function OrderDetailComp({ orderData, image }) {
  const currentTime = orderData?.date?.toDate();
  const currentHour = currentTime.getHours();

  return (
    <View style={styles.flexBar}>
      <View>
        <Text style={styles.descriptionText} >الكمية المطلوبة: {orderData?.quantity} وجبة</Text>
        <View>
          <Text style={{ textAlign: "right", marginTop: 10 }}>
            تاريخ الإنتهاء :{" "}
            {moment(currentTime).format("YYYY-MM-DD")}
          </Text>
        </View>
        <Text style={styles.descriptionText}>وقت الاستلام  {moment(currentTime).format("hh:mm")}{currentHour >= 12 ? "مساء" : "صباح"}</Text>
      </View>
      <View style={styles.lunchBar}>
        <Text style={{ width: 50 }} >{orderData?.type}</Text>
        <View style={{ alignItems: "center", justifyContent: 'center', }} >
          <Image resizeMode="contain" style={styles.lunchImg} source={image?.image} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lunchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7EAEB",
    // backgroundColor: 'red',
    padding: 6,
    borderRadius: 10,
    width: 110
  },
  flexBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  lunchImg: {
    height: 45,
    width: 45,
    marginLeft: 8,
    // backgroundColor:'tan',
    // alignSelf: "center",
  },
  descriptionText: {
    color: '#2C3E50',
    marginTop: 4
  },
});
