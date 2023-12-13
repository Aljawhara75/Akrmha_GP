import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { getFood } from "../../api/database";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SearchBarComp({
  search,
  setSearch,
  handleSearchFood,
  setFoodData,
  setSelectedFoodType,
  placeholder
}) {
  const handleChange = (event) => {
    setSearch(event);
  };
  const getFoodData = async () => {
    const data = await getFood();
    const userId = await AsyncStorage.getItem("userId");

    if (data.success && data.found) {
      const foodData = data?.data.filter(
        (value) => value?.userId !== userId
      );
      setFoodData(foodData);
    }
  };
  return (
    <View style={styles.searchContainer}>
      <View style={styles.imagesContainer}>
        <TouchableOpacity
          style={styles.filterContainer}
          onPress={handleSearchFood}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
        {search?.length > 1 && (
          <TouchableOpacity
            style={styles.crossContainer}
            onPress={() => {
              getFoodData();
              setSearch("");
              setSelectedFoodType("");
            }}
          >
            <Ionicons name="close" size={24} color="#d4b846" />
          </TouchableOpacity>
        )}
      </View>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        onChangeText={handleChange}
        value={search}
        placeholderTextColor="grey"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
    borderColor: "#B99C28",
    borderWidth: 2,
    borderRadius: 8,
  },
  imagesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterContainer: {
    height: 45,
    width: 40,
    backgroundColor: "#B99C28",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  filterImg: {
    height: 28,
    width: 28,
  },
  crossContainer: {
    marginLeft: 15,
  },
  crossImg: {
    height: 30,
    width: 30,
  },
  textInput: {
    // backgroundColor:'teal',
    width: "70%",
    height: 20,
    textAlign: "right",
    direction: "rtl",
    paddingHorizontal: 20,
  },
});
