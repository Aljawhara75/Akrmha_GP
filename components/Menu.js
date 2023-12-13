import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import AuthContext from "../contexts/auth";
import Icon from 'react-native-vector-icons/Ionicons';
import UserPic from "../assets/userPic.png";
import female from "../assets/female.png";
import { AirbnbRating } from 'react-native-ratings';
import { ratingCount } from "../utils/ratingCount";
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const Menu = ({ navigation }) => {
    const { user, signOut } = useContext(AuthContext);
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

    return (
        <View style={styles.container}>
            {/* Back Arrow */}
            {/* Profile Section */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 20,
                borderColor: "gray"
            }}>
                <TouchableOpacity style={{ padding: 10, zIndex: 10 }} onPress={() => navigation.navigate('Tabs')}>
                    <Icon name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                    <FontAwesome5 name="user-edit" size={22} color="#b99c28" />
                </TouchableOpacity>
            </View>
            {/* Menu Items */}

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

            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <Text style={{fontWeight: 'bold'}}> اسم المستخدم </Text>
                        {/* <Image
                            style={{ width: 20, height: 20, borderRadius: 30, }}
                            source={user?.gender === 'Male' ? UserPic : female}
                        /> */}
                    </View>
                    <Text style={styles.menuText}> {user?.username}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <Text style={{fontWeight: 'bold'}}> رقم الهاتف</Text>
                        {/* <FontAwesome5 name="phone-square-alt" size={20} color="black" /> */}
                    </View>
                    <Text style={styles.menuText}> {user?.mobileNum}</Text>

                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <Text style={{fontWeight: 'bold'}}> المدينة</Text>
                        {/* <MaterialIcons name="location-city" size={20} color="black" /> */}
                    </View>
                    <Text style={styles.menuText}> {user?.city}</Text>
                </TouchableOpacity>
            </View>
            {/* Sign Out */}
            <View style={{
                marginTop: 'auto',
                alignItems: 'center',
                position: "absolute",
                bottom: 10, right: 10,
                borderTopWidth: 1,
                width: "100%",
                borderColor: "gray"
            }}>
                <TouchableOpacity
                    style={{
                        padding: 20,
                        borderRadius: 10,
                        marginBottom: 20,
                        alignItems: 'center',
                        flexDirection: "row",
                        gap: 10

                    }}
                    onPress={signOut}
                >
                    <Text style={{ color: 'black' }}>تسجيل الخروج</Text>
                    <Ionicons name="log-out-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        position: "relative",
    },
    profileContainer: {
        marginBottom: 20,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 20,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 18,
        bottom: 5,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    menuContainer: {
        marginBottom: 20,
        marginTop: 25,
    },
    menuItem: {
        paddingVertical: 15,
        justifyContent: "flex-end",
        gap: 10,
    },
    menuText: {
        textAlign: 'right',
        fontSize: 15,
        // fontWeight: 'bold',
        marginTop: 5

    },
    backButton: {
        position: 'absolute',
        top: 60, // Adjust the top value to move the arrow down
        left: 20,
        zIndex: 10,
    },
    footer: {
        marginTop: 'auto',
        alignItems: 'center',
    },
});

export default Menu;
