import React from 'react';
import {StatusBar} from "react-native"
import {AppLoading} from "expo"
import {Montserrat_400Regular, Montserrat_500Medium} from "@expo-google-fonts/montserrat"
import {Raleway_700Bold, useFonts} from "@expo-google-fonts/raleway"
import Routes from "./src/routes"


export default function App() {
  const [fontsLoaded] = useFonts ({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Raleway_700Bold
  })

  if(!fontsLoaded){
    return <AppLoading/>
  }

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
    <Routes/>
    </>
  );
}

