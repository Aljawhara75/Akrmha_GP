import React, { useEffect, useRef, useState } from "react";
import userPic from "../../assets/userPic.png";
import female from "../../assets/female.png"
import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { addDoc, updateDoc, doc, deleteDoc, collection } from "firebase/firestore";
import { AirbnbRating } from 'react-native-ratings';
import { db } from "../firebase";
import { getFoodDetails, getUserById } from "../../api/database";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ratingCount } from "../../utils/ratingCount";
import RBSheet from "react-native-raw-bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { getRatingByOrderId } from "../../api/database";
// import { sendNotification } from "../../api/notification";
import Spinner from "react-native-loading-spinner-overlay";
import { Alert } from "react-native";


export default function CustomerList({ customer, setStateUpdate, ownerName, index }) {
    const [customerInfo, setCustomerInfo] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [currentRating, setCurrentRating] = useState(0);
    const [existingUserRating, setExistingUserRating] = useState(null);
    const [existingOwnerRating, setExisitngOwnerRating] = useState({
        rating: 0,
        total: 0,
    });
    const [existingRating, setExistingRating] = useState({
        rating: 0,
        total: 0,
    })
    const navigation = useNavigation();

    const handleAcceptOrder = async (id, quantity, foodId) => {
        try {

            const foodData = await getFoodDetails(foodId);
            if (foodData.found && foodData.success) {
                if (foodData.data.quantity >= quantity) {
                    const updatedData = {
                        orderState: "مقبول",
                        date: new Date(),
                    };
                    const docRef = doc(db, "OrderFood", id);
                    await updateDoc(docRef, updatedData);

                    const foodRef = doc(db, "AddFood", foodData?.data?.id);
                    await updateDoc(foodRef, { quantity: foodData?.data?.quantity - quantity })
                } else {
                    Alert.alert("كمية طعامك أقل من كمية الطلب");
                }

                // await sendNotification(customerInfo?.token, "قبول الطلب", `قبل ${ownerName?.username} طلبك لل ${foodData.data.title}`, customerInfo?.isNotification)

            }

            setStateUpdate(id);
        } catch (error) {

            console.error("Error updating document:", error);
        }
    };

    useEffect(() => {
        const userInfo = async () => {
            if (customer) {
                const userData = await getUserById(customer?.customerUserId);
                if (userData?.found && userData?.success) {
                    setCustomerInfo(userData?.data)
                }

                const rating = await ratingCount(customer?.customerUserId);
                if (rating) {
                    setExistingRating(rating)
                }
            }
        }
        userInfo()

    }, [customer]);

    useEffect(() => {
        const userInfo = async () => {
            const userId = await AsyncStorage.getItem("userId");
            const userData = await getUserById(userId);
            if (userData?.found && userData?.success) {
                setCurrentUser(userData?.data);
            }
        }
        userInfo()

    }, [customer]);

    const handleRating = async () => {
        setIsLoading(true);
        const payload = {
            id: 123,
            ratingAccepterId: customerInfo.id,
            ratingGiverId: customer?.ownerUserId,
            orderId: customer?.orderId,
            rating: currentRating,
        };
        const res = await addDoc(collection(db, "UserRating"), payload);
        const docRef = doc(db, "UserRating", res._key.path.segments[1]);
        await updateDoc(docRef, { id: res._key.path.segments[1] });
        if (customer) {
            const data = await getRatingByOrderId(customer?.orderId, ownerName?.id);
            if (data?.found && data?.success) {
                setExistingUserRating(data?.data)
            }
        }
        if (customer) {
            const ownerRating = await ratingCount(customer.ownerUserId);
            if (ownerRating) {
                setExisitngOwnerRating(ownerRating);
            }
        }
        const updatedFoodData = await getFoodDetails(customer?.foodId);

        if (updatedFoodData.found && updatedFoodData.success) {
            if (updatedFoodData.data.quantity === 0) {
                await deleteDoc(doc(db, "AddFood", updatedFoodData?.data?.id));
                navigation.goBack();
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        const getRating = async () => {
            if (customer && ownerName.id) {
                const data = await getRatingByOrderId(customer?.orderId, ownerName.id);
                if (data?.found && data?.success) {
                    setExistingUserRating({ ...data?.data });
                }
            }
        }
        getRating();
    }, [customer, ownerName])

    useEffect(() => {
        const getOwnerRating = async () => {
            if (customerInfo) {
                const ownerRating = await ratingCount(customerInfo.id);
                if (ownerRating) {
                    setExisitngOwnerRating(ownerRating);
                }
            }
        }
        getOwnerRating();
    }, [customerInfo]);

    const rbSheetRating = useRef()

    return (
        <View>
            <Spinner visible={isLoading} />
            <View style={styles.container} key={customer?.orderId}>
                <View style={styles.flexBar}>
                    <TouchableOpacity style={styles.btnStyle1}
                        onPress={() => navigation.navigate("userChat", { user: customerInfo, currentUserId: currentUser?.id })}
                    >
                        <Text style={styles.btnText}>مراسلة</Text>
                    </TouchableOpacity>
                    {
                        customer?.orderState === "pending" ?
                            <TouchableOpacity style={styles.btnStyle2} onPress={() => handleAcceptOrder(customer?.orderId, customer?.quantity, customer?.foodId)}>
                                <Text style={{ color: "#637f74" }} >
                                    {""}قبول الكمية: {customer?.quantity}
                                </Text>
                            </TouchableOpacity> :
                            <TouchableOpacity disabled={existingUserRating ? true : false} style={{
                                backgroundColor: `${existingUserRating ? "#d9d9d9" : "#B99C28"}`,
                                borderRadius: 8,
                                alignItems: "center",
                                justifyContent: "center",
                                paddingVertical: 8,
                                paddingHorizontal: 20,
                                marginRight: 5,
                            }} onPress={() => {
                                rbSheetRating.current.open();
                            }}>
                                <Text style={styles.btnText} >
                                    تم الاستلام
                                </Text>
                            </TouchableOpacity>
                    }
                </View>
                <View style={{ ...styles.flexBar }}>
                    <View style={{ alignItems: "flex-end", paddingBottom: 10 }}>
                        <Text style={styles.orderName}>{customerInfo?.username}</Text>

                        <View style={{ marginTop: 0 }}>
                            <AirbnbRating
                                size={10}
                                ratingContainerStyle={{ height: 10, padding: 0, margin: 0 }}
                                isDisabled={true}
                                defaultRating={existingRating?.rating}
                                starContainerStyle={{ paddingBottom: 8 }}
                            />
                            <Text style={{ marginTop: 7 }}>{existingRating?.total} تقييم </Text>
                        </View>
                    </View>
                    <Image
                        style={styles.imgStyle}
                        source={customerInfo?.gender === "Male" ? userPic : female}
                    />
                </View>
            </View>

            <RBSheet
                key={index}
                ref={rbSheetRating}
                height={430}
                openDuration={250}
                customStyles={{
                    container: {
                        justifyContent: "center",
                        padding: 10,
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20,
                        backgroundColor: "#F7F9FC"
                    },
                }}
            >
                <ScrollView>
                    <View style={{ padding: 5 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                            <TouchableOpacity>
                                <Ionicons
                                    name="close-circle-outline"
                                    size={30}
                                    onPress={() => {
                                        rbSheetRating.current.close();
                                    }}
                                    style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                            <Text style={{ fontWeight: 600, fontSize: 15 }}>تقييم التجربة مع  {customerInfo?.username}</Text>
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: 18, marginTop: 15, borderRadius: 10 }}>
                            <View>
                                {/* <AntDesign name="left" size={24} color="black" /> */}
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                                <View style={{ gap: 4 }}>
                                    <Text style={styles.dishName}>{customerInfo.username}</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text>{" "}{existingOwnerRating?.total} تقييم</Text>
                                        <AirbnbRating showRating={false} size={17} isDisabled={true} defaultRating={existingOwnerRating?.rating} />
                                    </View>
                                </View>
                                <View style={styles.lunchImgContainer}>
                                    <Image style={{ width: 45, height: 45 }} source={customerInfo?.gender === "Male" ? userPic : female} />
                                </View>
                            </View>
                        </View>
                        {
                            !existingUserRating ? <View style={{ display: "flex", gap: 20, flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 25 }}>
                                <View>
                                    <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 800 }}> كيف كانت التجربة مع {customerInfo?.username}</Text>
                                </View>
                                <View>
                                    <Text style={{ textAlign: "center" }}>نطلب منك تخصيص بعض الوقت لتقييم التجربة مع {customerInfo.username}، فهذا سيساعدنا في التحكم بجودة الخدمة في أفضل حالاتها</Text>
                                </View>
                                <View>
                                    <AirbnbRating defaultRating={0} showRating={false} size={25} onFinishRating={(rating) => setCurrentRating(rating)} />
                                    <Text style={{ textAlign: "center" }}>{currentRating} من 5</Text>
                                </View>
                                <TouchableOpacity disabled={currentRating === 0 ? true : false}
                                    style={
                                        currentRating === 0 ?
                                            {
                                                width: "95%",
                                                paddingVertical: 18,
                                                borderRadius: 10,
                                                backgroundColor: "gray"
                                            } :
                                            {
                                                width: "95%",
                                                backgroundColor: "#B99C28",
                                                paddingVertical: 18,
                                                borderRadius: 10
                                            }
                                    }
                                    onPress={handleRating}
                                >
                                    <Text style={{ textAlign: "center", color: "white" }}>تقييم</Text>
                                </TouchableOpacity>
                            </View> :
                                <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 10 }}>
                                    <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <AirbnbRating showRating={false} size={25} isDisabled={true} defaultRating={existingUserRating?.rating} />
                                        <Text>{existingUserRating?.rating} من 5</Text>
                                    </View>
                                    <View style={{ gap: 20 }}>
                                        <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 800, }}>شكرا على وقتك، هذا عظيم!</Text>
                                        <Text style={{ textAlign: "center" }}>يسعدنا في أكرمها أنك حظيت بتجربة فريدة من نوعها. نتمنى لكم تحقيق المزيد من المشاركة المتميزة.</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            width: "95%",
                                            backgroundColor: "#B99C28",
                                            paddingVertical: 18,
                                            borderRadius: 10,
                                            marginTop: 10
                                        }}
                                        onPress={() => {
                                            rbSheetRating.current.close();
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: "Tabs" }],
                                            })
                                        }}
                                    >
                                        <Text style={{ textAlign: "center", color: "white" }}>الرئيسية</Text>
                                    </TouchableOpacity>
                                </View>
                        }

                    </View>
                </ScrollView>
            </RBSheet>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 5,
        paddingLeft: 5,
        borderRadius: 14,
        backgroundColor: "white",
        marginTop: 5
    },
    flexBar: {
        flexDirection: "row",
        alignItems: "center",
    },
    btnStyle1: {
        backgroundColor: "#B99C28",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginRight: 5,
    },
    btnStyle2: {
        backgroundColor: "#c0efb3",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginRight: 5,
    },
    btnText: {
        color: "white",
    },
    orderName: {
        textAlign: "right",
        paddingRight: 5,
    },
    imgStyle: {
        height: 40,
        width: 40,
        borderRadius: 40,
        borderColor: "#D4B745",
        borderWidth: 2,
        marginLeft: 10
    }
});
