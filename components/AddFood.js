import React, { useState, useEffect } from "react";
import { uploadBytes, ref } from "firebase/storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
  Alert,
  Linking,
  Platform,
} from "react-native";
import moment from "moment";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";
import IncrementComp from "./common/IncrementComp";
import RBSheet from "react-native-raw-bottom-sheet";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "../components/firebase"; // or wherever your `storage` export is located
import { getDownloadURL } from "firebase/storage";
import Spinner from "react-native-loading-spinner-overlay";
import { states } from "../utils/constants";

function AddFood({ navigation: propNavigation }) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTimeEndPicker, setShowTimeEndPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);

  const handleSetTitle = (text) => {
    const trimmedText = text.replace(/^\s+/, '').substring(0, 50);
    if (trimmedText.length <= 50) {
      setTitle(trimmedText);
      // Reset any title error
      setErrors({ ...errors, title: "" });
    } else {      
      // Set an error if the length exceeds 50 characters
      setErrors({ ...errors, title: "اسم الطعام لا يزيد عن 50 حرفا*" });
    }
  };
  
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleChangeTime = (event, selectedTime) => {
    const currentTime = new Date();
    setShowTimePicker(false); // Hide the time picker immediately
  
    if (event.type === "set") {
      if (selectedTime >= currentTime) {
        // If selected time is in the future, update the startTime state
        setStartTime(selectedTime);
      } else {
        // If selected time is in the past, silently set the time to the current time
        setStartTime(currentTime);
      }
    }
  };
  
  
  

  const handleTimePicker = () => {
    setShowTimePicker(true);
  };
  

  const handleEndTimeChange = (event, selectedTime) => {
    if (event.type === "set") {
      setEndTime(selectedTime);
      setShowTimeEndPicker(false);
    } else {
      setShowTimeEndPicker(false);
    }
  }; 
  
  const handleEndTimePicker = () => {
    setShowTimeEndPicker(true);
  };

  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default values or any initial location
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [foodType, setFoodType] = useState("");
  const foodTypes = ["نعم", "لَا", "ربما"];

  const [errors, setErrors] = useState({
    title: "",
    type: "",
    description: "",
    quantity: "",
    preparation: "",
    //   receive: '',
    location: "",
    image: "",
  });

  const pickImage = async () => {
    Alert.alert(
      "Choose an option",
      "Would you like to take a photo or choose from the library?",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              alert("Camera permission is required to take photos.");
              return;
            }
  
            let result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
  
            if (!result.cancelled) {
              const imageUri = result.assets[0].uri;
              setImage(imageUri);
            }
          },
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              alert("Camera roll permission is required to choose photos.");
              return;
            }
  
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
  
            if (!result.cancelled) {
              const imageUri = result.assets[0].uri;
              setImage(imageUri);
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };
  

  const uploadImage = async () => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = image.substring(image.lastIndexOf("/") + 1);
      const imagesRef = ref(storage, `images/${filename}`);
      const snapshot = await uploadBytes(imagesRef, blob);
      const downloadURL = await getDownloadURL(imagesRef);
      setImage(downloadURL);
      return downloadURL;
    } catch (error) {
      console.error(
        "Error preparing file for upload or getting download URL",
        error
      );
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      // Handle permission denied
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

  const submitHandler = async () => {
    setIsLoading(true);
  
    try {
      const imageUrl = await uploadImage();
  
      const userId = await AsyncStorage.getItem("userId");
  
      if (
        title &&
        type &&
        quantity &&
        imageUrl && // Using imageUrl instead of image for Firestore upload
        foodType &&
        startTime &&
        endTime &&
        date
        && startTime < endTime
      ) {
  
        if (date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
          setErrors({
            ...errors,
            date: "يجب أن يكون التاريخ أكبر من أو يساوي تاريخ اليوم",
          });
          setIsLoading(false);
          return;
        }
  
        const res = await addDoc(collection(db, "AddFood"), {
          userId,
          title,
          id: Math.floor(Math.random() * (8000 - 1 + 1)) + 1,
          type,
          description,
          quantity,
          location,
          image: imageUrl,
          startTime,
          endTime,
          date,
          foodType,
          pointX: region.latitude,
          pointY: region.longitude,
        });
  
        const docRef = doc(db, "AddFood", res.id);
        await updateDoc(docRef, { id: res.id });
  
        navigation.navigate("AddOne", { image: imageUrl });
  
        setTitle("");
        setType("");
        setDescription("");
        setQuantity(1);
        setLocation("");
        setImage(null);
        setFoodType("");
  
      } else {
        setErrors({
          ...errors,
          title: title ? "" : "الرجاء تعبئة  عنوان العرض*",
          type: type ? "" : "الرجاء تحديد نوع الطعام*",
          startTime: startTime ? "" : "الرجاء تحديد وقت البدء*",
          endTime: endTime ? "" : "الرجاء تحديد وقت النهاية*",
          date: date ? "" : "الوجاء تحديد تاريخ الإنتهاء*",
          image: imageUrl ? "" : "الرجاء ارفاق صورة للطعام*",
          foodType: foodType ? "" : "الرجاء تحديد ما اذا الطعام يحتوي على مسببات حساسية*",
          startAndEndTime : startTime < endTime ? ""  : "يجب أن يكون وقت البدء أقل من وقت الانتهاء",
          
        });
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };  

  const handleQuantityChange = (newQuantity) => {
    // Set quantity to newQuantity if it's 100 or less, otherwise set to 100
    setQuantity(newQuantity <= 100 ? newQuantity : 100);
  };
  
  

return (
    <ScrollView style={styles.contentContainer}>
      <Spinner visible={isLoading} />
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 50,
          left: 10,
          zIndex: 1,
        }}
        onPress={() => navigation.navigate("Home")}
      >
        <AntDesign name="close" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>إضافه طعام</Text>
      <Text style={{ textAlign: "right", paddingRight: 10 }}>
        صلاحيه العرض 24 ساعه فقط و من ثم سيتم الغاء العرض تلقائياً
      </Text>
  
      <View style={{ ...styles.form, marginTop: 20 }}>
        <Text
          style={{
            ...styles.label,
            color: "#515C5D",
            textAlign: "right",
          }}
        >
          عنوان العرض
          <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          style={styles.inputfield}
          placeholder="عنوان العرض"
          onChangeText={handleSetTitle}
          value={title}
          maxLength={50} // Set the maximum length
        />
        {errors?.title && (
          <Text
            style={{
              color: "red",
              marginTop: -10,
              marginBottom: 10,
              textAlign: "right",
            }}
          >
            {errors?.title}
          </Text>
        )}
        <Text
          style={{
            ...styles.label,
            color: "#515C5D",
            textAlign: "right",
          }}
        >
          نوع الطعام
          <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TouchableOpacity
          onPress={() => this.RBSheet.open()}
          style={{
            ...styles.field,
            justifyContent: "space-between",
            textAlign: "right",
            borderColor: errors.type ? "red" : "#ccc",
          }}
        >
          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              width: "100%",
            }}
          >
            <Text style={{ textAlign: "right" }}>
              {type === null ? "غير محدد" : type}
            </Text>
            <Ionicons name="chevron-down-outline" size={24} color="#2c3e50" />
          </View>
        </TouchableOpacity>
        {errors?.type && (
          <Text
            style={{
              color: "red",
              marginTop: -10,
              marginBottom: 10,
              textAlign: "right",
            }}
          >
            {errors?.type}
          </Text>
        )}

        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={350}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              paddingTop: 30,
              paddingRight: 30,
              borderRadius: 20,
            },
          }}
        >
          <ScrollView>
            <View>
              {states?.map((category) => {
                if (category.value !== "الكل") {
                  return (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => {
                        setType(category.value);
                        this.RBSheet.close();
                      }}
                    >
                      <Text
                        style={{ ...styles.flavorsText, textAlign: "right" }}
                      >
                        {category.value}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              })}
            </View>
          </ScrollView>
        </RBSheet>
        <Text style={{ ...styles.label, textAlign: "right" }}>
        وصف الطعام
      </Text>
      <TextInput
        style={styles.textArea}
        underlineColorAndroid="transparent"
        placeholder="وصف الطعام"
        onChangeText={(text) => {
          setDescription(text);
          setErrors({
            ...errors,
            description: "",
          });
        }}
        value={description}
            placeholderTextColor="grey"
            numberOfLines={10}
            multiline={true}
        maxLength={500} // Set the maximum length
      />
      <Text style={{ alignSelf: 'flex-end', color: 'gray' }}>
        {description.length}/500
      </Text>
      {errors?.description && (
        <Text
          style={{
            color: "red",
            marginTop: -10,
            marginBottom: 10,
            textAlign: "right",
          }}
        >
          {errors?.description}
        </Text>
      )}
        <Text
          style={{
            ...styles.label,
            color: !!errors.quantity ? "red" : "#515C5D",
            textAlign: "right",
          }}
        >
          كمية الطعام
          <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View>
        <IncrementComp quantity={quantity} setQuantity={handleQuantityChange} />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "red" }}>*</Text>
          <Text style={{ ...styles.label, textAlign: "right" }}>
          فترة استلام العرض{" "}
          </Text>
        </View>
        <View style={styles.dateTimeContainer}>
          <View style={{ width: "45%" }}>
            <Text style={{ ...styles.label, textAlign: "right" }}>
              الى
          
            </Text>
            {Platform.OS === "android" && (
              <View style={styles.field}>
                <TouchableOpacity
                  onPress={handleEndTimePicker}
                  style={styles.input}
                >
                  <Text>{moment(endTime, "hh:mm").format("hh:mm a")}</Text>
                </TouchableOpacity>
              </View>
            )}
            {Platform.OS === "ios" ? (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={handleEndTimeChange}
              />
            ) : showTimeEndPicker ? (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={handleEndTimeChange}
                min={startTime}
                // style={{ ...styles.field, backgroundColor: "#efefef" }}
              />
            ) : (
              ""
            )}
            {errors?.endTime && (
              <Text
                style={{
                  color: "red",
                  marginTop: -10,
                  marginBottom: 10,
                  textAlign: "right",
                }}
              >
                {" "}
                {errors?.endTime}
              </Text>
            )}
          </View>

          <View style={{ width: "45%" }}>
            <Text style={{ ...styles.label, textAlign: "right" }}>
              من
            
            </Text>
            {Platform.OS === "android" && (
              <View style={styles.field}>
                <TouchableOpacity
                  onPress={handleTimePicker}
                  style={styles.input}
                >
                  <Text style={{ textAlign: "right" }}>
                    {moment(startTime, "hh:mm").format("hh:mm a")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {Platform.OS === "ios" ? (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={handleChangeTime}
              />
            ) : showTimePicker ? (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={handleChangeTime}
                // style={{ ...styles.field, backgroundColor: "#efefef" }}
              />
            ) : (
              ""
            )}
            {errors?.startTime && (
              <Text
                style={{
                  color: "red",
                  marginTop: -10,
                  marginBottom: 10,
                  textAlign: "right",
                }}
              >
                {" "}
                {errors?.startTime} 
              </Text>
            )}
          </View>
        </View>
        {errors?.startAndEndTime && (
          <View>
            <Text style={{ color: "red", marginBottom: 10, textAlign: "right" }}>
              {" "}
              {errors?.startAndEndTime}
            </Text>
          </View>
        )}
        <View style={{ width: "100%" }}>
          <Text style={{ ...styles.label, textAlign: "right", marginTop: 15 }}>
            {/* حدد تاريخ */}
            تاريخ الإنتهاء
            <Text style={{ color: "red" }}>*</Text>
          </Text>
          {Platform.OS === "android" && (
            <View style={styles.field}>
              <TouchableOpacity
                onPress={() => showDatepicker()}
                style={styles.input}
              >
                <Text style={{ textAlign: "right" }}>
                  {moment(date).format("YYYY-MM-DD")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {Platform.OS === "ios" ? (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          ) : showDatePicker ? (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
              minimumDate={new Date()}
              style={{ marginBottom: 15 }}
            />
          ) : (
            ""
          )}
          {errors?.date && (
            <Text
              style={{
                color: "red",
                marginTop: -10,
                marginBottom: 10,
                textAlign: "right",
              }}
            >
              {" "}
              {errors?.date}
            </Text>
          )}
        </View>

        <Text style={{ ...styles.label, textAlign: "right", marginBottom: 15 , marginTop:10}}>
          مكان الاستلام
          <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            style={{ width: 350, height: 180 }} // Set the width and height as needed
            region={region}
          >
            <Marker coordinate={region} title="Your Location" />
          </MapView>
        </View>

        <View>
          <Text
            style={{
              ...styles.labelPhoto,
              color: "#515C5D",
              textAlign: "right",
            }}
          >
            صورة الطعام
            <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View
            style={{
              ...styles.fieldPhoto,
              borderColor: !!errors.image ? "red" : "#ccc",
              flexDirection: "column", // Changed to column to stack items vertically
              alignItems: "center", // Center items horizontally
            }}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200, marginBottom: 10 }}
              />
            ) : (
              <View style={{ marginBottom: 10 }} />
            )}
            <Button title="اضافه صوره" onPress={pickImage} />
          </View>
          {errors?.image && (
            <Text
              style={{
                color: "red",
                marginTop: -10,
                marginBottom: 10,
                textAlign: "right",
              }}
            >
              {errors?.image}
            </Text>
          )}
        </View>
        <View>
          <Text style={{ textAlign: "right" }}>
            هل يحتوي الطعام على مسببات الحساسية ؟
            <Text style={{ color: "red" }}>* </Text>
            <Text
              onPress={() =>
                Linking.openURL(
                  "https://www.moh.gov.sa/awarenessplateform/HealthyLifestyle/Documents/Food-Allergy.pdf"
                )
              }
              style={{ color: "#B99C28", lineHeight: 25, textAlign: "right" }}
            >
              الاطلاع على مسببات الحساسية
            </Text>
          </Text>

          {foodTypes?.map((food, index) => {
            return (
              <View
                key={index}
                style={{ ...styles.checkboxBar, marginTop: 10 }}
              >
                <RadioButton.Android
                  value="first"
                  status={foodType === food ? "checked" : "unchecked"}
                  onPress={() => setFoodType(food)}
                  color="#444444"
                />
                <Text>{food}</Text>
              </View>
            );
          })}
          {errors?.foodType && (
            <Text
              style={{
                color: "red",
                marginTop: -10,
                marginBottom: 10,
                textAlign: "right",
              }}
            >
              {errors?.foodType}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={submitHandler}>
        <Text style={styles.buttonText}>اضافة</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default AddFood;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
    marginVertical: 30,
    marginHorizontal: 10,
    marginTop: 55,
  },
  form: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 15,
    color: "#515C5D",
    marginBottom: 5,
    textAlign: "right",
  },
  labelPhoto: {
    fontSize: 15,
    color: "#515C5D",
    marginBottom: 5,
    textAlign: "right",
  },
  required: {
    color: "red",
  },
  field: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Add space between items
    height: 40,
    textAlign: "right",
  },
  inputfield: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Add space between items
    height: 40,
    paddingRight: 20,
    textAlign: "right",
  },
  fieldPhoto: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Add space between items
  },

  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "right",
    direction: "rtl",
  },
  button: {
    backgroundColor: "#B99C28",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5,
  },
  dateTimeContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 0,
    marginTop: 10,
    alignItems: "center",
  },
  rbSheetContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Add space between items
    height: 40,
    paddingHorizontal: 10,
  },
  mapContainer: {
    height: 170,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  flavorsText: {
    marginVertical: 6,
  },
  // textAreaContainer: {
  //   backgroundColor:'tan',

  // },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    padding: 5,
    textAlign: "right",
  },
  textArea: {
    height: 100,
    justifyContent: "flex-start",
    paddingRight: 20,
    textAlign: "right",
    direction: "rtl",
  },
  statesHeading: {
    fontWeight: "bold",
    padding: 20,
    fontSize: 18,
  },
  checkboxBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  textAreaContainer: {
    borderWidth: 1,
    // other styles for the error state
  }, 
  timeError: {
    color: "red",
    marginTop: -10, // Adjust this as needed
    borderColor: "#ccc", // Change this color as needed
    borderRadius: 10,
    marginBottom: 20,
    padding: 5,
    textAlign: "right",
  },
  textArea: {
    height: 100,
    justifyContent: "flex-start",
    paddingRight: 20,
    textAlign: "right",
    direction: "rtl",
    borderWidth: 1, // Add border width
    borderColor: "#ccc", // Add border color, change as needed
    borderRadius: 10, // Add border radius for rounded corners
    padding: 10, // Add padding inside the text area
  },
});
