import React from "react";
import { Text, StyleSheet, View, TouchableOpacity, SafeAreaView,Image } from "react-native";
export default function UnfilledBtn({title, onPress}) {
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={() => onPress()}>
      <Text style={styles.btnText} >{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    borderColor:'#B99C28',
    borderWidth:2,
    borderRadius:10,
    height:50,
    alignItems:'center',
    justifyContent:'center',
  },
  btnText: {
    color:'#B99C28',
    textAlign:'center'
  },
});
