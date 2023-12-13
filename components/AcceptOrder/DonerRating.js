import React, { useEffect, useState } from "react";
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

const DonerRating = ({ customerInfo, ownerName, currentRating, existingUserRating, existingOwnerRating, handleRatingRBSheet, handleRating, setCurrentRating }) => {
    // console.log("customer: : ", customerInfo.username);

    const navigation = useNavigation();

    const handleOpenRBSheet = () => {
      console.log({customerInfo})
        this.RatingRBSheet.open()
    }

    return (
        <> 
          <TouchableOpacity onPress={() => handleRatingRBSheet(handleOpenRBSheet)}>
          <Text>   Open RB Sheet</Text>
          </TouchableOpacity>
            <RBSheet
                ref={(ref) => {
                    this.RatingRBSheet = ref;
                }}
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
                {/* <ScrollView> */}
                <View style={{ padding: 5 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                        <TouchableOpacity>
                            <Ionicons
                                name="close-circle-outline"
                                size={30}
                                onPress={() => this.RatingRBSheet.close()}
                                style={styles.closeIcon}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontWeight: 600, fontSize: 15 }}>تقييم التجربة مع  {customerInfo.username}</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: 18, marginTop: 15, borderRadius: 10 }}>
                        <View>
                            <AntDesign name="left" size={24} color="black" />
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
                                <Text style={{ textAlign: "center" }}>نطلب منك تخصيص بعض الوقت لتقييم التجربة مع {customerInfo?.username}، فهذا سيساعدنا في التحكم بجودة الخدمة في أفضل حالاتها</Text>
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
                                        this.RatingRBSheet.close();
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
                {/* </ScrollView> */}
            </RBSheet>
        </>
    )
}

export default DonerRating;



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
