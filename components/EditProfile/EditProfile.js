import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Platform,
  ToastAndroid,
  AlertIOS,
} from "react-native";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getUserById } from "../../api/database";
import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";
// import { states } from "../Register";
import female from "../../assets/female.png";
import UserPic from "../../assets/userPic.png";
import Dropdown from "../Dropdown";
import AuthContext from "../../contexts/auth";
import Icon from 'react-native-vector-icons/Ionicons';
import { AirbnbRating } from 'react-native-ratings';
import { ratingCount } from "../../utils/ratingCount";


const states = [
  { key: "الرياض", value: "الرياض" },
  { key: "مكة المكرمة", value: "مكة المكرمة" },
  { key: "المدينة المنورة", value: "المدينة المنورة" },
  { key: "القصيم", value: "القصيم" },
  { key: "الشرقية", value: "الشرقية" },
  { key: "عسير", value: "عسير" },
  { key: "تبوك", value: "تبوك" },
  { key: "حائل", value: "حائل" },
  { key: "الحدود الشمالية", value: "الحدود الشمالية" },
  { key: "جازان", value: "جازان" },
  { key: "نجران", value: "نجران" },
  { key: "الباحة", value: "الباحة" },
  { key: "الجوف", value: "الجوف" },
  { key: "المنطقة الشمالية الغربية", value: "المنطقة الشمالية الغربية" },
];
export default function EditProfile({ navigation }) {
  const { user, updateUser } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNum, setMobileNum] = useState(user?.mobileNum);
  const [city, setCity] = useState(user?.city);
  const [errors, setErrors] = useState({
    username: "",
    mobileNum: "",
    city: "",
  });
 const [existingRating, setExistingRating] = useState({
    rating: 0,
    total: 0,
});

useEffect(() => {
    const getRating = async () => {
        const rating = await ratingCount(user?.id);
        if (rating) {
            setExistingRating(rating)
        }
    }
    getRating()
}, [user]);

  const profileEditHandler = async () => {
    // check if user exist
    const fetchUserResult = await getUserById(user?.id);

    if (fetchUserResult.success && fetchUserResult.found) {
      const updatedData = {
        city: city,
        mobileNum: mobileNum,
        username: username,
      };
      const docRef = doc(db, "users", user?.id);
      await updateDoc(docRef, updatedData);
      const updatedUser = { ...user, ...updatedData };
      updateUser(updatedUser);
      // if (Platform.OS === 'android') {
      //   ToastAndroid.show('تم تحديث الملف الشخصي بنجاح!')
      // } else {
      //   AlertIOS.alert('تم تحديث الملف الشخصي بنجاح!');
      // }
      setErrors({
        ...errors,
        mobileNum: fetchUserResult?.errors ? fetchUserResult.errors.phone : "",
        username: fetchUserResult?.errors
          ? fetchUserResult.errors.username
          : "",
      });
    } else if (fetchUserResult.success && !fetchUserResult.found) {
      setUsername("");
      setMobileNum("");
      setCity("");
    }
  };

  const submitHandler = async () => {
    let isValid = true;
    const newErrors = {};
    setIsLoading(true);
    try {
      // Validate username (letters and numbers)
      const hasLetters = /[a-zA-Z]/.test(username);

      if (!hasLetters) {
        newErrors.username = "اسم المستخدم يجب ان يحتوي حروف ";
        isValid = false;
      }

      // Validate phone number (9 digits)
      if (mobileNum.length !== 9) {
        newErrors.mobileNum = "رقم الهاتف يجب ان يحتوي على 9 ارقام";
        isValid = false;
      }

      if (username && mobileNum && city) {
        await profileEditHandler();
      } else {
        setErrors({
          ...errors,
          ...newErrors,
          city: city ? "" : "المدينة *",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {/* Menu Icon */}
      <View style={styles.menuContainer}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={30} color="black"
            onPress={() => navigation.navigate("Menu")}
          />
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 10 }}>
        {/* User Profile Section */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            gap: 20,
            position: "relative",
            bottom: 38,
            marginTop: 20,
          }}
        >
              <View style={{ alignItems: 'center' }}>
                {/* <View> */}
                <Image
                    style={{ width: 60, height: 60, borderRadius: 30,    borderWidth: 2, borderColor: "#D4B745", }}
                    source={user?.gender === 'Male' ? UserPic : female}
                />
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <AirbnbRating
                        size={14}
                        ratingContainerStyle={{ height: 10, padding: 0, margin: 0 }}
                        isDisabled={true}
                        defaultRating={existingRating?.rating}
                        starContainerStyle={{ paddingBottom: 8 }}
                    />
                    <Text style={{ marginTop: 8 }}>{existingRating?.total} تقييم </Text>
                </View>
                {/* </View> */}
            </View>
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                padding: 5,
                gap: 5,
                alignItems: "center",
                borderRadius: 5,
                backgroundColor: "#FEE9E2",
              }}
            >
              <Text style={{ color: "#F00F43" }}>عرض</Text>
              <Text style={{ color: "#F00F43" }}>1.1 k</Text>
              <AntDesign name="filetext1" size={15} color="#F00F43" />
            </View>
            <View
              style={{
                flexDirection: "row",
                padding: 5,
                gap: 5,
                alignItems: "center",
                backgroundColor: "#F9F5E4",
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "#B99C28" }}>طلب</Text>
              <Text style={{ color: "#B99C28" }}>2.3 k</Text>
              <Ionicons name="paper-plane-sharp" size={15} color="#B99C28" />
            </View>
          </View> */}
        </View>
        {/* <Image style={styles.profileImage} source={require("../../assets/userPic.png")} /> */}
        {/* Form */}
        <View style={styles.form}>
          {/* user name */}
          <Text
            style={{
              ...styles.label,
              color: !!errors.username ? "red" : "#515C5D",
            }}
          >
            {!!errors.username ? errors.username : "اسم المستخدم "}
            {!!!errors.username && <Text style={{ color: "red" }}>*</Text>}
          </Text>
          {/* <Text style={styles.label}>اسم المستخدم</Text> */}
          <View style={{ ...styles.field }}>
            <AntDesign
              name="user"
              size={20}
              color="#515C5D"
              style={{ left: 10 }}
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setUsername(text);
                setErrors({
                  ...errors,
                  username: "",
                });
              }}
              value={username}
            />
          </View>
          {/* phone number */}
          <Text
            style={{
              ...styles.label,
              color: !!errors.mobileNum ? "red" : "#515C5D",
            }}
          >
            {!!errors.mobileNum ? errors.mobileNum : "رقم الهاتف "}
            {!!!errors.mobileNum && <Text style={{ color: "red" }}>*</Text>}
          </Text>
          <View
            style={{
              ...styles.field,
              justifyContent: "space-between",
            }}
          >
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={mobileNum}
              onChangeText={(text) => {
                setMobileNum(text);
                setErrors({
                  ...errors,
                  mobileNum: "",
                });
              }}
              maxLength={9}
            />
            <View style={styles.secondInput}>
              <View
                style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
              >
                <Image
                  source={require("../../assets/saudi.png")}
                  style={{ width: 43, height: 30, borderRadius: 5 }}
                />
                <Text>966</Text>
              </View>
            </View>
          </View>
          {/* <Text style={styles.label}>المدينة</Text> */}
          <Text
            style={{
              ...styles.label,
              color: !!errors.city ? "red" : "#515C5D",
            }}
          >
            {!!errors.city ? errors.city : "المدينة "}
            {!!!errors.city && <Text style={{ color: "red" }}>*</Text>}
          </Text>
          <View
            style={{
              ...styles.field,
              justifyContent: "space-between",
              paddingRight: 30,
              position: "relative",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                gap: 10,
                right: 10,
              }}
            >
              <EvilIcons name="location" size={24} color="#515C5D" />
              <Text
                style={{
                  color: "#515C5D",
                }}
              >
                {city ? city : "المدينة"}
              </Text>
            </View>
            <Dropdown
              label="Select Item"
              data={states}
              value={city}
              onSelect={(value) => {
                setCity(value);
                setErrors({
                  ...errors,
                  city: "",
                });
              }}
            />
          </View>
        </View>
      </View>
      {/* Golden Button */}
      <TouchableOpacity
        style={{
          padding: 16,
          backgroundColor: "#B99C28",
          borderRadius: 10,
          marginTop: 45,
          marginHorizontal: 20,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
        onPress={submitHandler}
      >
        {isLoading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <Text style={{ color: "white", textAlign: "center" }}>حفظ التغييرات</Text>
        )}
        {/* <Text style={{ color: "white", textAlign: "center" }}>تتعديل</Text> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingLeft: 20
  },
  input: {
    width: "100%",
    textAlign: "right",
    color: "#515C5D",
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  field: {
    position: "relative",
    width: "90%",
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderRadius: 11,
    borderWidth: 1,
    marginBottom: 20,
    marginRight: 3,
    paddingLeft: 20,
    gap: 10,
    height: 50,
    color: "#515C5D",
  },
  form: {
    marginTop: 9,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
  },
  label: {
    width: "100%",
    textAlign: "right",
    marginBottom: 5,
    color: "#515C5D",
    paddingRight: 24,
  },
  secondInput: {
    right: 115,
    paddingVertical: 9.2,
    paddingLeft: 16,
    paddingRight: 16,
    borderTopLeftRadius: 11,
    borderBottomLeftRadius: 11,
    backgroundColor: "#F2F2F2",
  },
});
