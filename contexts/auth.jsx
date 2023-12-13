import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
// import messaging from "@react-native-firebase/messaging";
// import { PermissionsAndroid } from "react-native";
// import { updateDoc, doc } from "firebase/firestore";
// import { db } from "../components/firebase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  //   return enabled;
  // };

  // const getFCMToken = async (userData) => {
  //   if (Platform.OS === "ios") {
  //     if (requestUserPermission()) {
  //       messaging().getToken().then(async token => {
  //         const docRef = doc(db, "users", userData.id);
  //         await updateDoc(docRef, { token: token });
  //       }).catch(err => {
  //         console.log("FCM IOS token err: ", err);
  //       });
  //     }
  //     else {
  //       console.log("Notification Permission Denied.")
  //     }
  //   }
  //   else {
  //     PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  //     messaging().getToken().then(async token => {
  //       const docRef = doc(db, "users", userData.id);
  //       await updateDoc(docRef, { token: token });
  //     }).catch(err => {
  //       console.log("FCM android token err: ", err);
  //     });
  //   }
  // }

  async function signIn(user) {
    if (user) {
      // await getFCMToken(user)
    }
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("userId", user?.id);
    setUser(user);
  }

  async function signOut() {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userId");
    setUser(null);
    navigation.navigate("Login");
  }

  async function updateUser(user) {
    console.log("runs?");
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
