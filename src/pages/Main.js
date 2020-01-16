import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons'

const Main = (props) => {
    const [currentRegion, setCurrentRegion] = useState(null)

    useEffect(() => {
        const loadInitialPosition = async () => {
            const { granted } = await requestPermissionsAsync();

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                });
                const { latitude, longitude } = coords;
                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                })
            }
        }
        loadInitialPosition();
    }, []);

    if (!currentRegion) {
        return null;
    }




    return (
        <React.Fragment>
            <MapView initialRegion={currentRegion} style={styles.map}>
                <Marker coordinate={{ latitude: -23.4882244, longitude: -46.478351 }}>
                    <Image style={styles.avatar} source={{ uri: 'https://avatars3.githubusercontent.com/u/26292657?s=460&v=4' }} />
                    <Callout onPress={() => {
                        (
                            props.navigation.navigate('Profile', { github_username: 'samuel2412' })
                        )
                    }}>
                        <View style={styles.callout}>
                            <Text style={styles.devName}>Samuel Alves</Text>
                            <Text style={styles.devBio}>Frontend Developer | Java Developer</Text>
                            <Text style={styles.devTechs}>ReactJs, React Native, Node.js</Text>
                        </View>
                    </Callout>

                </Marker>
            </MapView>
            <View style={styles.searchForm}>
                <TextInput
                    style={styles.serachInput}
                    placeholder="Buscar devs por techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                />
                <TouchableOpacity onPress={() => { }} style={styles.loadButton}>
                    <MaterialIcons name="my-location" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },
    callout: {
        width: 260,
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    devBio: {
        color: '#666',
        marginTop: 5,
    },
    devTechs: {
        marginTop: 5,
    },
    searchForm: {
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },
    serachInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        elevation: 2,

    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 15,

    }

});

export default Main;