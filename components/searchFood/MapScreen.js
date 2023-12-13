import React, { useState, useEffect, useRef } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import SearchBarComp from "./SearchBarComp";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Spinner from "react-native-loading-spinner-overlay";
import { getFood, getFoodBySearch, getFoodByType } from "../../api/database";
import { getCurrentLocation } from "../../utils/currentLocation";
import MapViewDirections from "react-native-maps-directions";
import { states } from "../../utils/constants";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from '@expo/vector-icons';

const MapScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [selectedFoodType, setSelectedFoodType] = useState("");
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default values or any initial location
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState(false);
  const [foodData, setFoodData] = useState([]);
  const mapViewRef = useRef(null);

  useEffect(() => {
    const getLocation = async () => {
      const region = await getCurrentLocation();
      setRegion(region);
    };
    getLocation();
  }, []);

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

  const handleSearchFood = async () => {
    if (search) {
      const getFoodData = await getFoodBySearch(search);
      const userId = await AsyncStorage.getItem("userId");
      if (getFoodData.success && getFoodData.found) {
        const foodData = getFoodData?.data.filter(
          (value) => value?.userId !== userId && value?.quantity > 0
        );
        setFoodData(foodData);
        if (foodData.length > 0) {
          const firstResult = getFoodData.data[0];
          mapViewRef.current.animateToRegion({
            latitude: firstResult.pointX,
            longitude: firstResult.pointY,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      }
    }
  };

  const handleTypeFood = async (type) => {
    const getFoodTypeData = await getFoodByType(type);
    const userId = await AsyncStorage.getItem("userId");
    if (type === "الكل") {
      getFoodData()
    } else if (getFoodTypeData.success && getFoodTypeData.found) {
      const foodData = getFoodTypeData?.data.filter(
        (value) => value?.userId !== userId && value?.quantity > 0
      );
      setFoodData(foodData);
      if (foodData?.length > 0) {
        const firstResult = getFoodTypeData.data[0];
        mapViewRef.current.animateToRegion({
          latitude: firstResult.pointX,
          longitude: firstResult.pointY,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    }
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

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 20 }}>
        <SearchBarComp
          search={search}
          setSearch={setSearch}
          handleSearchFood={handleSearchFood}
          setFoodData={setFoodData}
          setSelectedFoodType={setSelectedFoodType}
          placeholder='ابحث عن الطعام'
        />
        <Spinner visible={loading} />
      </View>

      <View
        style={{
          paddingRight: 20,
        }}
      >
        <FlatList
          contentContainerStyle={{
            direction: "rtl",
            flexDirection: "row-reverse",
          }}
          data={states}
          renderItem={({ item }) => <Item title={item.value} />}
          keyExtractor={(item) => item.value}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.map}>
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          style={{ width: "100%", height: "100%" }} // Set the width and height as needed
          region={region}
          ref={mapViewRef}
        >
          <Marker coordinate={region} title="Your Location" />
          {foodData.length > 0 ? (
            foodData?.map((food) => {
              const image = states?.find(
                (image) => image.value === food?.type
              );
              return (
                <TouchableOpacity key={food?.id}>
                  <Marker
                    coordinate={{
                      latitude: food?.pointX,
                      longitude: food?.pointY,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    title={food?.type}
                    image={image.image}
                    style={{ width: 30, height: 30 }}
                    onPress={() => {
                      navigation.navigate("FoodDeatisScreen", { id: food.id });
                    }}
                  />
                </TouchableOpacity>
              );
            })
          ) : (
            <Marker coordinate={region} title="Your Location" />
          )}
        </MapView>
        <Text style={{
          position: "absolute",
          right: 20, top: 500,
          backgroundColor: "#cdb03d",
          borderRadius: 100,
          padding: 3
        }}>
          <AntDesign
            name="bars" size={30} color="white"
            onPress={() => {
              navigation.goBack();
            }}
          />
        </Text>

      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 10,
  },
  map: {
    position: "relative",
    marginTop: 5,
    width: "100%",
    height: "100%",
  },
});
