import React,{Component}  from "react";
import { StyleSheet, Text, View ,TextInput ,TouchableWithoutFeedback ,Image
    ,ScrollView ,TouchableOpacity ,FlatList,SafeAreaView} from 'react-native';
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
            <ScrollView>
            < SafeAreaView style ={styles.container}> 
            <View style={styles.header}>
            <View style={{flexDirection:"row-reverse",justifyContent:'center',alignItems:'center'}}>
       <Image source={require('../../images/application_image/male_profile.jpg')} style={styles.profile_image}/>
           
            <View style={{paddingHorizontal:'3%',}}>
                <Text style={{fontSize:12,color:'black',textAlign:'right'}}>
                عبدالرحمن السهلي 
                </Text>
                <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#5DADE2',fontSize:8,paddingVertical:'1%'}}>14 تقييم</Text>
                <AntDesign name="star" size={15} color="#5DADE2" />
                <AntDesign name="star" size={15} color="#5DADE2" />
                <AntDesign name="star" size={15} color="#5DADE2" />
                <AntDesign name="star" size={15} color="#5DADE2" />
                <AntDesign name="star" size={15} color="#5DADE2" />
        
              
                </View>
               
            </View>
            </View>
          <TouchableOpacity onPress={()=>{ this.props.navigation.goBack()}}
          style={{justifyContent:'center',alignItems:'center',flexDirection:"row-reverse"}}>
            <Text style={{paddingHorizontal:'3%'}}>
                الرئيسية
            </Text>
            <Feather name="arrow-left" size={24} color="black"  />
          </TouchableOpacity>
            </View>
         <View style={styles.card_view}>
         <Image source={this.state.image} style={styles.image_style} />
         <View style={{justifyContent:'space-between',alignItems:'center',flexDirection:"row-reverse",width:'90%',marginHorizontal:'5%',marginTop:'5%'}}>
            <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>
                وجبة برجر جاهزة عدد 2
            </Text>
       <Image source={require('../../images/application_image/resturant.jpg')} style={styles.type_image}/>
         </View>
         <View style ={{width:'90%',marginHorizontal:'5%',marginVertical:'3%'}}>
         <Text style={{fontSize:12,textAlign:'right'}}>
                الكمية المتاحة :2 وجبة
            </Text>
         </View>
         <View style ={{width:'90%',marginHorizontal:'5%',justifyContent:'flex-start',marginVertical:'3%'}}>
         <Text style={{fontSize:12,textAlign:'right'}}>
                  مسبب للحساسية : لا 
            </Text>
         </View>
         <View style ={{width:'90%',marginHorizontal:'5%',justifyContent:'flex-start',marginVertical:'3%'}}>
         <Text style={{fontSize:14,fontWeight:'bold',textAlign:'right'}}>
                وصف الوجبة:
            </Text>
         </View>
         <View style ={{width:'90%',marginHorizontal:'5%',justifyContent:'flex-start',}}>
         <Text style={{fontSize:10,textAlign:'right'}}>
                وصف الوجبة:وجبة برجر جاهزة تتكون من قطعة لحم بقري طازجة ومشوية بشكل مثالي
                 ,توضع داخل خبز برجر ناعم,وتحشى بصلصة المايونيز اللذيذة والخضراوات الطازجة لتضفي النكهة والملمس المميز على البرجر.
            </Text>
         </View>
         <View style ={{width:'90%',marginHorizontal:'5%',justifyContent:'flex-start',marginTop:'5%'}}>
         <Text style={{fontSize:10,color:'black',fontWeight:'bold',textAlign:'right'}}>
     وقت الاستلام :  29/5/2023 3:00مساءَ
            </Text>
         </View>
         <View style ={{width:'90%',marginHorizontal:'5%',justifyContent:'flex-start',marginTop:'5%'}}>
         <Text style={{fontSize:10,color:'black',fontWeight:'bold',textAlign:'right'}}>
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
        
         <View style={styles.footer}>
            <View style={{ flexDirection:"row-reverse",justifyContent:'center',alignItems:'center'}}>
            <View style={styles.profile_male}>                 
            <Fontisto name="male" size={25} color="white" />      
                            </View>
            <View style={{marginHorizontal:'5%'}}>
                <Text style={{fontSize:16,color:'black',fontWeight:'900',paddingHorizontal:'3%'}}>
                ابراهيم  
                </Text>
                <View style={{ flexDirection:"row-reverse", justifyContent:'center',alignItems:'center'}}>
                
                <MaterialCommunityIcons name="map-marker-outline" size={20} color="black" />
                <Text style={{fontSize:10,paddingVertical:'1%'}}>1.4 كم</Text>
              
                </View>
               
            </View>
            </View>
          <View style={{justifyContent:'center',alignItems:'center', flexDirection:"row-reverse",}}>
            <Text style={{paddingHorizontal:'3%',color:'#5DADE2'}}>
                الطلب الان
            </Text>
            <TouchableOpacity style={{width:100,height:30,justifyContent:'center',alignItems:'center',
            borderRadius:10,backgroundColor:'#B99C28'}}>
            <Text style={{paddingHorizontal:'3%',color:'white',fontSize:12}}>
                مراسلة ابراهيم 
            </Text>
            </TouchableOpacity>
         
          </View>
            </View>
            </SafeAreaView>
            </ScrollView>
        )
    }
 } 
 const styles = StyleSheet.create({
    container:{
flex:1,
justifyContent:'center',
alignItems:'center',
backgroundColor:'white',

    },
    header:{
        flexDirection:"row-reverse",
        justifyContent:'space-between',
        height:50,
        width:'100%',
        backgroundColor:'white',
        paddingHorizontal:'5%',
        marginTop:'10%'
    },
    profile_male :{height:40,width:40,borderRadius:100,borderWidth:2,borderColor:'#B99C28'
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
      type_image:{
        height:80,
        width:50,
        borderRadius:25
     },
     footer:{
        flexDirection:"row-reverse",
        justifyContent:'space-between',
        height:50,
        width:'100%',
        backgroundColor:'white',
        paddingHorizontal:'5%',
        marginBottom:'5%'
      
    },
    profile_image:{
        height:40,
        width:40,
        borderRadius:100
     }

 })