import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchPage from './SearchPage';
import Home from './Home';
import AddFood from './AddFood';




// Placeholder component
const Placeholder = () => <View><Text>Placeholder</Text></View>;

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator 
    initialRouteName="Home"
    screenOptions={{
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'black',
      tabBarShowLabel: false,
      tabBarHideOnKeyboard: true,
      headerShown: false,
      tabBarStyle: [
        {
          height: 100, // Set the height you want for the tab bar
          display: 'flex',
        },
        null,
      ],
    }}
    >
      <Tab.Screen 
        name="Messages" 
        component={Placeholder} 
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Icon name="chatbubble" size={25} color={focused ? '#B99C28' : '#515C5D'} />
              <Text style={{ ...styles.label, color: focused ? '#B99C28' : '#515C5D' }}>الرسائل</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Lists" 
        component={Placeholder} 
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Icon name="list" size={25} color={focused ? '#B99C28' : '#515C5D'} />
              <Text style={{ ...styles.label, color: focused ? '#B99C28' : '#515C5D' }}>القوائم</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
  name="Add" 
  component={AddFood} 
  options={{
    tabBarLabel: "",
    tabBarIcon: ({ focused }) => (
      <View style={styles.iconContainer}>
        <View style={{ ...styles.circle, backgroundColor: '#B99C28' }}>
          <Icon name="add" size={30} color="white" />
        </View>
        <Text style={{ ...styles.label, color: '#515C5D' }}>أكرمها</Text>
      </View>
    ),
  }}
/>

      <Tab.Screen 
        name="Search" 
        component={SearchPage} 
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Icon name="search" size={25} color={focused ? '#B99C28' : '#515C5D'} />
              <Text style={{ ...styles.label, color: focused ? '#B99C28' : '#515C5D' }}>البحث</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Icon name="home" size={25} color={focused ? '#B99C28' : '#515C5D'} />
              <Text style={{ ...styles.label, color: focused ? '#B99C28' : '#515C5D' }}>الرئيسية</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarItem: {
    borderRadius: 13,
    height: 60,
    
  },
  iconContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom : 1,
  },
  
});



export default Tabs;