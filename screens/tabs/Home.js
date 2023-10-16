import React,{Component}  from "react";
import { StyleSheet, Text, View ,I18nManager ,TouchableHighlight ,I18nManagerStatic} from 'react-native';
import * as Updates from 'expo-updates'
 export default class Home extends Component {
    update = async()=>{
        await I18nManager.forceRTL(false);
        await Updates.reloadAsync();
    }
    render() {
        return(
            <View style ={{ flex:1,alignItems:'center',justifyContent:'center' }}> 
                <Text>
              
                    this is the Home screen 
                </Text>
                <Text>{I18nManager.isRTL ? "RTL" : "LTR"}</Text>
                <TouchableHighlight onPress={()=>this.update()}>
                    <Text>
                        press me
                    </Text>
                </TouchableHighlight>
            </View>
        )
    }
 } 