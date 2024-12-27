import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import React, {Component} from 'react';
import AudioPlayer from './src/Screens/AudioPlayer';
import {responsiveHeight} from 'react-native-responsive-dimensions';

export class App extends Component {
  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          height: responsiveHeight(110),
          backgroundColor: 'black',
          // borderColor: 'red',
          // borderWidth: 1,
        }}>
        <ScrollView>
          <AudioPlayer />
        </ScrollView>
        {/* <Text>App</Text> */}
      </SafeAreaView>
    );
  }
}

export default App;
