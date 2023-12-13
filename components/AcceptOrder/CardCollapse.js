import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import FoodCard from "../common/FoodCard.js";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import HistoryDeatail from "./HistoryDetail.js";
import { getAllOrderOfFoodPending } from "../../api/database.js";

export default function CardCollapse({ foodData, tabType, customerOrderData }) {
  const navigation = useNavigation();
  const [existingOrder, setExistingOrder] = useState(true);
  const [isShowAccordion, setIsShowAccordion] = useState(true);

  const Item = ({ item }) => (
    <TouchableOpacity
      style={{ width: "48%" }}
      onPress={() => navigation.navigate("orderDeatils", { id: item.id })}
    >
      <FoodCard data={item} existingOrder={existingOrder} />
    </TouchableOpacity>
  );

  const Customer = ({ customer }) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() =>
          navigation.navigate("requestOrder", { orderData: customer })
        }
      >
        <HistoryDeatail customer={customer} />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {tabType === "order" ? (
          foodData?.length > 0 ? (
            <Collapse isExpanded={true}>
              <CollapseHeader>
                <TouchableOpacity
                  style={styles.headerBar}
                  // onPress={() => setIsShowAccordion(!isShowAccordion)}
                >
                  {/* {!isShowAccordion ? (
                    <Ionicons
                      name="chevron-down-outline"
                      size={20}
                      color="black"
                    />
                  ) : (
                    <Ionicons name="chevron-up-outline" size={20} color="black" />
                  )} */}
                  <Text style={styles.tabsHeading}>العروض الحالية</Text>
                </TouchableOpacity>
              </CollapseHeader>
              <CollapseBody>
                <View
                  style={{ backgroundColor: "#E7EDED", paddingHorizontal: 20 }}
                >
                  <FlatList
                    data={foodData}
                    renderItem={Item}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                  />
                </View>
              </CollapseBody>
            </Collapse>
          ) : (
            <View
              style={
                Platform.OS === "ios"
                  ? {
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }
                  : {
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 30,
                  }
              }
            >
              <Text style={{ textAlign: "right" }}>
                لم يتم العثور على البيانات
              </Text>
            </View>
          )
        ) : customerOrderData && customerOrderData.length > 0 ? (
          <Collapse isExpanded={true}>
            <CollapseHeader>
              <TouchableOpacity
                style={styles.headerBar}
                // onPress={() => setIsShowAccordion(!isShowAccordion)}
              >
                {/* {!isShowAccordion ? (
                  <Ionicons name="chevron-down-outline" size={20} color="black" />
                ) : (
                  <Ionicons name="chevron-up-outline" size={20} color="black" />
                )} */}
                <Text style={styles.tabsHeading}>العروض الحالية</Text>
              </TouchableOpacity>
            </CollapseHeader>
            <CollapseBody>
              <View style={{ backgroundColor: "#E7EDED", paddingHorizontal: 20 }}>
                <FlatList
                  data={customerOrderData}
                  renderItem={({ item }) => <Customer customer={item} />}
                  keyExtractor={(item) => item.orderId}
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                />
              </View>
            </CollapseBody>
          </Collapse>
        ) : (
          <View
            style={
              Platform.OS === "ios"
                ? {
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }
                : {
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 30,
                }
            }
          >
            <Text style={{ textAlign: "right" }}>لم يتم العثور على البيانات</Text>
          </View>
        )}
      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {},
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#E7EDED",
    paddingHorizontal: 20,
    paddingVertical: 10,

  },
  tabsHeading: {
    fontSize: 15,
    fontWeight: "600",
  },
  cardContainer: {
    borderRadius: 15,
    width: "49%",
    marginTop: 10,
    marginBottom: 5,
  },
  foodImg: {
    width: "100%",
  },
  imgSize: {
    width: "100%",
    height: 150,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: "#c4c4c4",
  },
  textContainer: {
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  heading: {
    textAlign: "right",
    // direction: "rtl",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
    color: "#2C3E50",
  },
  userBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginVertical: 10,
  },
  userImg: {
    height: 30,
    width: 30,
  },
  userName: {
    color: "#B99C28",
    marginRight: 10,
  },
  addressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pinImg: {
    height: 20,
    width: 13,
  },
  address: {
    marginRight: 5,
    color: "#2C3E50",
  },
});
