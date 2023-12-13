import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, SafeAreaView, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "react-native-loading-spinner-overlay";
// import { sendNotification } from "../../api/notification";
import { getUserById } from "../../api/database";

export default function FilledBtn({ title, foodData, region, otherRegion, quantity, distance, RBSheet }) {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({});
  const [ownerInfo, setOwnerInfo] = useState({});
  
  const handleSubmit = async () => {
    setLoading(true)
    const customerUserId = await AsyncStorage.getItem("userId");
    const payload = {
      orderId: Math.floor(Math.random() * (5000 - 1 + 1)) + 1,
      customerUserId,
      foodType: foodData?.foodType,
      title: foodData?.title,
      foodId: foodData?.id,
      image: foodData?.image,
      ownerUserId: foodData?.userId,
      ownerPointX: foodData?.pointX,
      ownerPointY: foodData?.pointY,
      pointX: region?.latitude,
      pointY: region?.longitude,
      quantity: quantity,
      orderState: "pending",
      date : new Date(),
      type : foodData?.type
    }
    try {
      let res = await addDoc(collection(db, "OrderFood"), payload);
      const docRef = doc(db, "OrderFood", res._key.path.segments[1]);
      await updateDoc(docRef, {orderId: res._key.path.segments[1]});
      setLoading(false)
      await RBSheet();
      // await sendNotification(ownerInfo?.token, "طلب وارد", `قدم ${customerInfo?.username} طلبًا لل ${foodData?.title}`, ownerInfo?.isNotification)
      Alert.alert(
        'شكرًا لك',
        "تم إرسال طلبك بنجاح",
        [
          {
            text: 'موافق',
            onPress: async () => {
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      setLoading(false);
      console.log("Error: ", error)
    }
    setLoading(false)
  }

  useEffect(() => {
         const getCustomerInfo = async() => {
          if(foodData) {
            const userData = await getUserById(foodData?.userId);
            if (userData?.found && userData?.success) {
                setOwnerInfo(userData?.data)
            }
          }
          const customerUserId = await AsyncStorage.getItem("userId");
          if(customerUserId) {
            const userData = await getUserById(customerUserId);
            if (userData?.found && userData?.success) {
                setCustomerInfo(userData?.data)
            }
          }
         }
         getCustomerInfo();
  }, [foodData]);

  return (
    <TouchableOpacity style={styles.btnContainer} onPress={()=> handleSubmit()}>
      <Spinner visible={loading} />
      <Text style={styles.btnText} >{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: '#B99C28',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    textAlign: 'center'
  },
});
