import React,{Component}  from "react";
import { StyleSheet, Text, View  ,TextInput ,TouchableOpacity,Image} from 'react-native';

 export default class Splash extends Component {
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
   
componentDidMount(){
    setTimeout(() => {
        this.props.navigation.replace('onboarding')
      }, 2000);
}




    render() {

        return(
            <View  style={{ flex: 1, alignItems: "center", justifyContent: "center" ,backgroundColor:'#F7F9F9'}}> 
   
  
        <Image
          style={{
            width: 800,
            height: 300,
          
          
          }}
          source={require("../../images/application_image/spalsh.jpg")}
        />
        <Text
          style={{
            fontSize: 18,
            color: "#707070",
            fontWeight: "bold",
            marginTop:'10%'
          
          }}
        >
          وَكُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا ۚ إِنَّهُ لَا يُحِبُّ
          الْمُسْرِفِينَ
        </Text>
   
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