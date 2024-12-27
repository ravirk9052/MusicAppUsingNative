import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const AudioHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.AfterNoonContainer}>
        <Text style={styles.afterText}>Good Afternoon</Text>
        <Image
          source={require('../assets/images/vectorLine.png')}
          style={styles.vectorLogo}
        />
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/images/profileImage.png')}
          style={styles.profileLogo}
        />
      </View>
    </View>
  );
};

const styles=StyleSheet.create({
    headerContainer: {
        padding: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // height: responsiveHeight(10),
        // borderWidth: 2,
        // borderColor: 'green'
      },
      AfterNoonContainer: {},
      afterText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 700,
        paddingVertical: 15,
      },
       profileContainer: {
          width: 55,
          height: 55,
        },
        profileLogo: {
          width: 60,
          height: 60,
        },
        vectorLogo: {
          width: 65,
          marginTop: -5,
        },

})

export default AudioHeader;
