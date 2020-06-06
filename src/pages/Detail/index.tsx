import React, {useEffect, useState} from "react"
import { View, TouchableOpacity, StyleSheet, Image, Text, Linking } from "react-native"
import { FontAwesome as Icon } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import Constants from "expo-constants"
import {RectButton} from "react-native-gesture-handler"
import api from "../../services/api"
import * as MailComposer from "expo-mail-composer"

interface Params {
    point_id: number
} 

interface Data {
    point: {
        image: string;
        image_url: string;
        name: string; 
        wpp: string;
        email: string;
        city: string;
        uf: string;
        num: number;
    }
    items: {
       title: string;
    }[]
    
}


const Detail = () => {
    const [data, setData] =  useState<Data>({} as Data)
    const navigation = useNavigation()
    const route = useRoute()

    const routesParams = route.params as Params

    useEffect(() => {
        api.get(`points/${routesParams.point_id}`).then(res => {
            setData(res.data)
        })
    }, [])

    function handleWhatsapp(){
      Linking.openURL(`whatsapp://send?phone=${data.point.wpp}&text=Ei! Vi que você está coletando alguns itens para doação, também quero doar!`)  
    } 

    function handleNavigateBack() {
        navigation.goBack()
    }

    function handleComposeMail(){
        MailComposer.composeAsync({
            subject: "Ei! Vi que você está coletando alguns itens para doação, também quero doar!",
            recipients: [data.point.email]
        })
    }


    if(!data.point) {
        return null
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={24} color="rgb(52, 54, 203)" />
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: data.point.image_url }} />
                <Text style={styles.pointName}>{data.point.name}</Text>
                <Text style={styles.pointItems}>{data.items.map(item => item.title).join(", ")}</Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço:</Text>
                    <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}, nº {data.point.num}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <Icon name="whatsapp" size={20} color="#fff" />
                    <Text style={styles.buttonText}>WhatsApp</Text>
                </RectButton>

                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name="envelope" size={20} color="#fff" />
                    <Text style={styles.buttonText}>E-Mail</Text>
                </RectButton>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    pointImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 32,
    },

    pointName: {
        color: '#322153',
        fontSize: 35,
        fontFamily: 'Raleway_700Bold',
        marginTop: 24,
    },

    pointItems: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 20,
        lineHeight: 24,
        marginTop: 8,
        color: '#34CB79'
    },

    address: {
        marginTop: 70,
    },

    addressTitle: {
        color: '#322153',
        fontFamily: 'Montserrat_500Medium',
        fontSize: 25,
    },

    addressContent: {
        fontSize: 18,
        fontFamily: 'Montserrat_400Regular',
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#999',
        paddingVertical: 20,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    button: {
        width: '48%',
        backgroundColor: 'rgb(52, 54, 203)',
        borderRadius: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        marginLeft: 8,
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Montserrat_500Medium',
      },
    
})

export default Detail