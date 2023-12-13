import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, Image, ScrollView } from "react-native";
import DetailScreenHeader from "./DetailScreenHeader.js";
import DetailSlider from "../DetailSlider.js";
import OrderOverview from "../RequestOrder/OrderOverview.js";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import { useRoute } from "@react-navigation/native";
import { getFoodDetails, getUserById } from "../../api/database";
import Spinner from "react-native-loading-spinner-overlay";
import * as Location from "expo-location";
import { calculateDistance } from "../../utils/DistanceFinder";
import moment from "moment";
import MapViewDirections from "react-native-maps-directions";
import { states } from "../../utils/constants";
import { icons } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentLocation} from "../../utils/currentLocation.js";
import { ratingCount } from "../../utils/ratingCount.js";

export default function FoodCardDeatils({ data }) {
  const route = useRoute();
  const { id } = route.params;
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [donerInfo, setDonerInfo] = useState({});
  const [existingOwnerRating, setExisitngOwnerRating] = useState({
    rating: 0,
    total: 0,
  });
  const [currentUser, setCurrentUser] = useState({});
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [otherRegion, setOtherRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      const newRegion = await getCurrentLocation();
      setRegion(newRegion)
    })()
  }, [region])

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

  useEffect(() => {
    const userInfo = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const userData = await getUserById(userId);
      if (userData?.found && userData?.success) {
        setCurrentUser(userData?.data);
      }
    };
    userInfo();
  }, [foodData]);

  useEffect(() => {
    if (foodData) {
      setOtherRegion({
        latitude: foodData?.pointX,
        longitude: foodData?.pointY,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [foodData]);

  const distance = calculateDistance(region, otherRegion);

  const image = icons.find((item) => item?.value === foodData?.type);

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
        <DetailScreenHeader
          name={donerInfo?.username}
          gender={donerInfo?.gender}
          rating={existingOwnerRating}
        />
        <View>
          <DetailSlider image={foodData?.image} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.flexBar}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {foodData?.title}
            </Text>
            <View style={styles.lunchBar}>
              <Text style={{ paddingLeft: 5, width: 55 }}>
                {foodData?.type ? foodData?.type : "مطاعم"}
              </Text>
              <Image
                resizeMode="contain"
                style={styles.lunchImg}
                source={image?.image}
              />
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
            <Text style={styles.description}>
              {foodData?.description }
            </Text>
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
              <Marker coordinate={otherRegion} title="Other User Location" />
              <MapViewDirections
                origin={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                destination={{
                  latitude: otherRegion.latitude,
                  longitude: otherRegion.longitude,
                }}
                apikey={"AIzaSyC49-ii5Agv0-k5F-gg91G31kKwO9fpDTY"}
                strokeWidth={5}
                strokeColor="red"
              />
            </MapView>
          </View>
          <OrderOverview
            distance={distance}
            foodData={foodData}
            region={region}
            otherRegion={otherRegion}
            image={image}
            userName={donerInfo?.username}
            donerInfo={donerInfo}
            currentUser={currentUser}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "right",
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
    gap: 5,
    backgroundColor: "#F7EAEB",
    padding: 6,
    borderRadius: 10,
    width: 120,
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
});
