import React, { useState , useContext} from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Button ,Alert
} from 'react-native'
import { addDoc, collection } from 'firebase/firestore'
import { db } from './firebase'
import { AntDesign } from '@expo/vector-icons'
import { StyleSheet } from 'react-native';
import { EvilIcons } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import Dropdown from '../components/Dropdown';
import { RadioButton } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebase';
import * as Location from 'expo-location';
import { VirtualizedList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Tabs from './Tabs'
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../contexts/auth';




const states = [
  { key: 'منزلي', value: 'منزلي' },
  { key: ' مطاعم', value: ' مطاعم' },
  { key: 'خضروات', value: 'خضروات' },
  { key: 'فواكه', value: 'فواكه' },
  { key: 'مشروبات', value: 'مشروبات' },
  { key: 'معلبات', value: 'معلبات' },
  { key: 'مخبوزات', value: 'مخبوزات' },
]



function AddFood({ navigation: propNavigation }) {

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };
  const showDatepicker = () => {
    setShowDatePicker(true);
  };
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
const [type, setType] = useState('');
const [description, setDescription] = useState('');
const [quantity, setQuantity] = useState('');
const [preparation, setPreparation] = useState('');
// const [receive, setReceive] = useState('');
const [location, setLocation] = useState('');
const [image, setImage] = useState(null);

const [errors, setErrors] = useState({
  title: '',
  type: '',
  description: '',
  quantity: '',
  preparation: '',
//   receive: '',
  location: '',
  image: '',
});

const pickImage = async () => {
  Alert.alert(
    'Choose an option',
    'Would you like to take a photo or choose from the library?',
    [
      {
        text: 'Take Photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            alert('Camera permission is required to take photos.');
            return;
          }

          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          if (!result.cancelled) {
            setImage(result.uri);
          }
        },
      },
      {
        text: 'Choose from Library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Camera roll permission is required to choose photos.');
            return;
          }

          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          if (!result.cancelled) {
            setImage(result.uri);
          }
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    { cancelable: true }
  );
};



  const submitHandler = async () => {
    
    console.log("submitHandler is called");
  
    // Debug logs to check the values of the fields
    console.log("Debugging field values:");
    console.log("title:", title);
    console.log("type:", type);
    console.log("description:", description);
    console.log("quantity:", quantity);
    console.log("preparation:", preparation);
    // console.log("receive:", receive);
    console.log("location:", location);
    console.log("image:", image);
    
    const newErrors = {};
    if (title && type && quantity && preparation && location && image) {
      try {
        console.log("Attempting to add document to Firestore"); // Debug log
        await addDoc(collection(db, 'AddFood'), {
          title,
          type,
          description,
          quantity,
          preparation,
        //   receive,
          location,
          image,
        });
        console.log("Document successfully added to Firestore"); // Debug log
  
        // Reset form fields
        setTitle('');
        setType('');
        setDescription('');
        setQuantity('');
        setPreparation('');
        // setReceive('');
        setLocation('');
        setImage('');
  
        alert('تم اضافه الطعام بنجاح');
      } catch (e) {
        console.error('Error adding document: ', e);
        alert('An error occurred. Please try again.');
      }
    } else {
      setErrors({
        ...errors,
        ...newErrors,
        title: title ? '' : 'اسم العرض *',
        type: type ? '' : 'نوع الطعام *',
        description: description ? '' : 'وصف الطعام *',
        quantity: quantity ? '' : 'الكمية *',
        preparation: preparation ? '' : 'طريقة التحضير *',
        // receive: receive ? '' : 'طريقة الاستلام *',
        location: location ? '' : 'الموقع *',
        image: image ? '' : 'صورة الطعام *',
      });
      console.log('Form validation errors: ', errors);
    }
  };
  

      
      return (
        
        <ScrollView style={styles.contentContainer}>
    <TouchableOpacity
      style={{
        position: 'absolute',
        top: 50,
        left: 10,
        zIndex: 1,
      }}
      onPress={() => navigation.navigate('Home')}
    >
      <AntDesign name="close" size={24} color="black" />
    </TouchableOpacity>
            <Text style={styles.header}>إضافه طعام</Text>
            <Text style={{ textAlign: 'right', paddingRight: 10 }}>صلاحيه العرض 24 ساعه فقط و من ثم سيتم الغاء العرض تلقائياً</Text>


      <View style={styles.form}>
            <Text
          style={{ ...styles.label, color: !!errors.title ? 'red' : '#515C5D' }}
        >
          {!!errors.title ? errors.title : 'اسم العرض '}
          {!!!errors.title && <Text style={{ color: 'red' }}>*</Text>}
        </Text>
        <View
          style={{
            ...styles.field,
            borderColor: !!errors.title ? 'red' : '#ccc',
          }}
        >
         
         
          <TextInput
            style={styles.input}
            placeholder='اسم العرض'
            onChangeText={(text) => {
              setTitle(text)
              setErrors({
                ...errors,
                title: '',
              })
            }}
            value={title}
          />
        </View>
                <Text
          style={{ ...styles.label, color: !!errors.type ? 'red' : '#515C5D' }}
        >
          {!!errors.type ? errors.type : 'نوع الطعام '}
          {!!!errors.type && <Text style={{ color: 'red' }}>*</Text>}
        </Text>
        <View
          style={{
            ...styles.field,
            justifyContent: 'space-between',
            paddingRight: 30,
            position: 'relative',
            borderColor: errors.type ? 'red' : '#ccc',
          }}
        >
          <View
            style={{ display: 'flex', flexDirection: 'row-reverse', gap: 10 }}
          >
            <Text
              style={{
                color: '#515C5D',
              }}
            >
              {type ? type : 'نوع الطعام'}
            </Text>
          </View>
          <Dropdown
           label='Select Item'
           data={states}
           onSelect={(value) => {
             setType(value);
             setErrors({
               ...errors,
               type: '',
             });
           }}
         />
       </View>
       <Text style={styles.label}>
  وصف الطعام
</Text>
<View style={styles.field}>
  <TextInput
    style={styles.input}
    placeholder='وصف الطعام'
    onChangeText={(text) => setDescription(text)}
    value={description}
  />
</View>

        <Text
          style={{ ...styles.label, color: !!errors.quantity ? 'red' : '#515C5D' }}
        >
          {!!errors.quantity ? errors.quantity : 'الكمية '}
          {!!!errors.quantity && <Text style={{ color: 'red' }}>*</Text>}
        </Text>
        <View
          style={{
            ...styles.field,
            borderColor: !!errors.quantity ? 'red' : '#ccc',
          }}
        >
         
         
          <TextInput
            style={styles.input}
            placeholder='الكمية'
            onChangeText={(text) => {
              setQuantity(text)
              setErrors({
                ...errors,
                quantity: '',
              })
            }}
            value={quantity}
          />

        </View>
        <Text
          style={{ ...styles.label, color: !!errors.preparation ? 'red' : '#515C5D' }}
        >
          {!!errors.preparation ? errors.preparation : 'طريقه التحضير '}
          {!!!errors.preparation && <Text style={{ color: 'red' }}>*</Text>}
        </Text>
        <View
          style={{
            ...styles.field,
            borderColor: !!errors.preparation ? 'red' : '#ccc',
          }}
        >
         
         
          <TextInput
            style={styles.input}
            placeholder='طريقه التحضير'
            onChangeText={(text) => {
              setPreparation(text)
              setErrors({
                ...errors,
                preparation: '',
              })
            }}
            value={preparation}
          />
        </View>

        <Text style={styles.label}>Select Date</Text>
      <View style={styles.field}>
        <TouchableOpacity onPress={showDatepicker} style={styles.input}>
          <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}
     
    {/* ...existing c
        {/* <Text
          style={{ ...styles.label, color: !!errors.receive? 'red' : '#515C5D' }}
        >
          {!!errors.receive ? errors.receive : 'طريقه الاستلام '}
          {!!!errors.receive && <Text style={{ color: 'red' }}>*</Text>}
        </Text>
        <View
          style={{
            ...styles.field,
            borderColor: !!errors.receive ? 'red' : '#ccc',
          }}
        >
         
         
          <TextInput
            style={styles.input}
            placeholder='طريقه الاستلام'
            onChangeText={(text) => {
              setReceive(text)
              setErrors({
                ...errors,
                receive: '',
              })
            }}
            value={receive}
          />
        </View> */}

<Text
  style={{ ...styles.labelPhoto, color: !!errors.image ? 'red' : '#515C5D' }}
>
  {!!errors.image ? errors.image : 'صورة الطعام '}
  {!!!errors.image && <Text style={{ color: 'red' }}>*</Text>}
</Text>
<View
  style={{
    ...styles.fieldPhoto,
    borderColor: !!errors.image ? 'red' : '#ccc',
    flexDirection: 'column', // Changed to column to stack items vertically
    alignItems: 'center', // Center items horizontally
  }}
>
  {image ? (
    <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 10 }} />
  ) : (
    <View style={{  marginBottom: 10  }} />
  )}
  <Button title="اضافه صوره" onPress={pickImage} />
</View>





                <View style={styles.inputContainer}>
                    <Text style={styles.label}>الموقع</Text>
                    <TextInput

                        style={styles.input}
                        placeholder="الموقع"
                        placeholderTextColor="#515C5D"
                        value={location}
                        onChangeText={setLocation}
                    />
                    <Text style={styles.error}>{errors.location}</Text>
                </View>

                </View>
                <TouchableOpacity style={styles.button} onPress={submitHandler}>
                    <Text style={styles.buttonText}>اضافة</Text>
                </TouchableOpacity>
           
        </ScrollView>
        

      )
    }//end of AddFood

export default AddFood

const styles = StyleSheet.create({
    contentContainer: {
      flex: 1,
      backgroundColor: 'white',
     
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'right',
      marginVertical: 30,
        marginHorizontal: 10,
        marginTop: 55, 
    },
    form: {
      paddingHorizontal: 20,
    },
    label: {
      fontSize: 15,
      color: '#515C5D',
      marginBottom: 5,
      textAlign: 'right',
    },
    labelPhoto: {
      fontSize: 15,
      color: '#515C5D',
      marginBottom: 5,
      textAlign: 'right',
    },
    required: {
      color: 'red',
    },
    field: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      marginBottom: 20,
      flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Add space between items
    height: 40,
    
    },
    fieldPhoto: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      marginBottom: 20,
      flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Add space between items
    },
    
    input: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      textAlign: 'right',
      direction: 'rtl', 
    },
    button: {
      backgroundColor: '#B99C28',
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 15,
      fontWeight: 'bold',
    },
  });
  