import React, {useState} from "react"
import { FontAwesome as Icon } from "@expo/vector-icons";
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"

const Home = () => {
  const [uf, setUf] = useState("")
  const [city, setCity] = useState("")

  const navigation = useNavigation()

  function handleNavigateToPoints() {
    navigation.navigate("Points", {
      uf,
      city,
    })
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : undefined }>
      <ImageBackground source={require("../../assets/biglogo.png")} style={styles.container} imageStyle={{ width: 350, height: 800, opacity: 0.2 }}>
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
          <Text style={styles.title}>Seu Martkplace de coleta de Doações</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos para realizar sua doação de forma eficiente</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TextInput style={styles.input} placeholder="Digite Seu Estado (Apenas a UF)" value={uf} onChangeText={setUf} maxLength={2} autoCapitalize="characters" autoCorrect={false} />
          <TextInput style={styles.input} placeholder="Digite Sua Cidade" value={city} onChangeText={setCity} autoCorrect={false}/>

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Raleway_700Bold',
    maxWidth: 260,
    marginTop: 72,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Montserrat_400Regular',
    maxWidth: 300,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: 'rgb(52, 54, 203)',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 16,
  }
});




export default Home