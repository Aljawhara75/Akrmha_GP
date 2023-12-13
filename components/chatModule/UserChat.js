import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import {
  getAllUser,
  getChatRoom,
  getUserChat,
  getUserByName,
} from "../../api/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userPic from "../../assets/userPic.png";
import female from "../../assets/female.png";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const UserChat = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [lastMessage, setLastMessage] = useState([]);
  const [unReadMessage, setUnReadMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  const getAllUsers = async () => {
    setIsLoading(true);
    const userId = await AsyncStorage.getItem("userId");
    const users = await getAllUser();
    if (users.success && users.found) {
      const data = users?.data.filter((value) => value?.id !== userId);
      const current = users?.data.find((value) => value?.id === userId);
      setCurrentUser(current);
      setUsers(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllUsers();
  }, [isFocused]);

  useEffect(() => {
    const getChat = async () => {
      if (users.length > 0) {
        const lastMes = await Promise.all(
          users.map(async (user) => {
            const chatRoomId = await getChatRoom(
              [user.id, currentUser.id].sort().join()
            );
            if (chatRoomId?.found && chatRoomId?.success) {
              const chat = await getUserChat(chatRoomId.data?.id);
              if (chat.success && chat.found) {
                const messages = chat.data;
                messages.sort(
                  (a, b) =>
                    new Date(b.createdAt.toDate()) -
                    new Date(a.createdAt.toDate())
                );
                if (chat) {
                  const temp = {
                    userInfo: user,
                    message: messages[0].text
                      ? messages[0].text.slice(0, 20)
                      : messages[0].image
                      ? "رسالة الصورة"
                      : messages[0].audio
                      ? "رسالة صوتية"
                      : messages[0]?.coords
                      ? "رسالة الموقع"
                      : "",
                    chatRoomId: chatRoomId?.data?.id,
                    user: chatRoomId?.data?.user,
                    createdAt: messages[0]?.createdAt.toDate(),
                    read: messages[0].read,
                    messageSenderId: messages[0]?.user?._id,
                  };
                  return temp;
                }
              }
            }
          })
        );
        const filterUser = lastMes
          .filter((item) => item !== undefined)
          .sort((a, b) => b.createdAt - a.createdAt);
        const unRead = filterUser.filter(
          (message) =>
            !message?.read && currentUser?.id !== message?.messageSenderId
        );
        setUnReadMessage(unRead);
        setLastMessage(filterUser);
      }
    };
    getChat();
  }, [users, isFocused]);

  return (
    <ScrollView>
      <Spinner visible={isLoading} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.heading}>الرسائل</Text>
          <Text style={styles.description}>
            لديك {unReadMessage?.length} رسالة غير مقروءة
          </Text>
        </View>

        {lastMessage.length > 0 ? (
          lastMessage?.map((message, index) => {
            const timeAgo = moment(message?.createdAt).fromNow();
            return (
              <TouchableOpacity
                key={message?.userInfo?.id}
                style={{
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  marginTop: 20,
                  marginHorizontal: 20,
                }}
                onPress={() =>
                  navigation.navigate("userChat", {
                    user: message?.userInfo,
                    currentUserId: currentUser?.id,
                  })
                }
              >
                <View style={styles.flexBar}>
                  <ImageBackground
                    style={styles.userImg}
                    resizeMode="cover"
                    imageStyle={{ borderRadius: 40, width: 51, height: 51 }}
                    source={
                      message?.userInfo?.gender === "Male" ? userPic : female
                    }
                  >
                    {!message?.read &&
                      currentUser?.id !== message?.messageSenderId && (
                        <View
                          style={{
                            position: "absolute",
                            top: -10,
                            right: 0,
                          }}
                        >
                          <FontAwesome
                            name="circle"
                            size={24}
                            color="#84c857"
                          />
                        </View>
                      )}
                  </ImageBackground>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.userName}>
                      {message?.userInfo?.username}
                    </Text>
                    <Text style={styles.userNum}>{message?.message}...</Text>
                  </View>
                </View>
                <View>
                  <Text>{timeAgo}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <TouchableOpacity
            style={{
              marginTop: 20,
              marginHorizontal: 20,
            }}
          >
            <View style={styles.flexBar}>
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              لا يوجد رسائل حتى الآن
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7F9FC",
    flex: 1,
  },
  textContainer: {
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  heading: {
    textAlign: "right",
    fontSize: 34,
    fontWeight: "900",
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

export default UserChat;
