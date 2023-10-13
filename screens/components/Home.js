// import React, { useContext, useState } from "react";
// import { View, StyleSheet, TouchableOpacity } from "react-native";
// // import { SearchBar } from "react-native-elements";
// import { Searchbar, Text } from "react-native-paper";
// import AuthContext from "../contexts/auth";


// const Home = () => {
//   const { user, signOut } = useContext(AuthContext);

//   const [search, setSearch] = useState("");

//   const updateSearch = (search) => {
//     setSearch(search);
//   };

//   return (
//     <View style={styles.container}>
//       <Searchbar
//         placeholder="ابحث عن زوائد الطعام"
//         onChangeText={updateSearch}
//         value={search}
//         containerStyle={styles.searchContainer}
//         inputContainerStyle={styles.searchInputContainer}
//         placeholderTextColor="#515C5D"
//         inputStyle={styles.inputStyle}
//       />

//       {/* user data */}
//       <Text>username: {user?.username}</Text>
//       <Text>mobileNum: {user?.mobileNum}</Text>
//       <Text>city: {user?.city}</Text>
//       <Text>gender: {user?.gender}</Text>

//       <TouchableOpacity
//         style={{
//           backgroundColor: "#B99C28",
//           padding: 20,
//           borderRadius: 10,
//           marginBottom: 20,
//         }}
//         onPress={signOut}
//       >
//         <Text style={{ color: "white", textAlign: "center" }}>
//           تسجيل الخروج
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     marginTop: 50, // Add top margin to move the search bar down
//   },
//   searchContainer: {
//     backgroundColor: "transparent",
//     borderBottomColor: "transparent",
//     borderTopColor: "transparent",
//   },
//   searchInputContainer: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     height: 45,
//     width: "100%",
//     borderColor: "#515C5D", // Border in green
//     borderWidth: 0.5, // Border width
//     borderBottomWidth: 0.5, // Border width
//   },
//   inputStyle: {
//     textAlign: "right",
//     color: "#515C5D",
//     fontSize: 15,
//   },
// });

// export default Home;
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet , Image} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Categ from '../components/Categ';
import CateItems from '../components/CateItems';



function Home({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
            <Image style={styles.user} source={require("../assets/userPic.png")} />
                <Text style={styles.title}></Text>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => {navigation.navigate('Menu')
                    }}
                >
                    <Icon name="menu-outline" size={30} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center'}}>
                <Image style={styles.pic} source={require("../assets/homePic.png")}/>
            </View>

            <View>
                <Text style={styles.title}>التصنيفات</Text>
                <View style={{flex: 3}}>
                    <FlatList>
                    data={Categ}
                    renderItem={({ item }) => <OnboardingItem item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    </FlatList>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 60, // Adjust this value based on your device's status bar height
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',  // Distributes child elements (title and menu icon) across the main axis (in this case, horizontally)
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    menuButton: {
        padding: 10,
        marginBottom: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    user: {
        marginLeft: 10,
        width: 45,
        height: 45,
        marginBottom: 5,
    },
    pic:{
       width: 450,
       height: 250,
    },
    title: {
        flexDirection: "row",
        fontSize: 21,
        fontWeight: 'bold',
        marginLeft: 300,
        marginTop: 22,
        color: '#2C3E50',
    }
});

export default Home;

