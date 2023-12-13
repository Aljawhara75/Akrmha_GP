import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TabButtons from "./TabButtons.js";
import CardCollapse from "./CardCollapse.js";

export default function PromiseScreen({ navigation }) {
  const [tabType, setTabType] = useState("order");
  const [foodData, setFoodData] = useState(null);
  const [customerOrderData, setCustomerOrderData] = useState([]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.marginContainer}>
          <Text style={styles.heading}>القوائم</Text>
          <TabButtons
            tabType={tabType}
            setTabType={setTabType}
            setFoodData={setFoodData}
            setCustomerOrderData={setCustomerOrderData}
          />
        </View>
        <CardCollapse
          foodData={foodData}
          tabType={tabType}
          customerOrderData={customerOrderData}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  marginContainer: {
    paddingTop: 5,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  heading: {
    textAlign: "right",
    color: "#515C5D",
    fontSize: 34,
    fontWeight: "bold",
  },
});
