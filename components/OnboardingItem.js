import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import React from "react";

export default function OnboardingItem({ item }) {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={item.image}
        style={[styles.image, { resizeMode: "contain" }]}
      />
      <View style={{ flex: 0.45 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    flex: 0.5,
    justifyContent: "center",
    //width: 800,
    height: 150,
    marginBottom: 60,
    marginTop: 150,
  },

  title: {
    fontWeight: "800",
    fontSize: 25,
    marginBottom: 10,
    color: "#424242",
    textAlign: "center",
    marginBottom: 30,
  },

  description: {
    fontWeight: "400",
    fontSize: 18,
    color: "#808080",
    textAlign: "center",
    paddingHorizontal: 50,
    //marginBottom: 30,
  },
});
