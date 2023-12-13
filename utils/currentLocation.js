import * as Location from "expo-location";

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    const location = await Location.getCurrentPositionAsync();
 
    const { latitude, longitude } = location.coords;
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    return newRegion

  } catch (error) {
    console.error('Error getting current location:', error);
    // You may want to handle errors gracefully in your application
    return null; // or another appropriate value to indicate an error
  }
};

