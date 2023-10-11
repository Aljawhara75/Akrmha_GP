import React,{Component}  from "react";
import { StyleSheet, Text, View } from 'react-native';

 export default class Test extends Component {
 
    render() {
        return(
            <View style ={{ flex:1,alignItems:'center', }}> 
              <TouchableWithoutFeedback onPress={()=>{alert('hi')}}>
                    <Text>
                    خضراوات
                    </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{alert('hi')}}>
                    <Text>
                    فواكه
                    </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{alert('hi')}}>
                    <Text>
                    مشروبات
                    </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{alert('hi')}}>
                    <Text>
                    معلبات
                    </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{alert('hi')}}>
                    <Text>
                    مخبوزات
                    </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{alert('hi')}}>
                    <Text >
                    البان
                    </Text>
                </TouchableWithoutFeedback>
            </View>
        )
    }
 } 