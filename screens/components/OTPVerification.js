import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator,
   KeyboardAvoidingView, Platform
} from "react-native";
import styles from "./RegistrationPageStyles";
import { auth, db } from "./firebase";
import AuthContext from "../contexts/auth";
import { checkVerification, checkVerificationMock } from "../api/verify";
import { getUser, getUserWithPhoneAndUser } from "../api/database";
import { addDoc, collection } from "firebase/firestore";

function OTPVerification({ navigation, route }) {
  const { signIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState({ verificationCode: "" });

  const isLogin = route.params.isLogin;
  console.log(`isLogin`, isLogin);
  const data = route.params.data;
  console.log(`data`, data);

  const handleVerifyCode = async () => {
    setIsLoading(true);
    try {
      const userData = {
        username: data.username,
        mobileNum: data.mobileNum,
        city: data.city,
        gender: data.gender,
      };

      // check if verification code is correct
      const numWithKey = "+966" + userData.mobileNum
      const verficationResult = await checkVerificationMock( //here i can switch the mode
        numWithKey,
        verificationCode
      );

      if (!verficationResult) {
        setErrors({ verificationCode: "رمز التحقق غير صحيح" });
        setIsLoading(false);
        return;
      }

      // if login
      if (isLogin && verficationResult) {
        console.log(`isLogin`, isLogin);
        // if correct, set isLogin to true and store user data
        signIn(userData);
      }
      // if register
      if (!isLogin && verficationResult) {
        await addDoc(collection(db, "users"), userData);
        // if add data to database, set isLogin to true and store user data
        signIn(userData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <Image style={styles.logo} source={require("../assets/logo.png")} />
          <Text style={styles.header}>تحقق من رمز التحقق</Text>
          <View style={styles.form}>
            <Text
              style={{
                ...styles.label,
                color: !!errors.verificationCode ? "red" : "#515C5D",
              }}
            >
              {!!errors.verificationCode ? errors.verificationCode : "رمز التحقق"}
              {!!!errors.verificationCode && (
                <Text style={{ color: "red" }}>*</Text>
              )}
            </Text>
            <View
              style={{
                ...styles.field,
                borderColor: !!errors.verificationCode ? "red" : "#ccc",
              }}
            >
              <TextInput
                style={styles.input}
                placeholder="رمز التحقق"
                onChangeText={(text) => {
                  setVerificationCode(text);
                  setErrors({ verificationCode: "" });
                }}
                value={verificationCode}
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>
  
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: errors.verificationCode ? "gray" : "#B99C28",
              padding: 20,
              borderRadius: 10,
              marginBottom: 20,
            }}
            onPress={handleVerifyCode}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", textAlign: "center" }}>تحقق</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
  
}

export default OTPVerification;