import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function AudioPlayer({ audioUrl, recording }) {
  const [sound, setSound] = React.useState();
  const [playAudio, setPlayAudio] = React.useState(false);

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    setSound(sound);
    setPlayAudio(true);
    console.log("Playing Sound");
    await sound.playAsync();
  }

  const stopSound = async () => {
    setPlayAudio(false);
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
          // setPlayAudio(false)
        }
      : undefined;
  };

  return (
    // <View>
    //   <Button title="Voice Message" onPress={playSound} />
    // </View>

    <View style={styles.container}>
      {playAudio ? (
        <TouchableOpacity onPress={stopSound}>
          <View
            style={{
              backgroundColor: "transparent",
              margin: 5,
              padding: 5,
              borderRadius: 10,
            }}
          >
            <AntDesign name="pause" size={25} />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={playSound}>
          <View
            style={{
              backgroundColor: "transparent",
              margin: 5,
              padding: 5,
              borderRadius: 10,
            }}
          >
            <Entypo name="controller-play" size={25} />
          </View>
        </TouchableOpacity>
      )}
      <Text style={{ paddingHorizontal: 10 }}>رسالة صوتية</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: -15,
  },
});
