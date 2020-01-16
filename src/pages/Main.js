import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import MapView, { Marker,Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';

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




    return <MapView initialRegion={currentRegion} style={styles.map}>
        <Marker coordinate={{ latitude: -23.4882244, longitude: -46.478351 }}>
            <Image style={styles.avatar} source={{ uri: 'https://avatars3.githubusercontent.com/u/26292657?s=460&v=4' }} />
            <Callout onPress={()=>{(
                props.navigation.navigate('Profile',{github_username:'samuel2412'})
            )}}>
                <View style={styles.callout}>
                    <Text style={styles.devName}>Samuel Alves</Text>
                    <Text style={styles.devBio}>Frontend Developer | Java Developer</Text>
                    <Text style={styles.devTechs}>ReactJs, React Native, Node.js</Text>
                </View>
            </Callout>

        </Marker>
    </MapView>
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

});

export default Main;