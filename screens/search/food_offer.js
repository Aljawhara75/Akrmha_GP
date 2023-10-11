import React,{Component}  from "react";
import { StyleSheet, Text, View ,TextInput ,TouchableWithoutFeedback ,Image
    ,ScrollView ,TouchableOpacity ,FlatList} from 'react-native';
import { Feather,AntDesign ,FontAwesome5 ,MaterialIcons ,MaterialCommunityIcons ,Entypo,Ionicons,
    Fontisto
} from '@expo/vector-icons';
import MapView from 'react-native-maps';
 export default class Food_offer extends Component {
    constructor(props){
        super(props)
            this.state={
                image :require('../../images/food1.jpg')
            }
  
    }

    render() {
        return(
            <View style ={styles.container}> 
            <View style={styles.header}>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <View style={styles.profile_male}>                 
            <Fontisto name="male" size={25} color="white" />      
                            </View>
            <View style={{paddingHorizontal:'3%'}}>
                <Text style={{fontSize:12,color:'black'}}>
                عبدالرحمن السهلي 
                </Text>
                <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center'}}>
                <AntDesign name="star" size={15} color="#5DADE2" />
                <AntDesign name="star" size={15} color="#5DADE2" />
                <AntDesign name="star" size={15} color="#5DADE2" />
                <AntDesign name="star" size={15} color="#5DADE2" />
                <AntDesign name="star" size={15} color="#5DADE2" />
                <Text style={{color:'#5DADE2',fontSize:8,paddingVertical:'1%'}}>14 تقييم</Text>
              
                </View>
               
            </View>
            </View>
          <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
            <Text style={{paddingHorizontal:'3%'}}>
                الرئيسية
            </Text>
            <Feather name="arrow-left" size={24} color="black" />
          </View>
            </View>
         <View style={styles.card_view}>
         <Image source={this.state.image} style={styles.image_style} />
         <View style={{justifyContent:'space-between',alignItems:'center',flexDirection:'row',width:'90%',marginHorizontal:'5%',marginVertical:'5%'}}>
            <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>
                وجبة برجر جاهزة عدد 2
            </Text>
            <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row',backgroundColor:'#FAE5D3',borderRadius:10,height:40,width:70}}>
            <Ionicons name="fast-food" size={18} color="red" style={{padding:'5%'}} />
            <Text style={{fontSize:12,padding:'10%'}}>
                مطاعم
            </Text>
            </View>
         </View>
         <View style ={{width:'90%',marginHorizontal:'5%',justifyContent:'flex-start',marginVertical:'3%'}}>
         <Text style={{fontSize:12,}}>
                الكمية المتاحة :2 وجبة
            </Text>
         </View>
         <View style ={{width:'90%',marginHorizontal:'5%',justifyContent:'flex-start',marginVertical:'3%'}}>
         <Text style={{fontSize:14,fontWeight:'bold'}}>
                وصف الوجبة:
            </Text>
         </View>
         <View style ={{width:'90%',marginHorizontal:'5%',justifyContent:'flex-start',}}>
         <Text style={{fontSize:10,}}>
                وصف الوجبة:وجبة برجر جاهزة تتكون من قطعة لحم بقري طازجة ومشوية بشكل مثالي
                 ,توضع داخل خبز برجر ناعم,وتحشى بصلصة المايونيز اللذيذة والخضراوات الطازجة لتضفي النكهة والملمس المميز على البرجر.
            </Text>
         </View>
         <View style ={{width:'90%',marginHorizontal:'5%',justifyContent:'flex-start',marginTop:'5%'}}>
         <Text style={{fontSize:10,color:'black',fontWeight:'bold'}}>
     وقت الاستلام :  29/5/2023 3:00مساءَ
            </Text>
         </View>
         <View style ={{width:'90%',marginHorizontal:'5%',justifyContent:'flex-start',marginTop:'5%'}}>
         <Text style={{fontSize:10,color:'black',fontWeight:'bold'}}>
     مكان الاستلام:الرياض 
            </Text>
         </View>
         <MapView style={styles.map} 
             initialRegion={{
                latitude: 24.774265,
                longitude: 46.738586,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
           />
         </View>
        
        
            </View>
        )
    }
 } 
 const styles = StyleSheet.create({
    container:{
flex:1,
justifyContent:'center',
alignItems:'center',
backgroundColor:'white'
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        height:50,
        width:'100%',
        backgroundColor:'white',
        paddingHorizontal:'5%',
        marginTop:'10%'
    },
    profile_male :{height:35,width:35,borderRadius:100,borderWidth:2,borderColor:'#5DADE2'
    ,justifyContent:'center',alignItems:'center',backgroundColor:'#3B3E3F'},
    card_view : {
        width:'80%',marginHorizontal:'10%',
        marginVertical:'5%',
        backgroundColor:'#F8F9F9',
        
        justifyContent:'center',alignItems:'center',
        
    },
    image_style :{
        marginTop:'5%',
        width:'100%',
        height:200,
    
       
    },
    map: {
        marginTop:'5%',
        width: '90%',
        height: 250,
      },

 })