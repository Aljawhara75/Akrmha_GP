import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, Image, ImageBackground } from "react-native";
import Food from "../../assets/rice.png";
import User from "../../assets/userPic.png";
import female from "../../assets/female.png";
import { EvilIcons } from "@expo/vector-icons";
import { getCurrentLocation } from "../../utils/currentLocation";
import { calculateDistance } from "../../utils/DistanceFinder";
import { getAllOrderOfFood, getUserById } from "../../api/database";
import { FontAwesome } from "@expo/vector-icons";

export default function FoodCard({ data, existingOrder }) {
  const [region, setRegion] = useState(null);
  const [existingFoodPending, setExistingFoodPending] = useState(null);
  const [donerInfo, setDonerInfo] = useState({});

  const getLocation = async () => {
    const region = await getCurrentLocation();
    setRegion(region);
  };

  useEffect(() => {
    getLocation();
    const userInfo = async () => {
      if (data) {
        const userData = await getUserById(data.userId);
        if (userData?.found && userData?.success) {
          setDonerInfo(userData?.data);
        }
      }
    };
    userInfo();
  }, [data]);

  useEffect(() => {
    const getOrder = async () => {
      if (data) {
        const customer = await getAllOrderOfFood(data.id);
        if (customer.success && customer.found) {
          const temp = customer?.data.filter(
            (food) => food?.orderState === "pending"
          );
          setExistingFoodPending(temp[0]);
        } else {
          setExistingFoodPending(null);
        }
      }
    };
    getOrder();
  }, [data]);

  const distance = region
    ? calculateDistance(region, {
        latitude: data?.pointX,
        longitude: data?.pointY,
      })
    : 0;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.foodImg}>
        <ImageBackground
          style={styles.imgSize}
          resizeMode="cover"
          imageStyle={{ borderTopRightRadius: 15, borderTopLeftRadius: 15 }}
          source={data?.image ? { uri: data?.image } : Food}
        >
          {existingOrder && existingFoodPending && (
            <View
              style={{
                position: "absolute",
                top: -10,
                right: 0,
              }}
            >
              <FontAwesome name="circle" size={24} color="#84c857" />
            </View>
          )}
        </ImageBackground>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.heading} numberOfLines={1}>
          {data?.title}
        </Text>
        <View style={styles.userBar}>
          <Text style={styles.userName}>{donerInfo?.username}</Text>
          <Image
            style={styles.userImg}
            resizeMode="stretch"
            source={donerInfo?.gender === "Male" ? User : female}
          />
        </View>
        <View style={styles.addressBar}>
          <Text style={styles.address}>{Math.ceil(distance)} كم</Text>
          <EvilIcons
            name="location"
            size={24}
            color="#2C3E50"
            style={{ marginTop: 2 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    width: "100%",
    marginTop: 10,
    marginBottom: 5,
    position: "relative",
    flex: 1,
  },
  foodImg: {
    width: "100%",
    //  borderTopRightRadius: 15,
    // borderTopLeftRadius: 15,
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
    borderRadius: 40,
    borderColor: "#D4B745",
    borderWidth: 1,
  },
  userName: {
    color: "#B99C28",
    marginRight: 10,
  },
  addressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
