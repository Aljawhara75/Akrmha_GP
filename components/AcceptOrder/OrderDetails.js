import React, { useState, useEffect } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { Text, StyleSheet, View, Image, ScrollView } from "react-native";
import Lunch from "../../assets/lunch.png";
import DetailScreenHeader from "../common/DetailScreenHeader";
import DetailSlider from "../DetailSlider";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  getFoodDetails,
  getAllOrderOfFood,
  getUserById,
} from "../../api/database";
import Spinner from "react-native-loading-spinner-overlay";
import * as Location from "expo-location";
import { db } from "../firebase";
import moment from "moment";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import { Ionicons } from "@expo/vector-icons";
import AcceptOrderComp from "./AcceptOrderComp.js";
import { states } from "../../utils/constants";
import { icons } from "../../utils/constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ratingCount } from "../../utils/ratingCount";
import { Alert } from "react-native";

export default function OrderDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const [foodData, setFoodData] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stateUpdate, setStateUpdate] = useState("");
  const [donerInfo, setDonerInfo] = useState({});
  const [existingOwnerRating, setExisitngOwnerRating] = useState({
    rating: 0,
    total: 0,
  });
  const [isShowAccordion, setIsShowAccordion] = useState(true);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }
  };

  useEffect(() => {
    getLocation();
    (async () => {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
    })();
  }, [Location, region, getLocation]);

  useEffect(() => {
    setLoading(true);
    const getFoodDeatils = async () => {
      const data = await getFoodDetails(id);
      if (data.found && data.success) {
        setFoodData(data.data);
      }
      setLoading(false);
    };
    getFoodDeatils();
  }, [id]);

  useEffect(() => {
    const getOrder = async () => {
      if (id) {
        const customer = await getAllOrderOfFood(id);
        if (customer.success && customer.found) {
          setCustomers(customer.data);
        } else {
          setCustomers([]);
        }
      }
    };
    getOrder();
  }, [id, stateUpdate]);

  const image = icons?.find((item) => item?.value === foodData?.type);

  useEffect(() => {
    const userInfo = async () => {
      if (foodData) {
        const userData = await getUserById(foodData.userId);
        if (userData?.found && userData?.success) {
          setDonerInfo(userData?.data);
        }
      }
    };
    userInfo();
  }, [foodData]);

  const handleDelete = async () => {
    Alert.alert(
      "تحذير",
      "هل تريد حذف عرض الطعام؟",
      [
        {
          text: "الغاء",
          style: "cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "نعم",
          onPress: async () => {
            await deleteDoc(doc(db, "AddFood", id));
            setLoading(false);
            navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const getOwnerRating = async () => {
      if (donerInfo) {
        const ownerRating = await ratingCount(donerInfo.id);
        if (ownerRating) {
          setExisitngOwnerRating(ownerRating);
        }
      }
    };
    getOwnerRating()
  }, [donerInfo])

  return (
    <ScrollView>
      <Spinner visible={loading} />
      <View style={styles.container}>
        <DetailScreenHeader name={donerInfo?.username} gender={donerInfo?.gender}
          rating={existingOwnerRating} />
        <View>
          <DetailSlider image={foodData?.image} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.flexBar}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {foodData?.title}
            </Text>
            <View style={styles.lunchBar}>
              <Text style={{ paddingLeft: 5 }}>
                {foodData?.type ? foodData?.type : "مطاعم"}
              </Text>
              <Image style={styles.lunchImg} source={image?.image} />
            </View>
          </View>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                textAlign: "right",
                marginBottom: 10,
              }}
            >
              {" "}
              {foodData?.foodType === "نعم"
                ? "يحتوي على مسببات حساسية"
                : foodData?.foodType === "لَا"
                  ? "لا يحتوي على مسببات حساسية"
                  : foodData?.foodType === "ربما" &&
                  " قد يحتوي على مسببات حساسية"}{" "}
            </Text>
            <Text style={styles.subHeading}>
              الكمية المتاحة : {foodData?.quantity}
            </Text>
            <Text style={styles.heading}>وصف الوجبة:</Text>
            <Text style={styles.description}>{foodData?.description}</Text>
          </View>
          <View>
            <Text style={{ textAlign: "right", marginTop: 10 }}>
              تاريخ الإنتهاء :{" "}
              {moment(foodData?.date?.toDate()).format("YYYY-MM-DD")}
            </Text>
          </View>
          <View
            style={{ ...styles.timeDateBar, marginTop: 15, marginBottom: 10 }}
          >
            <Text style={styles.dateTimeText}></Text>
            <Text style={styles.dateTimeText}>
              {" "}
              {moment(foodData?.startTime.toDate()).format("hh:mm A")} -{" "}
              {moment(foodData?.endTime.toDate()).format("hh:mm A")}
            </Text>
            <Text style={styles.dateTimeText}>وقت الاستلام </Text>
          </View>
          <View style={{ ...styles.timeDateBar, marginBottom: 25 }}>
            {/* <Text style={styles.dateTimeText}>مكان الاستلام:</Text> */}
          </View>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              initialRegion={region}
              style={{ width: 350, height: 180 }}
              region={region}
            >
              <Marker coordinate={region} title="Your Location" />
            </MapView>
          </View>
        </View>
        <View style={{ margin: 15 }}>
          <Collapse isExpanded={true}>
            <CollapseHeader>
              <TouchableOpacity
                style={styles.headerBar}
                onPress={() => setIsShowAccordion(!isShowAccordion)}
              >
                {!isShowAccordion ? (
                  <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    color="black"
                  />
                ) : (
                  <Ionicons name="chevron-up-outline" size={20} color="black" />
                )}
                <Text style={styles.tabsHeading}>طلبات الأشخاص</Text>
              </TouchableOpacity>
            </CollapseHeader>
            <CollapseBody>
              <AcceptOrderComp
                customers={customers}
                setStateUpdate={setStateUpdate}
                donerInfo= {donerInfo}
              />
            </CollapseBody>
          </Collapse>
        </View>
        <TouchableOpacity style={styles.btnStyle1} onPress={handleDelete}>
          <Text style={styles.btnText}>حذف</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "right",
    backgroundColor: "#E7EDED",
  },
  btnStyle1: {
    backgroundColor: "#f37f81",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 10,
    marginLeft: 20,
    width: 100, 
    height: 50, 
  },
  btnText: {
    color: "black",
  },
  mapContainer: {
    height: 170,
    justifyContent: "center",
    alignItems: "center",
  },
  lunchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    backgroundColor: "#F7EAEB",
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 10,
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
    marginTop: 10,
  },
  subHeading: {
    fontSize: 17,
    textAlign: "right",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "right",
    marginBottom: 15,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 17,
    color: "#848585",
    textAlign: "right",
  },
  timeDateBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  dateTimeText: {
    textAlign: "right",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E7EDED",
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
});
