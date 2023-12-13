import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserById } from "../../api/database";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Platform,
} from "react-native";
import { getFood } from "../../api/database";
import HomeFoodCard from "../common/HomeFoodCard";
import { states } from "../../utils/constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Spinner from "react-native-loading-spinner-overlay";
import User from "../../assets/userPic.png";
import female from "../../assets/female.png";
import { Ionicons } from '@expo/vector-icons';
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

function Home({ navigation }) {
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isNotification, setIsNotification] = useState(null)

  const getFoodData = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("userId");
    const data = await getFood();
    if (data.success && data.found) {
      const foodData = data?.data
        .filter((value) => value?.userId !== userId && value?.quantity > 0)
        .sort((a, b) => b.date - a.date);
      setFoodData(foodData.slice(0, 5));
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    getFoodData();
  }, []);

  useEffect(() => {
    const userInfo = async () => {
      setLoading(true)
      const userId = await AsyncStorage.getItem("userId");
      const userData = await getUserById(userId);
      if (userData?.found && userData?.success) {
        setCurrentUser(userData?.data);
      }
      setLoading(false);
    };
    userInfo();
  }, [isNotification]);

  const handleNotification = async (notification) => {
    setLoading(true)
    const docRef = doc(db, "users", currentUser?.id);
    await updateDoc(docRef, { isNotification: notification });
    setIsNotification(notification)
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <View
        style={{
          flex: 0.6,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,
        }}
      >
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            navigation.navigate("Menu");
          }}
        >
          <Image
            style={styles.user}
            source={currentUser.gender === "Male" ? User : female}
          />
          <Text style={styles.title}></Text>
        </TouchableOpacity>
        {
           <TouchableOpacity style={{ padding: 6 }} onPress={() => navigation.navigate("notifications")}>
            <Ionicons name="notifications" size={24} color="black" />
          </TouchableOpacity> 
        }

      </View>
      {/* Home Pic Component */}
      <View style={{ flex: 2 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={styles.pic}
            source={require("../../assets/homePic.png")}
          />
        </View>
      </View>
      {/* Categories Component */}
      <View style={{ flex: 1.25 }}>
        <View style={{ paddingHorizontal: 10 }}>
          <Text
            style={{
              fontSize: 17,
              textAlign: "right",
              fontWeight: "bold",
              marginTop: 4,
            }}
          >
            {" "}
            التصنيفات{" "}
          </Text>
          <FlatList
            data={states.slice(1, states.length)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ marginHorizontal: 4, marginVertical: 2 }}
                onPress={() =>
                  navigation.navigate("Search", { foodType: item.value })
                }
              >
                <Image source={item.image} style={{ width: 60, height: 90 }} />
              </TouchableOpacity>
            )}
            horizontal={true}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            inverted
          />
        </View>
      </View>
      {/* Offers Component */}
      <View style={Platform.OS === "ios" ? { flex: 2.3 } : { flex: 2.57 }}>
        <View style={{ padding: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 4,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Search", { foodType: "الكل" })
              }
            >
              <Text style={{ fontSize: 14, color: "#C0A741" }}>
                {" "}
                شاهد الكل{" "}
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              أحدث العروض
            </Text>
          </View>
          <View style={{ paddingHorizontal: 5 }}>
            <FlatList
              data={foodData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ marginHorizontal: 4 }}
                  onPress={() =>
                    navigation.navigate("FoodDeatisScreen", { id: item.id })
                  }
                >
                  <HomeFoodCard data={item} />
                </TouchableOpacity>
              )}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              inverted
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between", // Distributes child elements (title and menu icon) across the main axis (in this case, horizontally)
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menuButton: {
    marginBottom: 3,
    width: 50,
    height: 50,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  user: {
    width: 45,
    height: 45,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#D4B745",
  },
  pic: {
    width: "100%",
    height: "100%",
  },
  title: {
    flexDirection: "row",
    fontSize: 21,
    fontWeight: "bold",
    marginLeft: 300,
    marginTop: 22,
    color: "#2C3E50",
  },
});

export default Home;
