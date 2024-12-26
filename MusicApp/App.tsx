import { SafeAreaView, Text, View } from 'react-native';
import React, { Component } from 'react';
import AudioPlayer from './src/Screens/AudioPlayer';

export class App extends Component {
  render() {
    return (
      <SafeAreaView>
        {/* <Text>App</Text> */}
        <AudioPlayer />
      </SafeAreaView>
    )
  }
}

export default App