import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { getUserById } from "../../api/database";
import User from "../../assets/userPic.png";
import female from "../../assets/female.png";
import { calculateDistance } from "../../utils/DistanceFinder";

const HistoryDeatail = ({ customer }) => {
  const [donerInfo, setDonerInfo] = useState("");

  const region = {
    latitude: customer?.pointX,
    longitude: customer?.pointY,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const otherRegion = {
    latitude: customer?.ownerPointX,
    longitude: customer?.ownerPointY,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    const userInfo = async () => {
      if (customer) {
        const userData = await getUserById(customer.ownerUserId);
        if (userData?.found && userData?.success) {
          setDonerInfo(userData?.data);
        }
      }
    };
    userInfo();
  }, [customer]);

  const distance = region ? calculateDistance(region, otherRegion) : 0;

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={styles.foodImg}>
        <Image
          style={styles.imgSize}
          resizeMode="cover"
          source={{ uri: customer?.image }}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.heading} numberOfLines={1}>
          {customer?.title}
        </Text>
        <View style={styles.userBar}>
          <Text style={styles.userName}>{donerInfo?.username}</Text>
          <Image
            style={styles.userImg}
            resizeMode="stretch"
            source={donerInfo.gender === "Male" ? User : female}
          />
        </View>
        <View style={styles.addressBar}>
          <View style={styles.acceptText}>
            <Text style={{ color: "#ba9c27", textAlign: "center" }}>
              {customer?.orderState === "pending"
                ? "قيد المعالجة"
                : customer?.orderState}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexWrap: "wrap-reverse",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Text style={styles.address}>{distance} كم</Text>
            <EvilIcons
              name="location"
              size={24}
              color="#2C3E50"
              style={{ marginTop: 2 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#D4B745",
  },
  userName: {
    color: "#B99C28",
    marginRight: 10,
  },
  addressBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: -2,
  },
  pinImg: {
    height: 20,
    width: 13,
  },
  address: {
    color: "#2C3E50",
    flexDirection: "row",
  },
  acceptText: {
    backgroundColor: "#f6f3e4",
    padding: 5,
    marginRight: 5,
    borderBottomLeftRadius: 10,
    borderBottomRigthRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 0.6,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HistoryDeatail;
