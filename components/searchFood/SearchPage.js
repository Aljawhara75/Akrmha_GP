import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBarComp from "./SearchBarComp.js";
import Ladder from "../../assets/ladder.png";
import FoodCard from "../common/FoodCard.js";
import { getFood, getFoodBySearch, getFoodByType } from "../../api/database.js";
import { useNavigation, useRoute } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import { states } from "../../utils/constants.js";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [foodData, setFoodData] = useState([]);
  const [selectedFoodType, setSelectedFoodType] = useState("");
  const [loading, setLoading] = useState(false);
  const [slectedItem, setSelectedItem] = useState("");

  const route = useRoute()
  const foodType = route?.params?.foodType
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    getFoodData();
  }, []);

  const getFoodData = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const data = await getFood();
    if (data.success && data.found) {
      const foodData = data?.data.filter(
        (value) => value?.userId !== userId && value?.quantity > 0
      );
      setFoodData(foodData);
      setLoading(false);
    }
  };

  handleClearAll = () => {
    setSearch("");
    setSelectedFoodType("");
    getFoodData();
  };

  const Item = ({ title }) => (
    <TouchableOpacity onPress={() => handleTypeFood(title)}>
      <View
        style={{ marginLeft: 10, marginTop: 20, justifyContent: "flex-end" }}
      >
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItemOne = ({ item }) => (
    <TouchableOpacity
      style={{ width: "48%" }}
      onPress={() => navigation.navigate("FoodDeatisScreen", { id: item.id })}
    >
      <FoodCard data={item} />
    </TouchableOpacity>
  );

  const handleSearchFood = async () => {
    if(search.trim() !== "") {
      setSelectedItem(search);
      const getFoodData = await getFoodBySearch(search.trim());
      const userId = await AsyncStorage.getItem("userId");
      if (getFoodData.success && getFoodData.found) {
        const foodData = getFoodData?.data.filter(
          (value) => value?.userId !== userId && value?.quantity > 0
        );
        setFoodData(foodData);
    } else {
      setFoodData([]);
    }
  }
  };

  useEffect(() => {
    if (foodType) {
      handleTypeFood(foodType)
    }
  }, [foodType])
  
  const handleTypeFood = async (type) => {
    if (type === "الكل") {
      await getFoodData();
      setSelectedFoodType("الكل");
    } else {
      const getFoodData = await getFoodByType(type);
      const userId = await AsyncStorage.getItem("userId");
      setSelectedFoodType(type);
      if (getFoodData.success && getFoodData.found) {
        const foodData = getFoodData?.data.filter(
          (value) => value?.userId !== userId && value?.quantity > 0
        );
        setFoodData(foodData);
      } else {
        setFoodData([]);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Spinner visible={loading} />
      <ScrollView>
        {/* <DetailScreenHeader /> */}
        <SearchBarComp
          search={search}
          setSearch={setSearch}
          handleSearchFood={handleSearchFood}
          setFoodData={setFoodData}
          setSelectedFoodType={setSelectedFoodType}
          placeholder='ابحث عن الطعام'
        />
        <View>
          <FlatList
            contentContainerStyle={{
              direction: "rtl",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
            style={styles.flatListContainer}
            data={states}
            renderItem={({ item }) => <Item title={item?.value} />}
            keyExtractor={(item) => item?.label}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            extraData={states}
          />
        </View>

        <View style={styles.textBar}>
          {(slectedItem || selectedFoodType) && (
            <Text>
              {foodData.length}نتائج البحث "{slectedItem.trim() ? slectedItem.trim() : selectedFoodType}
              "
            </Text>
          )}
          <TouchableOpacity
            style={styles.container1}
            onPress={() => navigation.navigate("mapScreen")}
          >
            <View style={styles.flexBar}>
              <Text style={styles.ladderText}>مشاهدة الخريطة</Text>
              <Image source={Ladder} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <FlatList
            ListEmptyComponent={() => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Text style={{ textAlign: "right", fontWeight: "bold" }}>
                  لا توجد عروض تتوافق مع عنوان بحثك
                </Text>
              </View>
            )}
            data={foodData}
            renderItem={renderItemOne}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            extraData={foodData}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
    marginHorizontal: 20,
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  searchInputContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 45,
    width: "100%",
    borderColor: "#515C5D", // Border in green
    borderWidth: 0.5, // Border width
    borderBottomWidth: 0.5, // Border width
  },
  inputStyle: {
    textAlign: "right",
    color: "#515C5D",
    fontSize: 15,
  },
  flatListContainer: {
    // justifyContent:'flex-end',
    // backgroundColor:'red',
    // flexDirection:'row',
    // direction:'rtl'
  },
  textBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  container1: {
    flex: 1,
    alignSelf: "flex-start",
  },
  flexBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  ladderText: {
    color: "#B99C28",
  },
  clearBtn: {
    color: "#B99C28",
    fontSize: 15,
    textAlign: "right",
    marginTop: 10,
  },
});

export default SearchPage;
