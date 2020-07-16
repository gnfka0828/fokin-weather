import React from 'react';
import { Alert } from "react-native";
import Loading from "./Loading";
import Weather from "./Weather";
import * as Location from "expo-location";
import axios from "axios";

const API_KEY = "6167954107d055a5c2ae5346ed03458e";

export default class extends React.Component {
  // React.Component 뒤에 () 붙이지 말자.

  state = {
    isLoading: true,
  }

  getWeather = async (latitude, longitude) => {
    const { 
      data : {
        main: { temp },
        weather
      }
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );
    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp
    });
  };

  getLocation = async() => {
    try {
      await Location.requestPermissionsAsync();

      const { 
        coords: { latitude, longitude } 
      } = await Location.getCurrentPositionAsync();

      this.getWeather(latitude, longitude);

    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  }
  
  componentDidMount() {
    this.getLocation();
  }

  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition} />;
  };
}
