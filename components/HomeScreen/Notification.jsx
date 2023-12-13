import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, ScrollView } from "react-native";
import { getUserNotifications } from '../../api/database';
import userPic from "../../assets/userPic.png";
import moment from 'moment';
import female from "../../assets/female.png";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Notification = () => {

    const [userNotification, setUserNotification] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const getNotification = async () => {
            const userId = await AsyncStorage.getItem("userId");
            if (userId) {
                const data = await getUserNotifications(userId);
                if (data.success && data.success) {
                    const sortedData = data.data.sort((a, b) =>
                        new Date(b.createdOn.toDate()) -
                        new Date(a.createdOn.toDate())
                    )
                    setUserNotification(sortedData);
                }
            }
        }
        getNotification();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.textContainer}>
                <TouchableOpacity>
                    <Icon name="arrow-back" size={30} color="black"
                        onPress={() => navigation.goBack()}
                    />
                </TouchableOpacity>
                <Text style={styles.heading}>إشعارات</Text>
            </View>
            {
                userNotification?.length > 0 ? userNotification.map((notification) => {
                    const timeAgo = moment(notification?.createdOn?.toDate()).fromNow();
                    return (
                        <TouchableOpacity
                            key={notification?.id}
                            style={{
                                flexDirection: "row-reverse",
                                justifyContent: "space-between",
                                marginTop: 20,
                                marginHorizontal: 20,
                            }}
                        >
                            <View style={styles.flexBar}>
                                <Image
                                    source={notification.gender === "Male" ? userPic : female}
                                    style={styles.userImg}
                                />
                                <View style={{ alignItems: "flex-end" }}>
                                    <Text style={styles.userName}>
                                        {notification?.title}
                                    </Text>
                                    <Text style={styles.userNum}>{notification?.body}</Text>
                                </View>
                            </View>
                            <View>
                                <Text>{timeAgo}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }) :
                    <TouchableOpacity
                        style={{
                            marginTop: 20,
                            marginHorizontal: 20,
                        }}
                    >
                        <View style={styles.flexBar}>
                            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                                ليس لديك أي إشعارات
                            </Text>
                        </View>
                    </TouchableOpacity>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F7F9FC",
        flex: 1,
    },
    textContainer: {
        backgroundColor: "#F7F9FC",
        paddingHorizontal: 20,
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    heading: {
        textAlign: "right",
        fontSize: 34,
        fontWeight: "800",
    },
    description: {
        color: "#808080",
        fontSize: 15,
        marginTop: 2,
        textAlign: "right",
    },
    userImg: {
        height: 55,
        width: 55,
        marginLeft: 10,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "#D4B745",
    },
    flexBar: {
        flexDirection: "row-reverse",
        alignItems: "center",
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    userNum: {
        color: "#808080",
        paddingTop: 10,
    },
    searchContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "red",
        borderColor: "#B99C28",
        borderWidth: 2,
        borderRadius: 8,
        margin: 10,
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

export default Notification

