import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform
} from "react-native";
import styles from "./RegistrationPageStyles"; // Make sure to replace this with your actual path
import { getUser } from "../api/database"; // Make sure to replace this with your actual path
import { sendSmsVerificationMock } from "../api/verify"; // Make sure to replace this with your actual path
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function Login({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState({ phoneNumber: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const fetchUserResult = await getUser(phoneNumber);
      if (fetchUserResult.success && fetchUserResult.found) {
        const numWithKey= "+966"+phoneNumber
        const sendCodeResult = await sendSmsVerificationMock(numWithKey);
        if (sendCodeResult) {
          navigation.navigate("OTPVerification", {
            isLogin: true,
            data: fetchUserResult.data,
          });
        }
      } else if (fetchUserResult.success && !fetchUserResult.found) {
        Alert.alert(
          "الرجاء إنشاء حساب",
          "الرقم الذي ادخلته غير مرتبط بحساب بعد!",
          [
            {
              text: "إلغاء",
              onPress: () => console.log("OK Pressed"),
              style: "cancel",
            },
            {
              text: "إنشاء حساب",
              onPress: () => navigation.navigate("Register"),
              style: "default",
            },
          ]
        );
      }
      if (phoneNumber.length !== 9 && phoneNumber.length < 9) {
        newErrors.phoneNumber = "رقم الهاتف يجب ان يحتوي على 9 ارقام";
        isValid = false;
      }
    } catch (error) {
      setError({ phoneNumber: "خطأ في تسجيل الدخول" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      enabled
    >
      <View style={{ flex: 1, backgroundColor: 'white' }}> 
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps='handled'
        >
          <Image style={styles.logo} source={require("../assets/logo.png")} /> 
          <Text style={styles.header}>تسجيل الدخول</Text>
  
          <View style={styles.form}>
            <Text
              style={{
                ...styles.label,
                color: !!error.phoneNumber ? "red" : "#515C5D",
              }}
            >
              {!!error.phoneNumber ? error.phoneNumber : "رقم الهاتف"}
              {!!!error.phoneNumber && <Text style={{ color: "red" }}>*</Text>}
            </Text>
            <View
              style={{
                ...styles.field,
                justifyContent: "space-between",
                borderColor: error.phoneNumber ? "red" : "#ccc",
              }}
            >
              <TextInput
                style={styles.input}
                placeholder="5****"
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setError({ ...error, phoneNumber: "" });
                }}
                value={phoneNumber}
                keyboardType="numeric"
                maxLength={9}
              />
              <View style={styles.endEndorment}>
                <Text>966</Text>
              </View>
            </View>
          </View>
        </ScrollView>
  
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: error.phoneNumber ? "gray" : "#B99C28",
              padding: 20,
              borderRadius: 10,
              marginBottom: 20,
            }}
            onPress={handleLogin}
            disabled={!!error.phoneNumber || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", textAlign: "center" }}>
                تسجيل الدخول
              </Text>
            )}
          </TouchableOpacity>
  
          <TouchableOpacity
            style={{
              padding: 20,
              borderColor: "#B99C28",
              borderWidth: 2,
              borderRadius: 10,
              marginBottom: 20,
            }}
            onPress={() => navigation.navigate("Register")}
            disabled={isLoading}
          >
            <Text style={{ color: "#B99C28", textAlign: "center" }}>
              إنشاء حساب جديد
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
  
}

export default Login;