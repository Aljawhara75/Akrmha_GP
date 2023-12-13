import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { getFoodByUserId, getAllOrder, getFoodByOwnerId } from "../../api/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import { useIsFocused } from "@react-navigation/native";

export default function TabButtons({
  tabType,
  setTabType,
  setFoodData,
  setCustomerOrderData,
}) {
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(true);
    const getFoodData = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (tabType === "order") {
        const data = await getFoodByOwnerId(userId);
        if (data.found && data.success) {
          setFoodData(data.data);
          setCustomerOrderData([]);
          setLoading(false);
        } else {
          setLoading(false);
          setFoodData([]);
        }
      } else if (tabType === "history") {
        const data = await getAllOrder(userId);
        if (data.found && data.success) {
          setCustomerOrderData(data.data);
          setFoodData([]);
          setLoading(false);
        } else {
          setCustomerOrderData([]);
          setLoading(false);
        }
      }
    };
    getFoodData();
  }, [tabType, isFocused]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={tabType === "order" ? styles.filledBtn : styles.unFilledBtn}
        onPress={() => setTabType("order")}
      >
        <Text
          style={
            tabType === "order" ? styles.filledBtnText : styles.unFilledBtnText
          }
        >
          عروضي
        </Text>
        <Spinner visible={loading} />
      </TouchableOpacity>
      <TouchableOpacity
        style={tabType === "history" ? styles.filledBtn : styles.unFilledBtn}
        onPress={() => setTabType("history")}
      >
        <Text
          style={
            tabType === "history"
              ? styles.filledBtnText
              : styles.unFilledBtnText
          }
        >
          طلباتي
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F2EDD8",
    // backgroundColor:'green',
    padding: 6,
    marginTop: 10,
  },
  filledBtn: {
    backgroundColor: "#B99C28",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    width: "50%",
    borderRadius: 8,
  },
  filledBtnText: {
    color: "white",
  },
  unFilledBtn: {
    width: "50%",
  },
  unFilledBtnText: {
    color: "#777777",
  },
  unFilledBtn: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    width: "50%",
    borderRadius: 8,
  },
});
