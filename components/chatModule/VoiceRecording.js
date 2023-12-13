import * as React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Audio } from "expo-av";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

export default function VoiceRecording({
  recording,
  setRecording,
  setRecordingStop,
  sendAudio,
  recordingStop,
  deleteRecording
}) {
  const [record, setRecord] = React.useState(false);
  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setRecord(true);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecordingStop(false);
    setRecord(false);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
  }

  // const deleteRecording = () => {
  //   setRecording("");
  //   console.log("Delete Recording:", recording);
  // };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 2,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: "#D4B745",
            borderRadius: 35,
            alignItems: "center",
            justifyContent: "center",
            height: 65,
            width: 65,
          }}
        >
          {record ? (
            <FontAwesome name="microphone" size={45} color="#D4B745" />
          ) : (
            <FontAwesome name="microphone-slash" size={45} color="#D4B745" />
          )}
        </View>
      </View>
      <View style={{ flex: 1.5 }}>
        <View
          style={
            Platform.OS === "ios"
              ? styles.containerIOS
              : styles.containerAndroid
          }
        >
          <TouchableOpacity
            disabled={recordingStop || recording === ""}
            onPress={sendAudio}
          >
            <View
              style={{
                borderWidth: 0,
                padding: 5,
                borderRadius: 25,
                width: 40,
                height: 40,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#D4B745",
              }}
              onPress={() => sendAudio()}
            >
              <Ionicons
                style={{ transform: [{ rotateY: "180deg" }] }}
                name="send"
                size={25}
                color="white"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "silver",
              padding: 5,
              borderRadius: 30,
              width: 55,
              height: 55,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#D4B745",
            }}
            onPress={recording ? stopRecording : startRecording}
          >
            {/* <Text style={{ textAlign: 'center' }}>{recording ? 'إيقاف التسجيل' : 'ابدأ التسجيل'}</Text> */}
            {record ? (
              <Entypo name="controller-stop" size={35} color="white" />
            ) : (
              <Entypo name="controller-record" size={35} color="white" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 0,
              padding: 5,
              borderRadius: 25,
              width: 40,
              height: 40,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#D4B745",
            }}
            onPress={() => deleteRecording()}
          >
            <AntDesign name="delete" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerAndroid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E0E0E0",
    width: "100%",
    flex: 1,
    paddingHorizontal: 10,
  },
  containerIOS: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E0E0E0",
    width: "100%",
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
});
