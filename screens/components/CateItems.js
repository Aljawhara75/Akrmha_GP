import React, { Component } from 'react'
import { Text, StyleSheet, View , Image} from 'react-native'
//import Cate from "./comp"
export default function CateItems ({ item }){
  return(

      <View style={styles.container}>
       <Image
        source={item.image}
        style={[styles.image, { resizeMode: "contain" }]}
      />
      </View>
    )
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

})
