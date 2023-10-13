import React,{Component}  from "react";
import { StyleSheet, Text, View  ,TextInput ,TouchableOpacity,Image} from 'react-native';
import { BottomSheet , RadioGroup, RadioButtonProps ,RadioButton} from "react-native-btr";
import { Feather,AntDesign ,FontAwesome5 ,MaterialIcons ,MaterialCommunityIcons ,Entypo,
  Fontisto
} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from 'expo-image-picker';
import MapView from 'react-native-maps';
import * as Linking from 'expo-linking';
 export default class After_add extends Component {
  constructor(props){
    super(props)
        this.state={
             food_type:'',
             time :'',
            visible:true,
            time_visble:true,
            food_type:'',
            open: false,
            time_open:false,
            value: null,
           
  
          
        
        }

      }
   

  toggle =()=>{
    //this.setState({visible:!this.state.visible})
    this.props.navigation.replace('tabs')
  }

componentDidMount(){
  this.setState({visible:true})
}
componentWillUnmount(){

}

    render() {

        return(
            <View > 
               <BottomSheet
        visible={true}
        onBackButtonPress={ ()=>this.toggle()}
        onBackdropPress={()=>this.toggle()}
      >
          
        <View style={styles.card}>
       

        <Image source={require('../../images/food3.jpg')} style={styles.image_style} />
        <View style={{width:50,height:50,borderRadius:100,marginTop:'5%',
            justifyContent:'center',alignItems:'center',borderWidth:0.5,borderColor:'black'}}>
        <Image source={require('../../images/hand.jpg')} style={styles.hand_style} />
        </View>
        
        <View style={{marginTop:'5%'}}>
            <Text style={{fontSize:16,fontWeight:'800'}}>
                اضفت عرض بنجاح ،نشكر طيب كرمك
            </Text>
        </View>
        <View style={{marginVertical:'5%',height:100}}>
            <Text style={{fontSize:12,fontWeight:'400'}}>
                تم اضافة العرض بنجاح،يمكنك الان تلقي الطلبات في الرسائل 
            </Text>
            <Text style={{fontSize:12,fontWeight:'400',textAlign:'center'}}>
                سارع بقبول الطلبات التي تناسبك لتحقيق الهدف بنجاح 
            </Text>
        </View>
        <View style={{marginVertical:'10%'}}>
            <Text style={{fontSize:12,fontWeight:'400'}}>
                يمكنك متابعة الطلبات والعروض الخاصة بك من خلال القوائم
            </Text>
        </View>
        <TouchableOpacity style={styles.selection_style}
       onPress={()=>this.props.navigation.replace('tabs')}
        >
        <Text style={{color:'white'}}>
          القوائم
        </Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.selection_style_1}
              onPress={()=>this.props.navigation.replace('tabs')}
        >
        <Text style={{color:'black'}}>
          الرئيسية
        </Text>
      </TouchableOpacity>
       
     
        
        </View>
        
      </BottomSheet>
         
            </View>
        )
    }
 } 



 const styles = StyleSheet.create({


  card : {
    backgroundColor: "#fff",
    height: '95%',
 //justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius:25,
    borderTopLeftRadius:25
  },
  card_1 : {
    backgroundColor: "#fff",
    height: '100%',
    width:'100%',
 
    borderTopRightRadius:25,
    borderTopLeftRadius:25
  },
  image_style :{
    width:'100%',
    height:'35%',
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
   
},
hand_style :{
    width:40,
    height:40,
   borderRadius:100
   
},
 
selection_style:{
  width:'90%',height:50,
  marginHorizontal:'5%',
  backgroundColor:'#B99C28',
  justifyContent:'center',alignItems:'center',
  borderRadius:10,
  marginVertical:'3%',

},
selection_style_1:{
   
        width:'90%',height:50,
        marginHorizontal:'5%',
        backgroundColor:'white',
        borderColor:'#B99C28',
        borderWidth:1,
        justifyContent:'center',alignItems:'center',
        borderRadius:10,
       
      
      
}
})