import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'

export default function IncrementComp({ quantity, setQuantity, foodData }) {

  return (

    <View style={styles.quantityContainer} >
      <TouchableOpacity style={styles.decrementBtn} onPress={() => {
        if (quantity > 1)
          setQuantity(quantity - 1)
      }}>
        <Text style={{ color: 'black', fontSize: 16 }} >-</Text>
      </TouchableOpacity>
      <Text>{quantity}</Text>
      <TouchableOpacity style={
        foodData?.quantity === quantity ?
          styles.incrementBtn2 :
          styles.incrementBtn
      } onPress={() => {
        if (foodData?.quantity) {
          if (quantity < foodData?.quantity) {
            setQuantity(quantity + 1)
          }
        } else {
          setQuantity(quantity + 1);
        }
      }
      }>
        <Text style={
          foodData?.quantity === quantity ?
            {
              color: "black"
            } : {
              color: "white"
            }
        } >+</Text>
      </TouchableOpacity>
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
  incrementBtn: {
    backgroundColor: '#B99C28',
    borderRadius: 100,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    // marginRight: 15
  },
  incrementBtn2: {
    backgroundColor: '#CECECE',
    borderRadius: 100,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    // marginRight: 15
  },
  decrementBtn: {
    backgroundColor: '#CECECE',
    borderRadius: 100,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
})
