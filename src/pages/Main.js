import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import {connect,disconnect,subscribeToNewDevs} from '../services/socket';

const Main = (props) => {
    const [currentRegion, setCurrentRegion] = useState(null);
    const [devs, setDevs] = useState([]);
    const [techs,setTechs] = useState('');

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

    useEffect(()=>{
        subscribeToNewDevs(dev => setDevs([...devs,dev]));
    },[devs])

    const handleRegionChange = (region) => {
        setCurrentRegion(region)
    }

    const setupWebsocket = () =>{
        disconnect();
        const { latitude, longitude } = currentRegion;

        connect(
            latitude,
            longitude,
            techs
        );
    }

    const loadDevs = () => {
        const { latitude, longitude } = currentRegion;

        api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        })
            .then(response => {
                setDevs(response.data.devs);
                setupWebsocket();
            })
            .catch(err => {

            })
    }

    if (!currentRegion) {
        return null;
    }




    return (
        <React.Fragment>
            <MapView onRegionChangeComplete={handleRegionChange} initialRegion={currentRegion} style={styles.map}>

                {devs.map(dev => (
                    <Marker
                        key={dev._id}
                        coordinate={{
                            latitude: dev.location.coordinates[1],
                            longitude: dev.location.coordinates[0]
                        }}>
                        <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
                        <Callout onPress={() => {
                            (
                                props.navigation.navigate('Profile', { github_username: dev.github_username })
                            )
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>

                    </Marker>
                ))}

            </MapView>
            <View style={styles.searchForm}>
                <TextInput
                    style={styles.serachInput}
                    placeholder="Buscar devs por techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={techs}
                    onChangeText={setTechs}
                />
                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
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