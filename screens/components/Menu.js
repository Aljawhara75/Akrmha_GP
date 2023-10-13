import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import AuthContext from "../contexts/auth";
import Icon from 'react-native-vector-icons/Ionicons';

const Menu = ({ navigation }) => {
    const { user, signOut } = useContext(AuthContext);

    return (
        <ScrollView style={styles.container}>
            {/* Back Arrow */}
            <View style={styles.backButton}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Tabs')}
                >
                    <Icon name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
            </View>
            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <Image style={styles.profileImage} source={{ uri: 'YOUR_PROFILE_IMAGE_URL_HERE' }} />
                <Text style={styles.profileName}><Text> {user?.username}</Text></Text>
            </View>
            {/* Menu Items */}
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Tabs')}>
                    <Text style={styles.menuText}>الرئيسية</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>حسابي</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>حول اكرمها</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>اتصل بنا</Text>
                </TouchableOpacity>
            </View>
            {/* Sign Out */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#B99C28',
                        padding: 20,
                        borderRadius: 10,
                        marginBottom: 20,
                        alignItems: 'center',
                    }}
                    onPress={signOut}
                >
                    <Text style={{ color: "white" }}>تسجيل الخروج</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 15,
    },
    profileContainer: {
        marginBottom: 20,
        alignItems: 'flex-end',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 18,
        bottom :5,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    menuContainer: {
        marginBottom: 20,
    },
    menuItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        alignItems: 'flex-end',
    },
    menuText: {
        textAlign: 'right',
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
