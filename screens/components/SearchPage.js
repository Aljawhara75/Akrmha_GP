import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Map from '../components/Map.js'

const SearchPage = () => {
  const [search, setSearch] = useState('');

  const updateSearch = (search) => {
    setSearch(search);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="ابحث عن الطعام"
        onChangeText={updateSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        placeholderTextColor="#515C5D"
        inputStyle={styles.inputStyle}
      />
      {/* Your content goes here */}
      <Map></Map>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,  // Add top margin to move the search bar down
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInputContainer: {
    backgroundColor: '#fff',  
    borderRadius: 10 ,
    height: 45,
    width: '100%',
    borderColor: '#515C5D',  // Border in green
    borderWidth:.5,  // Border width
    borderBottomWidth:.5,  // Border width
  },
  inputStyle: {
    textAlign: 'right',
    color: '#515C5D',
    fontSize: 15,
  },
});

export default SearchPage;