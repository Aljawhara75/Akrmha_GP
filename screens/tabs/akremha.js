import React,{Component}  from "react";
import { StyleSheet, Text, View  ,TextInput ,TouchableOpacity,TouchableHighlight,SafeAreaView,ScrollView,I18nManager ,Platform} from 'react-native';
import { BottomSheet , RadioGroup, RadioButtonProps ,RadioButton} from "react-native-btr";
import { Feather,AntDesign ,FontAwesome5 ,MaterialIcons ,MaterialCommunityIcons ,Entypo,
  Fontisto
} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from 'expo-image-picker';
import MapView from 'react-native-maps';
import * as Linking from 'expo-linking';
 export default class Akremha extends Component {
  constructor(props){
    super(props)
        this.state={
           
             time :'',
            visible:true,
            time_visble:true,
            food_type:'',
            open: false,
            time_open:false,
            image_open:false,
            value: null,
            time_value:null,
            quantity_number:0,
            end_date: new Date(),
   show_picker:false,
   mood:'',
   uri:'',
   selected_uri:false,
            food_items :[{   label : 'منزلي ',value:'8'}, 
            {label :'مطاعم',value:'1', },
            {label :'خضراوات و فواكه', value:'2'},
            {label :'مشتقات الالبان',value:'3'},
            {label :'اللحوم',value:'4'},
            {label :'معلبات',value:'5'},
            {label :'مخبوزات',value:'6'},
            {label :'المشروبات',value:'7'},],
            time_items:[{ label :'12:00 صباحا', value:'1' },
            { label :'3:00 صباحا', value:'2' },
              { label :'6:00 صباحا', value:'3' },
            { label :'9:00 صباحا', value:'4' },
            { label :'12:00 مساءً', value:'5' },
            { label :'3:00 مساءً', value:'6' },
            { label :'6:00 مساءً', value:'7' },
            { label :'9:00 مساءً', value:'8' },],
            selected_radio:'',
            yes_selected:false,
            no_selected:true,
            maybe_selected:false,
            camera_options :[{   label : 'التقاط صورة من الكامرة ',value:'1'}, 
            {label :'اختيار صورة من المعرض',value:'2', },
            ],
            image_value:'ارفاق صور العرض',
            platform:Platform.OS === 'ios'?true:false,
        
        }
      // I18nManager.allowRTL(true);
     // I18nManager.forceRTL(true);
     // I18nManager.isRTL()
        this.setValue = this.setValue.bind(this);
        this.time_setValue = this.time_setValue.bind(this);
      }
       pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images = "Images",
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
        });
   
        if (!result.canceled) {
        
          this.setState({uri:result.assets[0].uri ,selected_uri:true,image_value:"تم ارفاق الصور بنجاح"})
        }
      };
      select_image = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images = "Images",
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
        });
   
        if (!result.canceled) {
        
          this.setState({uri:result.assets[0].uri ,selected_uri:true,image_value:"تم ارفاق الصور بنجاح"})
        }
      };
      go_tolink =()=>{
        Linking.openURL('https://www.moh.gov.sa/awarenessplateform/HealthyLifestyle/Documents/Food-Allergy.pdf');
      
      }

  toggle =()=>{
    //this.setState({visible:!this.state.visible})
  //  this.props.navigation.goBack()
  this.props.navigation.replace('tabs')
  }
  time_toggle =()=>{
    this.setState({time_visble:!this.state.time_visble})
  }
 
  setOpen(open) {
    this.setState({
      open
    });
  }
 time_setOpen(time_open) {
    this.setState({
      time_open
    });
  }

  setValue(callback) {
    this.setState(state => ({
      value: callback(state.value)
    }));
  }

  time_setValue(callback) {
    this.setState(state => ({
      time_value: callback(state.time_value)
    }));
  }

  setItems(callback) {
    this.setState(state => ({
      //food_items: callback(state.items)
      food_type: callback(state.items)
    }));
  }
  time_setItems(callback) {
    this.setState(state => ({
      time_items: callback(state.items)
    }));
  }
  onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    this.setState({show_picker:false,end_date:currentDate})
  };

   showMode = (currentMode) => {
    this.setState({show_picker:true,mood:currentMode})
   
  };

   showDatepicker = () => {
   // showMode('date');
    this.setState({mood:'data'})
  };
componentDidMount(){
 // this.setState({visible:true})
}
componentWillUnmount(){

}

    render() {

        return(
            <SafeAreaView > 
               <BottomSheet
        visible={true}
        onBackButtonPress={ ()=>this.toggle()}
        onBackdropPress={()=>this.toggle()}
      >
          
        <View style={styles.card}>
        <ScrollView
         key={1} style={styles.card_1}>
           <View key={1}>
       
         <View style={styles.header} >
          <View>
          <Text style={{fontSize:16,fontWeight:'800',textAlign:'right',}}>
            اضافة طعام
          </Text>
          <Text style={{fontSize:8,marginTop:'2%'}}>
            صلاحية العرض 24 ساعة فقط ومن ثم سيتم الغاء العرض تلقائيا
          </Text>
          </View>
          <Feather name="x-square" size={24} color="black" style={styles.icon} 
             onPress={()=>{ 
                     this.props.navigation.replace('tabs')}}    />
         </View>
         <View style={{marginTop:'5%',width:'100%',textAlign:'right'}} >
          <Text style={{fontSize:12,fontWeight:'600',width:'90%',marginHorizontal:'5%',textAlign:'right'}}>
            اسم العرض <Text style={{color:'red'}}>*</Text>
          </Text>
          <TextInput placeholder=" رز بالدجاج ومعكرونة"
                
                onChangeText={(value)=>{this.setState({food_type:value})}}
                
           style ={styles.search_input}
            />
         </View>
         <View style={{marginTop:'5%',width:'100%'}} >
          <Text style={{fontSize:12,fontWeight:'600',width:'90%',marginHorizontal:'5%',textAlign:'right'}}>
            نوع الطعام  <Text style={{color:'red'}}>*</Text>
          </Text>
          <DropDownPicker
         
            listItemContainerStyle={{backgroundColor:'red',width:'100%'}}
            // listItemLabelStyle ={{backgroundColor:'green',justifyContent:'center'}}
             listParentContainerStyle={{backgroundColor:'white',justifyContent:'center',
             alignItems:'center'}}
             dropDownContainerStyle={{width:'90%',marginHorizontal:'5%',
             top:0,
             marginBottom:'10%',
             position:'relative'}}
              style={styles.dropdown}
              open={this.state.open}
              value={this.state.value} //genderValue
              items={this.state.food_items}
              setOpen={ ()=>this.setState({open:false})}
              setValue={this.setValue}
             setItems={this.setItems}
              placeholder=" حدد نوع الطعام"
              placeholderStyle={styles.placeholderStyles}
              onOpen={()=>this.setState({open:!this.state.open,time_open:false})}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
        }}
        itemKey="value"
            //  onChangeValue={onChange}
            //  zIndex={3000}
             // zIndexInverse={1000}
            />
         </View>
         <View style={{marginTop:'5%',width:'100%',}} >
          <Text style={{fontSize:12,fontWeight:'600',width:'90%',marginHorizontal:'5%', textAlign:'right'}}>
            وصف الطعام  <Text style={{color:'gray'}}>(اختياري)</Text>
          </Text>
          <TextInput placeholder=" يرجى توضيح الطعام ووصفه بشكل مفصل ,مثل المكونات والنكهات والمدة "
                
                onChangeText={(value)=>{this.setState({food_type:value})}}
                
           style ={styles.search_input_2}
            />
         </View>
         <View style={{marginTop:'5%',width:'100%'}} >
         <Text style={{fontSize:12,fontWeight:'600',width:'90%',marginHorizontal:'5%',textAlign:'right'}}>
            الكمية المتاحة   <Text style={{color:'red'}}>*</Text>
          </Text>
        <View style={{flexDirection:"row-reverse",justifyContent:'flex-start',alignItems:'center',width:'80%',marginHorizontal:'10%',marginTop:'3%'}}>
          < TouchableOpacity
          onPress={()=>this.setState({quantity_number:this.state.quantity_number+1})}
           style={{width:30,height:30,justifyContent:'center',
           alignItems:'center',backgroundColor:'#B99C28',borderRadius:100}}>
          <AntDesign name="plus" size={15} color="white"  />
          </TouchableOpacity>
          <Text style={{paddingHorizontal:'5%'}}>
            {this.state.quantity_number}
          </Text>
          <TouchableOpacity 
          onPress={()=>{if(this.state.quantity_number !=0){
            this.setState({quantity_number:this.state.quantity_number - 1})}}
          }
           
          style={{width:30,height:30,justifyContent:'center',
          alignItems:'center',backgroundColor:'#E5E7E9',borderRadius:100,borderColor:'black'}}>
          <AntDesign name="minus" size={15} color="black" />
          </TouchableOpacity>
          
        </View>
         </View>
         <View style={{marginTop:'5%',width:'100%'}}>
          <View style={{flexDirection:"row-reverse",alignItems:'center',
          justifyContent:'space-between',width:'90%',marginHorizontal:'5%'}}>
            <View style={{width:'45%',}}>
            <Text style={{fontSize:12,fontWeight:'600',paddingHorizontal:'3%',textAlign:'right'}}>
            تاريخ الانتهاء   <Text style={{color:'red'}}>*</Text>
          </Text>
            </View>

            <View style={{width:'45%',}}>
          <Text style={{fontSize:12,fontWeight:'600',textAlign:'right'}}>
            وقت الاستلام   <Text style={{color:'red'}}>*</Text>
          </Text>
          </View>
          </View>

        <View style={{flexDirection:"row",alignItems:'center',justifyContent:"space-between",
        width:'90%',marginTop:'1%',marginHorizontal:'4%',}}>
        <View style={{width:'45%',marginHorizontal:'3%'}}>
            <DropDownPicker
              style={styles.recive_time_style}
              open={this.state.time_open}
               listItemContainerStyle={{backgroundColor:'red',justifyContent:'center',alignItems:'center',width:'100%'}}
              // listItemLabelStyle ={{backgroundColor:'green',justifyContent:'center'}}
               listParentContainerStyle={{backgroundColor:'white',justifyContent:'center',alignItems:'center'}}
               dropDownContainerStyle={{width:180,justifyContent:'center',alignItems:'center',position:'relative',top:0}}
              value={this.state.time_value} //genderValue
              items={this.state.time_items}
              setOpen={ ()=>this.setState({time_open:false})}
              setValue={this.time_setValue}
             setItems={this.time_items}
              placeholder=" حدد وقت الاستلام "
              placeholderStyle={styles.placeholderStyles}
              listMode="SCROLLVIEW"
              itemKey="value"
              scrollViewProps={{
                nestedScrollEnabled: true,
        }}
              onOpen={()=>this.setState({time_open:!this.state.time_open,open:false})}
            //  onChangeValue={onChange}
            //  zIndex={3000}
             // zIndexInverse={1000}
            /> 
          </View>
          <View  style={{width:'45%',marginHorizontal:'3%'}}>
          { this.state.platform ?  <TouchableOpacity
       // onPress={()=>{ this.showMode()}}
        style ={styles.end_data}>
          <View style={{flexDirection:"row",justifyContent:'space-between',width:'100%'}}>
            <Entypo name="chevron-small-down" size={28} color="black" />
          <SafeAreaView>
        <DateTimePicker
          testID="dateTimePicker"
          value={this.state.end_date}
          mode={this.state.mood}
         // is24Hour={true}
        onChange={this.onChange}
          style ={{justifyContent:'center',alignItems:'center',}}
        /> 
        </SafeAreaView>
 
       
          </View>
       
        </TouchableOpacity>  : <TouchableOpacity
        onPress={()=>{ this.showMode()}}
        style ={styles.end_data}>
          <View style={{flexDirection:"row",justifyContent:'space-between',width:'100%'}}>
            <Entypo name="chevron-small-down" size={28} color="black" />
        <TextInput
        style={{fontSize:14,color:'black'}}
        placeholder=" حدد تاريخ الانتهاء  "
        value={this.state.end_date.toLocaleDateString()}
        editable={false}
         />
 
       
          </View>
       
        </TouchableOpacity>

          }
      
       </View>
        
       
          </View> 
        
      
         </View>
         {this.state.platform?null:this.state.show_picker && (
         <SafeAreaView>
        <DateTimePicker
          testID="dateTimePicker"
          value={this.state.end_date}
         // mode={this.state.mood}
         // is24Hour={true}
        onChange={this.onChange}
          style ={{justifyContent:'center',alignItems:'center',}}
        />
        </SafeAreaView>
      )
  
         }
     
     

         <View style={{marginTop:'5%',width:'100%'}} key={7}>
          <Text style={{fontSize:12,fontWeight:'600',width:'90%',marginHorizontal:'5%',textAlign:'right'}}>
            مكان الاستلام   <Text style={{color:'gray'}}>(اختياري)</Text>
          </Text>
          <MapView style={styles.map} 
             initialRegion={{
                latitude: 24.774265,
                longitude: 46.738586,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
           />
         </View >
      
         <View style={{marginTop:'3%',width:'100%',}} >
          <Text style={{fontSize:12,fontWeight:'600',width:'90%',marginHorizontal:'5%',textAlign:'right'}}>
            ارفاق الصور   <Text style={{color:'red'}}>*</Text>
          </Text>
          <DropDownPicker
                 listItemContainerStyle={{backgroundColor:'red',justifyContent:'center',alignItems:'center',width:'100%'}}
              // listItemLabelStyle ={{backgroundColor:'green',justifyContent:'center'}}
               listParentContainerStyle={{backgroundColor:'white',justifyContent:'center',alignItems:'center'}}
               dropDownContainerStyle={{width:'90%',position:'relative',top:0,left:20,}}
              style={styles.dropdown}
                
              open={this.state.image_open}
              value={this.state.image_value} //genderValue
              items={this.state.camera_options}
              setOpen={ ()=>this.setState({image_open:false})}
             
             onSelectItem={(item)=>{
              if(item.value=='2'){
                this.select_image()
              }
              else{
                this.pickImage()
              }

             }}
              placeholder= {this.state.image_value}
         placeholderStyle={styles.placeholderStyles}
           
              onOpen={()=>this.setState({image_open:!this.state.open,time_open:false,open:false})}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
        }}
        itemKey="value"
            //  onChangeValue={onChange}
            //  zIndex={3000}
             // zIndexInverse={1000}
            />
         </View>
         <View   style={{flexDirection:"row-reverse",justifyContent:'center',alignItems:'center',width:'90%',marginHorizontal:'5%',marginTop:'7%'}}>
             <Text style={{fontSize:12,fontWeight:'600',}}>
            هل يحتوي الطعام على مسببات الحساسية ؟       
          </Text>
          <TouchableHighlight onPress={()=>this.go_tolink()}>
            <Text style={{fontSize:12,fontWeight:'400',color:'#2E86C1'}}>
              الاطلاع على مسببات الحساسية
            </Text>
          </TouchableHighlight>

         </View>
         <View style={{alignItems:'center',marginTop:'3%',justifyContent:'flex-start'}} >
         <RadioButton
         value="1"
         label="نعم"
         onPress={()=>{
          this.setState({yes_selected:true,no_selected:false,maybe_selected:false,selected_radio:'1'})
         }

        }
         selected={this.state.yes_selected}
          containerStyle={styles.radio_button_style}
          labelStyle={{paddingHorizontal:'2%'}}
        />
          <RadioButton
         value="1"
         label="لا"
         onPress={()=>{
          this.setState({yes_selected:false,no_selected:true,maybe_selected:false,selected_radio:'2'})
         }

        }
         selected={this.state.no_selected}
          containerStyle={styles.radio_button_style}
          labelStyle={{paddingHorizontal:'2%'}}
        />
            <RadioButton
         value="3"
         label="ربما"
         selected={this.state.maybe_selected}
         onPress={()=>{
          this.setState({yes_selected:false,no_selected:false,maybe_selected:true,selected_radio:'3'})
          
         }

        }
          containerStyle={styles.radio_button_style}
          labelStyle={{paddingHorizontal:'2%'}}
        />
         </View>
       
      <TouchableOpacity style={styles.selection_style} onPress={()=>this.props.navigation.replace('after_add')} key={11}>
        <Text style={{color:'white'}}>
          ارسال
        </Text>
      </TouchableOpacity>
      </View>
         </ScrollView>
        </View>
        
      </BottomSheet>
         
            </SafeAreaView>
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
flexDirection:'row-reverse',
width:'90%',
marginHorizontal:'5%',
marginTop:'5%',
justifyContent:'space-between',
alignItems:'center'
  },
  card : {
    backgroundColor: "#fff",
    height: '95%',
 justifyContent: "center",
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
  icon:{
        
    justifyContent:'center',alignItems:'center',
    borderColor:'#B99C28' 
},
search_input :{
        

  backgroundColor:'white',
  borderWidth:0.8,
  marginTop:'5%',
  height:50,
  width:'90%',
  marginHorizontal:'5%',
  borderRadius:5,
 // paddingTop:'2%',
  paddingHorizontal:'3%',
  textAlign:'right',
 fontSize:10,

},
dropdown: {
  backgroundColor:'white',
  borderWidth:0.5,
  width:'90%',
flexDirection:'row-reverse',
  //height:20,
  marginHorizontal:'5%',
  borderRadius:5,
  marginTop:'4%',
  //paddingStart:'3%',
 fontSize:10,
alignSelf:'flex-end'
},
placeholderStyles: {
  color: "grey",
  fontSize:12,
  padding:'2%',
  textAlign:'right',
  
},
icno_style:{
  lineHeight:20
}
,
search_input_2 :{
        
  
  backgroundColor:'white',
  
  borderWidth:0.5,
  height:90,
  width:'90%',
  marginHorizontal:'5%',
  marginTop:'5%',
  borderRadius:5,
   paddingBottom:'10%',
  paddingHorizontal:'5%',
 textAlign:'right',
  
 fontSize:10,

},
end_data : {
  backgroundColor:'white',
  paddingHorizontal:'3%',
 // marginHorizontal:'3%',
  borderWidth:0.5,
  height:48,
 // position:'relative',
  //marginRight:200,
// right:5,
 // position:'absolute',

 //top:1,
  width:'100%',//marginEnd:100,
  borderRadius:5,
  marginTop:'2%',
  alignItems:'center',
  justifyContent:'center',
  fontSize:10,
},
recive_time_style :{
  borderWidth:0.5,
  width:'100%',
   // height:20,
  //marginHorizontal:'3%',
  //  marginEnd:'55%',
  flexDirection:"row-reverse",
  borderRadius:5,
  marginTop:'2%',
 fontSize:10,
},
map: {
  marginTop:'5%',
  width: '90%',
  marginHorizontal:'5%',
  height: 120,
},
pick_image : {
  backgroundColor:'white',
  borderWidth:0.5,
  height:50,
  width:'90%',
 marginHorizontal:'5%',
 paddingHorizontal:'3%',
  borderRadius:5,
  marginTop:'4%',
 
  alignItems:'center',
  justifyContent:'center',
  

 fontSize:10,
},
radio_button_style:{
  width:'100%',
 //marginHorizontal:'5%',
 paddingHorizontal:'5%',
  alignItems:'center',
  flexDirection:"row-reverse"
 
  //flexDirection:''
 
},
label_style:{
  justifyContent:'flex-start'
},
selection_style:{
  width:'90%',height:50,
  marginHorizontal:'5%',
    backgroundColor:'#B99C28',
  justifyContent:'center',alignItems:'center',
  borderRadius:10,
 marginVertical:'5%'

}
})