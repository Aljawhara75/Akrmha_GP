import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DetailScreenHeader from "../common/DetailScreenHeader.js";
import DetailSlider from "../DetailSlider.js";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import OrderDetailComp from "./OrderDetailComp.js";
import MapViewDirections from "react-native-maps-directions";
import tick from "../../assets/tick.png";
import RequestOrderView from "./RequestOrderView.js";
import { icons } from "../../utils/constants.js";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getRatingByOrderId, getUserById } from "../../api/database.js";
import { calculateDistance } from "../../utils/DistanceFinder.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RBSheet from "react-native-raw-bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import userPic from "../../assets/userPic.png";
import female from "../../assets/female.png";
import { AntDesign } from '@expo/vector-icons';
import { AirbnbRating } from 'react-native-ratings';
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import Spinner from "react-native-loading-spinner-overlay";
import { ratingCount } from "../../utils/ratingCount.js";

export default function RequestOrder({ data }) {
  const [ownerName, setOwnerName] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [currentRating, setCurrentRating] = useState(0);
  const [existingUserRating, setExistingUserRating] = useState(null);
  const [existingOwnerRating, setExisitngOwnerRating] = useState({
    rating: 0,
    total: 0,
  });
  const [loading, setLoaoding] = useState(false)
  const route = useRoute();
  const navigate = useNavigation()
  const { orderData } = route.params;

  const image = icons?.find(item => item?.value === orderData?.type);

  const region = {
    latitude: orderData?.pointX,
    longitude: orderData?.pointY,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }
  const otherRegion = {
    latitude: orderData?.ownerPointX,
    longitude: orderData?.ownerPointY,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  useEffect(() => {
    const userInfo = async () => {
      if (orderData) {
        const userData = await getUserById(orderData?.ownerUserId);
        if (userData?.found && userData?.success) {
          setOwnerName(userData?.data);
        }
      }
    }
    userInfo()

  }, [orderData]);

  useEffect(() => {
    const userInfo = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const userData = await getUserById(userId);
      if (userData?.found && userData?.success) {
        setCurrentUser(userData?.data);
      }
    }
    userInfo()

  }, [orderData]);

  const handleRating = async () => {
    setLoaoding(true)
    const payload = {
      id: 123,
      ratingGiverId: currentUser.id,
      ratingAccepterId: ownerName?.id,
      orderId: orderData?.orderId,
      rating: currentRating,
    };
    const res = await addDoc(collection(db, "UserRating"), payload);
    const docRef = doc(db, "UserRating", res._key.path.segments[1]);
    await updateDoc(docRef, { id: res._key.path.segments[1] });
    if (orderData) {
      const data = await getRatingByOrderId(orderData?.orderId, currentUser?.id);
      if (data?.found && data?.success) {
        setExistingUserRating(data?.data)
      }
    }
      if (ownerName) {
        const ownerRating = await ratingCount(ownerName.id);
        if (ownerRating) {
          setExisitngOwnerRating(ownerRating);
        }
      }
    setLoaoding(false);
  }

  useEffect(() => {
    const getOwnerRating = async () => {
      if (ownerName) {
        const ownerRating = await ratingCount(ownerName.id);
        if (ownerRating) {
          setExisitngOwnerRating(ownerRating);
        }
      }
    }
    const getRating = async () => {
      if (orderData && currentUser) {
        const data = await getRatingByOrderId(orderData?.orderId, currentUser?.id);
        if (data?.found && data?.success) {
          setExistingUserRating(data?.data)
        }
      }
    }
    getRating();
    getOwnerRating();
  }, [orderData, ownerName, currentUser])

  const distance = calculateDistance(region, otherRegion);
  return (
    <ScrollView>
      {/* // this is the component which includes order time, date, delivery location */}
      <Spinner visible={loading} />
      <View style={styles.container}>
        <DetailScreenHeader
          name={ownerName?.username}
          gender={ownerName?.gender}
          rating={existingOwnerRating}
        />
        <View>
          <DetailSlider image={orderData?.image} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.tickComp}>
            <View>
              <Text style={styles.tickHeading}>
                <Text>
                  {/* {
                    ownerName.username
                  } */}
                </Text>
                {
                  orderData?.orderState === "pending" ? "طلبك معلق" : " وافق على طلبك"
                }
              </Text>
              <Text>
                <Text style={{ fontWeight: 800 }}>
                  {
                    orderData?.foodType
                  }
                </Text>
                {": "}
                {orderData?.foodType === "نعم"
                  ? "يحتوي على مسببات حساسية  "
                  : orderData?.foodType === "لَا"
                    ? "لا يحتوي على مسببات حساسية"
                    : orderData?.foodType === "ريما" ?
                      "  قد يحتوي على مسببات حساسية " : ""}  {" "}
              </Text>
            </View>
            <View style={styles.tickImg}>
              {
                orderData?.orderState === "pending" ?
                  <MaterialCommunityIcons name="progress-clock" size={30} color="#cdb03d" />
                  :
                  <Image style={{ height: 30, width: 30 }} source={tick} />
              }
            </View>
          </View>
          <View style={{ marginBottom: 20, marginTop: 20 }}>
            <OrderDetailComp orderData={orderData} image={image} />
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
          <View>
            <RequestOrderView
              name={ownerName?.username}
              image={image}
              distance={distance}
              ownerDetails={ownerName}
              currentUser={currentUser}
            />
          </View>
          <TouchableOpacity disabled={ orderData?.orderState === "pending" ? true : false} 
          style={orderData?.orderState === "pending" ? {
            backgroundColor: "gray",
            borderRadius: 10,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          } :
          {
            backgroundColor: "#B99C28",
            borderRadius: 10,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          }
        } 
          onPress={() => this.RatingRBSheet.open()}>
            <Text style={styles.btnText}> قيم التجربة  </Text>
          </TouchableOpacity>
        </View>
        <RBSheet
          ref={(ref) => {
            this.RatingRBSheet = ref;
          }}
          height={430}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              padding: 10,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              backgroundColor: "#F7F9FC"
            },
          }}
        >
          <ScrollView>
            <View style={{ padding: 5 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                <TouchableOpacity>
                  <Ionicons
                    name="close-circle-outline"
                    size={30}
                    onPress={() => this.RatingRBSheet.close()}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
                <Text style={{ fontWeight: 600, fontSize: 15 }}>تقييم التجربة مع  {ownerName?.username}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: 18, marginTop: 15, borderRadius: 10 }}>
                <View>
                  {/* <AntDesign name="left" size={24} color="black" /> */}
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={{ gap: 4 }}>
                    <Text style={styles.dishName}>{ownerName.username}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text>{" "}{existingOwnerRating?.total} تقييم</Text>
                      <AirbnbRating showRating={false} size={17} isDisabled={true} defaultRating={existingOwnerRating?.rating} />
                    </View>
                  </View>
                  <View style={styles.lunchImgContainer}>
                    <Image style={{ width: 45, height: 45 }} source={ownerName?.gender === "Male" ? userPic : female} />
                  </View>
                </View>
              </View>
              {
                !existingUserRating ? <View style={{ display: "flex", gap: 20, flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 25 }}>
                  <View>
                    <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 800 }}> كيف كانت التجربة مع {ownerName?.username}</Text>
                  </View>
                  <View>
                    <Text style={{ textAlign: "center" }}>نطلب منك تخصيص بعض الوقت لتقييم التجربة مع {ownerName.username}، فهذا سيساعدنا في التحكم بجودة الخدمة في أفضل حالاتها</Text>
                  </View>
                  <View>
                    <AirbnbRating defaultRating={0} showRating={false} size={25} onFinishRating={(rating) => setCurrentRating(rating)} />
                    <Text style={{ textAlign: "center" }}>{currentRating} من 5</Text>
                  </View>
                  <TouchableOpacity disabled={currentRating === 0 ? true : false}
                    style={
                      currentRating === 0 ?
                        {
                          width: "95%",
                          paddingVertical: 18,
                          borderRadius: 10,
                          backgroundColor: "gray"
                        } :
                        {
                          width: "95%",
                          backgroundColor: "#B99C28",
                          paddingVertical: 18,
                          borderRadius: 10
                        }
                    }
                    onPress={handleRating}
                  >
                    <Text style={{ textAlign: "center", color: "white" }}>تقييم</Text>
                  </TouchableOpacity>
                </View> :
                  <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 10 }}>
                    <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                      <AirbnbRating showRating={false} size={25} isDisabled={true} defaultRating={existingUserRating?.rating} />
                      <Text>{existingUserRating?.rating} من 5</Text>
                    </View>
                    <View style={{ gap: 20 }}>
                      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 800, }}>شكرا على وقتك، هذا عظيم!</Text>
                      <Text style={{ textAlign: "center" }}>يسعدنا في أكرمها أنك حظيت بتجربة فريدة من نوعها. نتمنى لكم تحقيق المزيد من المشاركة المتميزة.</Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        width: "95%",
                        backgroundColor: "#B99C28",
                        paddingVertical: 18,
                        borderRadius: 10,
                        marginTop: 10
                      }}
                      onPress={() => {
                        this.RatingRBSheet.close();
                        navigate.reset({
                          index: 0,
                          routes: [{ name: "Tabs" }],
                        })
                      }}
                    >
                      <Text style={{ textAlign: "center", color: "white" }}>الرئيسية</Text>
                    </TouchableOpacity>
                  </View>
              }
            </View>
          </ScrollView>
        </RBSheet>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "right",
    paddingBottom: 20,
  },
  mapContainer: {
    height: 170,
    justifyContent: "center",
    alignItems: "center",
  },
  lunchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7EAEB",
    padding: 6,
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
  tickComp: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  tickImg: {
    borderRadius: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DDEFE7",
    padding: 14,
    marginLeft: 20,
  },
  tickHeading: {
    color: "#2C3E50",
    fontWeight: "bold",
    fontSize: 18,
  },
  btnContainer: {
    backgroundColor: "#B99C28",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "white",
    textAlign: "center",
  },
  dishName: {
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 17,
  },
  lunchImgContainer: {
    height: 50,
    width: 50,
    borderRadius: 300,
    marginTop: 10,
    borderColor: "#D4B745",
    borderWidth: 2,
  },
});
