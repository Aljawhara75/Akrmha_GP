import React,{Component}  from "react";
import { StyleSheet, Text, View ,TextInput ,TouchableWithoutFeedback ,Image
    ,ScrollView ,TouchableOpacity ,FlatList} from 'react-native';
import { Feather,AntDesign ,FontAwesome5 ,MaterialIcons ,MaterialCommunityIcons ,Entypo,
    Fontisto
} from '@expo/vector-icons';
 export default class Search_Filter extends Component {
    constructor(props){
        super(props)
       
        this.state={
          search_text:'',
          food_items :[{ id :'1',   name : 'منزلي '}, 
          {id:'2',name :'مطاعم' },
          {id:'3',name :'خضراوات و فواكه'},
          {id:'4',name :'مشتقات الالبان'},
          {id:'5',name :'اللحوم'},
          {id:'6',name :'معلبات'},
          {id:'7',name :'مخبوزات'},
          {id:'8',name :'المشروبات'},],
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
 render_item =(item)=>{
    return(
        <TouchableWithoutFeedback   onPress={()=>alert('do somthing')} >
                      <View style ={styles.card_view}>
                      <Image source={item.item.image} style={styles.image_style} /> 
                      <Text numberOfLines={1} style={styles.discreption_style}>
                        {item.item.discreption}
                      </Text>
                    <View style={styles.name_style}>
                        <View style={item.item.gernder=='m'?styles.profile_male:styles.profile_female}>
                            {
                                item.item.gernder=='f'?<Fontisto name="female" size={20} color="black" />:
                                <Fontisto name="male" size={20} color="white" />
                            }
                        </View>
                    <Text style={{fontSize:12,paddingHorizontal:'5%',color:'#5DADE2'}}>{item.item.name}</Text>
                    </View>
                    <View style={styles.gps_style}>
                    <MaterialCommunityIcons name="map-marker-outline" size={13} color="black" />
                    <Text style={{fontSize:10,paddingHorizontal:'2%',}}>{item.item.gps_point}</Text>
                    <Text style={{fontSize:10,}}>كم</Text>
                    </View>
                      
                        </View>
                  
                            
                    </TouchableWithoutFeedback>
    )
 }
 header_func =()=>{
    return(
        <View style ={styles.two_buttom_style}>
        <Text style={{fontSize:10 ,fontWeight:'bold'}}>
               
            </Text>
            <TouchableOpacity onPress = {()=>{alert('hi')}}
            style ={styles.map_style}
            >
                <Entypo name="map" size={20} color="#B99C28" />
              <Text style={{fontSize:10 ,fontWeight:'bold',color:'#B99C28',paddingHorizontal:'2%'}}>
                مشاهدة الخريطة
              </Text>
            </TouchableOpacity>
         
        </View>
    )
 }
 footer_func=()=>{
    return(
        <View style={{marginHorizontal:'5%',height:150}}>

        </View>
    )
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
            <ScrollView horizontal 
            
            style={{height:50, width:'100%'}}
                >
                    {
                    this.state.food_items.map(item =>(
                        <View style={styles.scroll_items}>
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
 
           
        <FlatList 
          ListHeaderComponent={()=>this.header_func()}
          ListFooterComponent={()=>this.footer_func()}
              data={this.state.food_data}
              style={{ width:'100%',backgroundColor:'#F4F6F7'}}
              numColumns={2}  
              
             columnWrapperStyle={{flexDirection:'row-reverse',width:'100%',alignItems:'center',justifyContent:'center',}}
             
              renderItem={(item)=>this.render_item(item)}
              keyExtractor={ item =>item.id}
               />
           
            </View>
        )
    }
 } 
 const styles = StyleSheet.create({
    constainer :{
       backgroundColor:'white'
    },
    search_bar:{
        flexDirection:'row',
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
        marginStart:'10%',
        borderRadius:10,
       paddingStart:'5%',
       paddingEnd:'20%',
       fontSize:14,
       fontWeight:'bold'
       
    
       
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
       backgroundColor:'white'
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
 })