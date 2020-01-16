import React from 'react';
import {WebView} from 'react-native-webview';

const Profile = (props) => {
    const github_username = props.navigation.getParam('github_username')

    return <WebView style={{flex:1}} source={{uri: `https://github.com/${github_username}`}}/>
}

export default Profile;