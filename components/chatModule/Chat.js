import {
  GiftedChat,
  Bubble,
  LeftAction,
  ChatInput,
  SendButton,
  InputToolbar,
  Send,
  Time,
} from "react-native-gifted-chat";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  Linking,
} from "react-native";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { getChatRoom, getUserById, getUserChat } from "../../api/database";
import Spinner from "react-native-loading-spinner-overlay";
import ChatHeader from "./ChatHeader.js";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { uploadBytes, ref } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { Alert } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import VoiceRecording from "./VoiceRecording";
import Feather from "@expo/vector-icons/Feather";
import EmojiSelector from "react-native-emoji-selector";
import { useIsFocused } from "@react-navigation/native";
import AudioPlayer from "./AudioPlayer";
import { getCurrentLocation } from "../../utils/currentLocation";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { sendNotification } from "../../api/notification";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [chatRoomId, setChatRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localImageUrl, setLocalImageUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordingStop, setRecordingStop] = useState(true);
  const [selectedEmoji, setSelectedEmoji] = useState([]);
  const [currentUserInfo, setCurrentUserInfo] = useState({});
  const isFocused = useIsFocused();

  const route = useRoute();
  const user = route.params?.user;
  const currentUserId = route?.params?.currentUserId;

  useEffect(() => {
    const getUser = async () => {
      if (currentUserId) {
        const data = await getUserById(currentUserId);
        if (data.found && data.success) {
          setCurrentUserInfo(data.data);
        }
      }
    }
    getUser()
  }, [currentUserId])

  useEffect(() => {
    const createRoom = async () => {
      setIsLoading(true);
      if (user && currentUserId) {
        setIsLoading(true);
        const existingChatRoom = await getChatRoom(
          [user?.id, currentUserId].sort().join()
        );
        if (existingChatRoom.found && existingChatRoom.success) {
          setChatRoomId(existingChatRoom.data.id);
          setIsLoading(false);
        } else {
          const res = await addDoc(collection(db, "chatRoom"), {
            id: 1,
            user: [user?.id, currentUserId].sort().join(),
          });
          const docRef = doc(db, "chatRoom", res._key.path.segments[1]);
          await updateDoc(docRef, { id: res._key.path.segments[1] });
          setChatRoomId(res._key.path.segments[1]);
          setIsLoading(false);
        }
      }
    };
    createRoom();
  }, [user, currentUserId]);

  useEffect(() => {
    const collectionRef = collection(db, "chats");

    const q = query(
      collectionRef,
      orderBy("createdAt", "desc"),
      where("chatRoomId", "==", chatRoomId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          chatRoomId: chatRoomId,
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
          image: doc.data().image,
          audio: doc.data().audio,
          read: doc.data().read,
          coords: doc.data().coords,
        }))
      );
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  const onSendEmoji = async () => {
    setSelectedEmoji([]);
    if (selectedEmoji.length !== 0) {
      this.RBSheetEmoji.close();
      const message = {
        chatRoomId: chatRoomId,
        _id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        user: {
          _id: currentUserId,
        },
        text: selectedEmoji,
        read: false,
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      );
      const res = await addDoc(collection(db, "chats"), message);
      // await sendNotification(user?.token, currentUserInfo?.username, selectedEmoji?.join(""), currentUserInfo?.isNotification)
      this.RBSheetEmoji.close();
      const docRef = doc(db, "chats", res._key.path.segments[1]);
      await updateDoc(docRef, { _id: res._key.path.segments[1] });
      // setIsOpen(false);
      setSelectedEmoji([]);
    }
  };

  const deleteEmoji = (index) => {
    let data = [...selectedEmoji];
    data.splice(index, 1);
    setSelectedEmoji([...data]);
  };

  const onSend = useCallback(
    async (messages = []) => {
      if (messages[0].text.trim() !== "") {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, messages)
        );

        const { _id, createdAt, text, } = messages[0];

        const res = await addDoc(collection(db, "chats"), {
          chatRoomId: chatRoomId,
          _id,
          createdAt,
          text,
          user: {
            _id: currentUserId,
          },
          read: false,
        });
        const docRef = doc(db, "chats", res._key.path.segments[1]);
        await updateDoc(docRef, { _id: res._key.path.segments[1] });
        // await sendNotification(user?.token, currentUserInfo?.username, messages[0]?.text, currentUserInfo?.isNotification);
      }
    },
    [chatRoomId]
  );

  const pickImage = async () => {
    this.RBSheetAttachment.close();
    Alert.alert(
      "Choose an option",
      "Would you like to take a photo or choose from the library?",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              alert("Camera permission is required to take photos.");
              return;
            }

            let result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              console.log("take: ", result.assets[0].uri);
              setLocalImageUrl(result.assets[0].uri);
              this.RBSheet.open();
              return result.assets[0].uri;
            }
          },
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              alert("Camera roll permission is required to choose photos.");
              return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              console.log("Choose from libray: ", result.assets[0].uri);
              setLocalImageUrl(result.assets[0].uri);
              this.RBSheet.open();
              return result.assets[0].uri;
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const uploadImage = async (image) => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = image.substring(image.lastIndexOf("/") + 1);
      const imagesRef = ref(storage, `images/${filename}`);
      const snapshot = await uploadBytes(imagesRef, blob);
      const downloadURL = await getDownloadURL(imagesRef);
      return downloadURL;
    } catch (error) {
      console.error(
        "Error preparing file for upload or getting download URL",
        error
      );
    }
  };

  const sendFile = async () => {
    this.RBSheetAttachment.close();
    this.RBSheet.close();
    setIsLoading(true);
    const downloadURL = await uploadImage(localImageUrl);
    if (downloadURL) {
      const message = {
        chatRoomId: chatRoomId,
        _id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        user: {
          _id: currentUserId,
        },
        image: downloadURL,
        read: false,
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      );

      const res = await addDoc(collection(db, "chats"), message);
      const docRef = doc(db, "chats", res._key.path.segments[1]);
      await updateDoc(docRef, { _id: res._key.path.segments[1] });
      // await sendNotification(user?.token, currentUserInfo?.username, "You have recieved a image", currentUserInfo?.isNotification)
      setIsLoading(false);
    }
  };

  const sendAudio = async () => {
    this.RBSheetAttachment.close();
    this.RBSheetAudio.close();
    setIsLoading(true);
    const downloadURL = await uploadImage(recording.getURI());
    if (downloadURL) {
      const message = {
        chatRoomId: chatRoomId,
        _id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        user: {
          _id: currentUserId,
        },
        audio: downloadURL,
        read: false,
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      );

      const res = await addDoc(collection(db, "chats"), message);
      const docRef = doc(db, "chats", res._key.path.segments[1]);
      await updateDoc(docRef, { _id: res._key.path.segments[1] });
      // await sendNotification(user?.token, currentUserInfo?.username, "You have recieved voice message", currentUserInfo?.isNotification);
      setRecordingStop(true);
      setRecording("");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const markMessagesAsRead = async () => {
      setIsLoading(true);
      messages?.map(async (message) => {
        if (message?.user?._id !== currentUserId) {
          const docRef = doc(db, "chats", message._id);
          await updateDoc(docRef, { read: true });
        }
      });
      setIsLoading(false);
    };
    markMessagesAsRead();
  }, [messages, isFocused, currentUserId]);

  const sendLocation = async () => {
    this.RBSheetAttachment.close();
    setIsLoading(true);
    const coords = await getCurrentLocation();
    if (coords) {
      const message = {
        chatRoomId: chatRoomId,
        _id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        user: {
          _id: currentUserId,
        },
        coords: coords,
        read: false,
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      );

      const res = await addDoc(collection(db, "chats"), message);
      const docRef = doc(db, "chats", res._key.path.segments[1]);
      await updateDoc(docRef, { _id: res._key.path.segments[1] });
      // await sendNotification(user?.token, currentUserInfo?.username, "You have recieved location", currentUserInfo?.isNotification);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleLocation = async () => {
    Alert.alert(
      "يُحذًِر",
      "هل تريد مشاركة موقعك؟",
      [
        {
          text: "يلغي",
          style: "cancel",
          onPress: () => this.RBSheetAttachment.close(),
        },
        {
          text: "نعم",
          onPress: async () => {
            await sendLocation();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const navigateToMap = async (latitude, longitude) => {
    if (Platform.OS === "ios") {
      const url = `http://maps.apple.com/?q=${latitude},${longitude}`;
      Linking.openURL(url);
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const deleteRecording = () => {
    setRecording("");
    this.RBSheetAudio.close();
    console.log("Delete Recording:", recording);
  };

  return (
    <>
      <ChatHeader user={user} />
      <Spinner visible={isLoading} />
      <RBSheet
        ref={(ref) => {
          this.RBSheet = ref;
        }}
        height={350}
        closeOnDragDown={true}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: "center",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            width: "100%",
          },
          draggableIcon: {
            backgroundColor: "silver",
          },
        }}
      >
        <View>
          <View style={styles.contentFlex}>
            <Ionicons
              name="close-circle-outline"
              size={30}
              onPress={() => this.RBSheet.close()}
              style={styles.closeIcon}
            />
          </View>
          <Image source={{ uri: localImageUrl }} style={styles.image} />
          <TouchableOpacity
            onPress={() => sendFile()}
            style={styles.sendButton}
          >
            <Text style={styles.sendButtonText}>أرسل الصورة</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
      <View></View>
      <RBSheet
        ref={(ref) => {
          this.RBSheetAudio = ref;
        }}
        height={Platform.OS === "ios" ? 180 : 160}
        openDuration={250}
        customStyles={{
          container: {
            // justifyContent: "center",
            // paddingTop: 30,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        <>
          <VoiceRecording
            recording={recording}
            setRecording={setRecording}
            setRecordingStop={setRecordingStop}
            sendAudio={sendAudio}
            recordingStop={recordingStop}
            deleteRecording={deleteRecording}
          />
          {/* {
            !recordingStop && <TouchableOpacity onPress={() => sendAudio()} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>إرسال صوت</Text>
            </TouchableOpacity>
          } */}
        </>
      </RBSheet>
      <GiftedChat
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: "grey",
                },
                left: {
                  color: "white",
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: "#C7AB37",
                  marginBottom: 10,
                },
                right: {
                  backgroundColor: "#E0E0E0",
                  marginBottom: 10,
                },
              }}
            />
          );
        }}
        renderTime={(props) => {
          return (
            <Time
              {...props}
              timeTextStyle={{
                left: {
                  color: "white",
                },
                right: {
                  color: "grey",
                },
              }}
            />
          );
        }}
        renderInputToolbar={(props) => {
          return (
            <>
              <InputToolbar
                {...props}
                containerStyle={styles.inputToolbar}
                textInputStyle={
                  Platform.OS === "ios"
                    ? {
                      textAlign: "right",
                      marginLeft: 35,
                      right: 50,
                      paddingTop: 5,
                    }
                    : {
                      textAlign: "right",
                      right: 57,
                      paddingTop: 5,
                      left: -32,
                      marginRight: 19,
                    }
                }
                placeholder="اكتب رسالة..."
              />
            </>
          );
        }}
        alwaysShowSend
        renderSend={(props) => {
          return (
            <View style={{ right: 300 }}>
              <Send
                {...props}
                containerStyle={
                  Platform.OS === "ios"
                    ? {
                      flexDirection: "row",
                      alignItems: "center",
                      right: 45,
                    }
                    : {
                      flexDirection: "row",
                      alignItems: "center",
                      right: 20,
                    }
                }
              >
                <Ionicons
                  style={{ transform: [{ rotateY: "180deg" }] }}
                  name="send"
                  size={30}
                  color="#D4B745"
                />
              </Send>
            </View>
          );
        }}
        renderActions={(props) => {
          return (
            <View
              style={
                Platform.OS === "ios"
                  ? {
                    flexDirection: "row",
                    gap: 6,
                    alignItems: "center",
                    left: 316,
                    marginBottom: 6,
                  }
                  : {
                    flexDirection: "row",
                    gap: 6,
                    alignItems: "center",
                    left: 283,
                    marginBottom: 6,
                  }
              }
            >
              {/* <TouchableOpacity onPress={
                () =>
                  this.RBSheetAudio.open()
              }>
                <View style={styles.iconsStyle}>
                  <FontAwesome name="microphone" size={20} color="white" />
                </View>
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                onPress={() => {
                  this.RBSheetEmoji.open();
                }}
              >
                <View>
                  <MaterialIcons
                    name="emoji-emotions"
                    size={30}
                    color="#BFC4D3"
                  />
                </View>
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  this.RBSheetAudio.open();
                }}
              >
                <View style={styles.iconsStyle}>
                  <FontAwesome name="microphone" size={20} color="white" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.RBSheetAttachment.open();
                }}
              >
                <View style={styles.iconsStyle}>
                  <Entypo name="attachment" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
        renderCustomView={(props) => {
          if (props.currentMessage.coords) {
            const region = props.currentMessage.coords;
            return (
              <TouchableOpacity
                style={{
                  width: 200,
                  height: 200,
                  margin: 3
                }}
              >
                <MapView
                  provider={PROVIDER_GOOGLE}
                  initialRegion={region}
                  style={{ width: 200, height: 200, }} // Set the width and height as needed
                  region={region}
                  onPress={() =>
                    navigateToMap(region.latitude, region.longitude)
                  }
                >
                  <Marker coordinate={region} title="Location" />
                </MapView>
              </TouchableOpacity>
            );
          }
        }}
        renderMessageImage={(props) => {
          if (props.currentMessage.image) {
            return (
              <Image
                source={{ uri: props.currentMessage.image }}
                style={{ width: 200, height: 200, borderRadius: 10 }}
              />
            );
          }
          return null;
        }}
        renderMessageAudio={(props) => {
          return <AudioPlayer audioUrl={props.currentMessage.audio} />;
        }}
        messages={messages}
        // textInputProps={}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: currentUserId,
        }}
      />
      <RBSheet
        closeOnDragDown={true}
        ref={(ref) => {
          this.RBSheetEmoji = ref;
        }}
        height={350}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 30,
            width: "100%",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          draggableIcon: {
            backgroundColor: "silver",
          },
        }}
      >
        <View
          style={{
            height: 340,
            backgroundColor: "white",
            bottom: 0,
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={onSendEmoji}>
              <Ionicons
                style={{ transform: [{ rotateY: "180deg" }], left: 8 }}
                name="send"
                size={30}
                color="#D4B745"
              />
            </TouchableOpacity>
            <Text
              style={{
                borderWidth: 1,
                marginHorizontal: 5,
                marginVertical: 10,
                padding: 5,
                borderRadius: 10,
                textAlign: "right",
                width: "75%",
                left: 10,
                backgroundColor: "transparent",
              }}
            >
              {selectedEmoji.join("")}
            </Text>
            <TouchableOpacity onPress={deleteEmoji}>
              <Feather
                style={{ left: 14 }}
                name="delete"
                size={30}
                color="#D4B745"
              />
            </TouchableOpacity>
          </View>
          <EmojiSelector
            onEmojiSelected={(emoji) =>
              setSelectedEmoji([...selectedEmoji, ...emoji])
            }
            columns={10}
          />
        </View>
      </RBSheet>
      {/* Attachment Sheet */}
      <RBSheet
        closeOnDragDown={true}
        ref={(ref) => {
          this.RBSheetAttachment = ref;
        }}
        height={130}
        openDuration={250}
        customStyles={{
          container: {
            width: "100%",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          draggableIcon: {
            backgroundColor: "silver",
          },
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <TouchableOpacity onPress={() => handleLocation()}>
            <View style={styles.rbSheetIcons}>
              <Entypo name="location" size={35} color="#D4B745" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.rbSheetIcons}>
              <FontAwesome name="image" size={35} color="#D4B745" />
            </View>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </>
  );
};

const styles = StyleSheet.create({
  inputToolbar: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  iconsStyle: {
    width: 30,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#BFC4D3",
  },
  contentFlex: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeIcon: {
    color: "red",
    paddingRight: 10,
  },
  image: {
    width: 400,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  sendButton: {
    backgroundColor: "#D4B745",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 20,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  rbSheetIcons: {
    borderWidth: 1.5,
    width: 60,
    height: 60,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#D4B745",
  },
});

export default Chat;
