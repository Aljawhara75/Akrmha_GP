import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import Lunch from '../assets/lunch.png';
export default function LocationComp({ quantity, setQuantity }) {
  return (

    <View style={styles.quantityContainer} >
      <View>
        <TouchableOpacity>
            <Text>hh</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Text>hh</Text>
        </TouchableOpacity>
      </View>
      <View>
        <View>
            <Image source={Lunch} />
        </View>
        <View>
        <Text>gvbhj</Text>
        <Text>gvbhj</Text>
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5
  },
})
