import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator
} from "react-native";
import styles from "./RegistrationPageStyles";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Dropdown from "../components/Dropdown";
import { RadioButton } from "react-native-paper";
import { auth } from "./firebase";
import { } from "../api/database";
import { getUserWithPhoneAndUser } from "../api/database";


export const states = [
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

function Register({ navigation }) {
  const [username, setUsername] = useState("");
  const [mobileNum, setMobileNum] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    mobileNum: "",
    city: "",
    gender: "",
  });

  const genderOptions = [
    {
      label: "ذكر",
      value: "Male",
    },
    {
      label: "أنثى",
      value: "Female",
    },
  ];



  const signUpHandler = async () => {
    // check if user exist
    const fetchUserResult = await getUserWithPhoneAndUser(mobileNum, username);
    console.log(`fetchUserResult`, fetchUserResult)


    if (fetchUserResult.success && fetchUserResult.found) {
      setErrors({
        ...errors,
        mobileNum: fetchUserResult?.errors.phone ? fetchUserResult.errors.phone : "",
        username: fetchUserResult?.errors.username ? fetchUserResult.errors.username : "",
      })
    } else if (fetchUserResult.success && !fetchUserResult.found) {
      navigateToOtp();
      setUsername("");
      setMobileNum("");
      setCity("");
      setGender("");
    }

  }

  const submitHandler = async () => {
    let isValid = true;
    const newErrors = {};
    setIsLoading(true);
    try {
      if (!username) {
        newErrors.username = 'اسم المستخدم مطلوب *';
        isValid = false;
      } else if (!/[a-zA-Z]/.test(username)) { // Check if username has letters
        newErrors.username = "اسم المستخدم يجب ان يحتوي حروف ";
        isValid = false;
      }
  
      if (!mobileNum) {
        newErrors.mobileNum = 'رقم الهاتف مطلوب*';
        isValid = false;
      } else if (mobileNum.length !== 9) {
        newErrors.mobileNum = "رقم الهاتف يجب ان يحتوي على 9 ارقام";
        isValid = false;
      }
  
      if (!city) {
        newErrors.city = 'المدينة مطلوبة*';
        isValid = false;
      }
  
      if (!gender) {
        newErrors.gender = 'الجنس مطلوب*';
        isValid = false;
      }
  
      // If there are any errors, update the state
      if (!isValid) {
        setErrors(newErrors);
        return; // Exit the function early
      }
  
      // If all validations pass, proceed with signUpHandler
      await signUpHandler();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const navigateToOtp = async () => {
    const userData = {
      id: 12385,
      username,
      mobileNum,
      city,
      gender,
      token : "FCM Tempory token",
      isNotification: true,
    }


    navigation.navigate("OTPVerification", {
      isLogin: false,
      data: userData,
    });
  };
  // const validatePassword = (password) => {
  //   const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  //   const capitalLetter = /[A-Z]/
  //   return specialCharacters.test(password) && capitalLetter.test(password)
  // }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* logo */}
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Text style={styles.header}>إنشاء حساب جديد</Text>
      <View style={styles.form}>
        {/* Username */}
        <Text
          style={{
            ...styles.label,
            color: !!errors.username ? "red" : "#515C5D",
          }}
        >
          {!!errors.username ? errors.username : "اسم المستخدم "}
          {!!!errors.username && <Text style={{ color: "red" }}>*</Text>}
        </Text>
        <View
          style={{
            ...styles.field,
            borderColor: !!errors.username ? "red" : "#ccc",
          }}
        >
          <AntDesign name="user" size={20} color="#515C5D" />
          <TextInput
            style={styles.input}
            placeholder="اسم المستخدم"
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

        {/* Phone Number */}
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
            borderColor: errors.mobileNum ? "red" : "#ccc",
          }}
        >
          <TextInput
            style={styles.input}
            placeholder="5********"
            onChangeText={(text) => {
              setMobileNum(text);
              setErrors({
                ...errors,
                mobileNum: "",
              });
            }}
            value={mobileNum}
            keyboardType="numeric"
            maxLength={9}
          />

          <View style={styles.endEndorment}>
            {/* <Image
              style={{
                width: 35,
                height: 25,
                objectFit: 'contain',
                borderRadius: 3,
              }}
              source={require('../assets/saudi.png')}
            /> */}
            <Text>966</Text>
          </View>
        </View>

        {/* Password */}
        {/* <Text
          style={{ ...styles.label, color: !!errors.password ? 'red' : '#515C5D' }}
        >
          {!!errors.password ? errors.password : 'كلمة المرور '}
          {!!!errors.password && <Text style={{ color: 'red' }}>*</Text>}
        </Text>
        <View
          style={{
            ...styles.field,
            justifyContent: 'space-between',
            paddingRight: 30,
            borderColor: errors.password ? 'red' : '#ccc',
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <EvilIcons
              name='lock'
              size={24}
              color='#515C5D'
              style={{ marginTop: 2 }}
            />
            <TextInput
              style={styles.input}
              placeholder='أدخل كلمة المرور'
              onChangeText={(text) => {
                setPassword(text)
                setErrors({
                  ...errors,
                  password: '',
                })
              }}
              value={password}
              secureTextEntry={!showPassword}
            />
          </View>
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            {showPassword ? (
              <Ionicons name='eye-off-outline' size={24} color='#515C5D' />
            ) : (
              <Ionicons name='md-eye-outline' size={24} color='#515C5D' />
            )}
          </TouchableOpacity>
        </View> */}

        {/* City */}
        <Text
          style={{ ...styles.label, color: !!errors.city ? "red" : "#515C5D" }}
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
            borderColor: errors.city ? "red" : "#ccc",
          }}
        >
          <View
            style={{ display: "flex", flexDirection: "row-reverse", gap: 10 }}
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
            onSelect={(value) => {
              setCity(value);
              setErrors({
                ...errors,
                city: "",
              });
            }}
          />
        </View>

        {/* Gender */}
        <Text
          style={{
            ...styles.label,
            color: !!errors.gender ? "red" : "#515C5D",
          }}
        >
          {!!errors.gender ? errors.gender : "الجنس "}
          {!!!errors.gender && <Text style={{ color: "red" }}>*</Text>}
        </Text>
        <View style={styles.radioGroup}>
          {genderOptions.map(({ label, value, Icon }, index) => (
            <View
              key={index}
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: 10,
              }}
            >
              <RadioButton.Android
                key={index}
                value={value}
                status={gender === value ? "checked" : "unchecked"}
                onPress={() => {
                  setGender(value);
                  setErrors({
                    ...errors,
                    gender: "",
                  });
                }}
                color="#B99C28"
                uncheckedColor="light#515C5D"
              // thin border
              />
              {Icon}
              <Text
                style={{
                  fontSize: 16,
                  color: "#515C5D",
                }}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
      {/* <Text
        style={{
          textAlign: 'center',
          color: '#515C5D',
          marginBottom: 40,
        }}
      >
        بالضغط على تسجيل الحساب، فإنك توافق على شروط وسياسة الخصوصية الخاصة
        بتطبيق أكرمها
      </Text> */}
      <TouchableOpacity
        style={{
          backgroundColor: "#B99C28",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
        }}
        onPress={submitHandler}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (<Text style={{ color: "white", textAlign: "center" }}>إنشاء حساب </Text>)}
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          padding: 20,
          borderColor: "#B99C28",
          borderWidth: 2,
          borderRadius: 10,
          marginBottom: 20,
        }}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={{ color: "#B99C28", textAlign: "center" }}>
          تسجيل دخول
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default Register;
