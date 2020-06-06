import React, { useState, useEffect } from "react"
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView, Alert } from "react-native"
import Constants from "expo-constants"
import { useNavigation, useRoute } from "@react-navigation/native"
import { FontAwesome as Icon } from "@expo/vector-icons"
import Emoji from "react-native-emoji"
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"
import api from "../../services/api"


interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface Point {
    id: number;
    name: string;
    image: string;
    image_url: string;
    latitude: number;
    logitude: number;
}

interface Params {
    uf: string;
    city: string;
}


const Points = () => {

    const [items, setItems] = useState<Item[]>([])
    const [selectedItems, setSelectedItems ] = useState<number[]>([])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0])
    const [points, setPoints ] = useState<Point[]>([])


    const navigation = useNavigation()
    const route = useRoute()

    const routeParams = route.params as Params


    useEffect(() => {
        async function loadPoints() {
          const response = await api.get("/points", {
            params: {
              city: routeParams.city,
              uf: routeParams.uf,
              items: selectedItems,
            },
          });
    
          setPoints(response.data);
        }
        loadPoints();
      }, [selectedItems]);

    useEffect(() => {
        async function loadPosition(){
            const {status} = await Location.requestPermissionsAsync()

            if(status !== "granted"){
              Alert.alert("Ah não!", "Precisamos que você permita que para obter a localização")  
              return
            }

            const location = await Location.getCurrentPositionAsync()

            const { latitude, longitude } = location.coords

            setInitialPosition([
                latitude,
                longitude
            ])
        }

        loadPosition()

    }, [])

    useEffect(() => {
        api.get("items").then(res => {
            setItems(res.data)
        })
    }, [])


    function handleNavigateBack() {
        navigation.goBack()
    }

    function handleNavigateToDetial(id: number) {
        navigation.navigate("Detail", {point_id: id})
    }

    function handleSelectItem(id: number) {

        const alreadySelected = selectedItems.findIndex(item => item === id)

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([...selectedItems, id])
        }
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={24} color="rgb(52, 54, 203)" />
                </TouchableOpacity>
                <Text style={styles.title}><Emoji name="smile" style={{ fontSize: 30 }} />  Bem Vindo!</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta de doações!</Text>
                <View style={styles.mapContainer}>
                    {initialPosition[0] !== 0 && (
                        <MapView style={styles.map} initialRegion={{
                            latitude: initialPosition[0],
                            longitude: initialPosition[1],
                            latitudeDelta: 0.014,
                            longitudeDelta: 0.014
                        }} >
                            {points.map(point => (
                                <Marker key={String(point.id)} onPress={() => handleNavigateToDetial(point.id)} style={styles.mapMarker} 
                                coordinate={{
                                    latitude: point.latitude,
                                    longitude: point.logitude,
                                }}>
                                    <View style={styles.mapMarkerContainer}>
                                        <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    ) }
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }} horizontal showsHorizontalScrollIndicator={false}>
                    {items.map(item => (
                        <TouchableOpacity activeOpacity={0.8} key={String(item.id)} style={[styles.item, 
                        selectedItems.includes(item.id) ? styles.selectedItem : {} ]} 
                        onPress={() => handleSelectItem(item.id)}>
                            <Image style={styles.imageitem} source={{ uri: `${item.image_url}` }}></Image>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    title: {
        fontSize: 20,
        fontFamily: 'Raleway_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 15,
        marginTop: 10,
        fontFamily: 'Montserrat_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80,
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: 'rgb(52, 54, 203)',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Montserrat_400Regular',
        color: '#FFF',
        fontSize: 7,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: 'rgb(52, 54, 203)',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Montserrat_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },

    imageitem: {
        width: 60,
        height: 60
    },
});

export default Points