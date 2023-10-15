import React,{Component}  from "react";
import { StyleSheet, Text, View ,TextInput ,TouchableWithoutFeedback ,ScrollView ,TouchableOpacity} from 'react-native';
import { Feather,AntDesign ,FontAwesome5 ,MaterialIcons ,MaterialCommunityIcons ,Entypo} from '@expo/vector-icons';
import MapView from 'react-native-maps';
 export default class Search_Map extends Component {
    constructor(props){
        super(props)
       
        this.state={
          search_text:'',
          food_items :[{key:1,name :'المشروبات'},
           {key:2,name :'مخبوزات'},
            {key:3,name :'معلبات'},
            {key:4,name :'اللحوم'},
                {key:5,name :'مشتقات الالبان'},
                  {key:6,name :'خضراوات و فواكه'},
                    {key:7,name :'مطاعم' },
                      { key :8,   name : 'منزلي '}, 
     
         
          ],
         food_data :[
            {id:'1',name :'سناء',image :require('../../images/food1.jpg'),discreption:'وجبة طعام لذيذة للمشاركة',gernder:'f',gps_point:'1.2'},
            {id:'2',name :'خالد',image :require('../../images/food2.jpg'),discreption:'وجبة ارز مع قطع الدجاج',gernder:'m',gps_point:'1.2'},
            {id:'3',name :'عبدالرحمن',image :require('../../images/food3.jpg'),discreption:'وجبة ارز مع قطع لحم',gernder:'m',gps_point:'1.2'},
            {id:'4',name :'نوال',image :require('../../images/food1.jpg'),discreption:'وجبة خضار لذيذة',gernder:'f',gps_point:'1.2'},
            {id:'5',name :'منال',image :require('../../images/food5.jpg'),discreption:'وجبة ارز مع قطع لحم',gernder:'f',gps_point:'1.2'},
            {id:'6',name :'ياسر',image :require('../../images/food3.jpg'),discreption:'وجبة خضار لذيذة',gernder:'m',gps_point:'1.2'},

        ]
      
           
    }
    }
 
    render() {
        return(
            <View style ={styles.constainer}> 
           <View style ={styles.search_bar} >
           
           <TextInput placeholder="ابحث عن الطعام"
           
            onChangeText={(value)=>{this.setState({search_text:value})}}
            value={this.state.search_text}
       style ={styles.search_input}
        />
        
     
        <View style ={styles.filter}>
        <Feather name="search" size={20} color={"white"} />
        </View>
     
           </View>
    

<View>
<MapView style={styles.map} 
             initialRegion={{
                latitude: 24.774265,
                longitude: 46.738586,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
           />
</View>
<View style ={styles.back_action}>
      
        <Feather name="list" size={20} color="white" onPress={()=> this.props.navigation.goBack()} />
        </View> 
<ScrollView horizontal 
      
           style={{height:50, width:'100%',position:'absolute',top:'12%',textAlign:'right',  alignSelf:'flex-end'}}
               >
                   {
                   this.state.food_items.map(item =>(
                       <View key={item.key} style={styles.scroll_items}>
 <TouchableWithoutFeedback onPress={()=>{alert('hi')}}
                      
                       >
                      <Text style ={{fontSize:12}}>
                          {item.name}
                           </Text>
                       </TouchableWithoutFeedback>
                       </View>
                     
                   ))
                   }
            
           </ScrollView>     
            </View>
        )
    }
 } 
 const styles = StyleSheet.create({
    constainer :{
        backgroundColor:'white'
     },
     map: {
        marginTop:'10%',
        width: '100%',
        height: '90%',
      },
     search_bar:{
         flexDirection:'row-reverse',
         backgroundColor:'white',
         alignItems:'center',
         justifyContent:'center',
         marginTop:'15%'
      
     },
     search_input :{
        
         borderColor:'#B99C28',
         backgroundColor:'white',
         borderWidth:1,
         height:40,
         width:'90%',
         marginRight:'10%',
         borderRadius:10,
         paddingRight:'3%',
       // paddingStart:'5%',
        //paddingEnd:'20%',
        fontSize:14,
        fontWeight:'bold',
        textAlign:'right'
        
     
        
     },
     filter:{
         backgroundColor:'#B99C28',
         width:40,height:40,
         justifyContent:'center',alignItems:'center',
         borderWidth:1,
         borderRadius:10,
         right:'100%',
         borderColor:'#B99C28'
         
        
     },
     icon:{
        
         justifyContent:'center',alignItems:'center',
         right:'170%',
         borderColor:'#B99C28' 
     },
     scroll_items:{
       paddingLeft:30,
       marginVertical:'3%',
        height:50,
        backgroundColor:'white',
         flexDirection:'row-reverse',

     },
     map_style:{
         flexDirection:'row',
         justifyContent:'center',
         alignItems:'center',
     },
     two_buttom_style:{
         width:'80%',
         marginTop:'5%',
         marginHorizontal:'10%',
         flexDirection:'row',
         justifyContent:'space-between'
     },
     image_style :{
         width:'100%',
         height:150,
         borderTopLeftRadius:10,
         borderTopRightRadius:10,
        
     },
     card_view : {
         width:'41%',marginHorizontal:'1%',
         marginVertical:'1%',
         borderRadius:10,
         justifyContent:'center',alignItems:'center',
         backgroundColor:'white'
     },
     discreption_style:{width:'90%',color:'black',
     fontSize:14,fontWeight:'bold',marginHorizontal:'5%',
     marginVertical:'5%'},
 
     name_style:{flexDirection:'row',marginVertical:'5%',justifyContent:'flex-start',
     alignItems:'center',width:'90%',marginHorizontal:'5%'},
     profile_male :{height:30,width:30,borderRadius:100,borderWidth:2,borderColor:'#5DADE2'
     ,justifyContent:'center',alignItems:'center',backgroundColor:'#3B3E3F'},
 
     profile_female :{height:30,width:30,borderRadius:100,borderWidth:2,borderColor:'#5DADE2'
     ,justifyContent:'center',alignItems:'center',backgroundColor:'white'},
     gps_style:{flexDirection:'row',marginVertical:'5%',justifyContent:'flex-start',
     alignItems:'center',width:'90%',marginHorizontal:'5%'},
     back_action:{
        backgroundColor:'#B99C28',
        width:40,height:40,
        justifyContent:'center',alignItems:'center',
        borderWidth:1,
        borderRadius:10,
        right:'100%',
        borderColor:'#B99C28',
        position:'absolute',
        top:'80%',
        right:'20%',
        left:'80%',
        bottom:'20%'
     }
 })