import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import { useProgress } from 'react-native-track-player';
import TrackPlayer from 'react-native-track-player';

export default function CustomProgressBar() {
  const { position, buffered, duration } = useProgress();
  const [isSeeking, setIsSeeking] = useState(false);

  // const handleSeek = async (event: GestureResponderEvent) => {
  //   // console.log('11',event)
  //   const width = event.nativeEvent.locationX; 
  //   const newPosition = (width / event.nativeEvent.contentWidth) * duration; 
  //   setIsSeeking(true);
  //   await TrackPlayer.seekTo(newPosition); 
  //   setIsSeeking(false); 
  // };

  const progress = duration ? position / duration : 0;
  const bufferedProgress = duration ? buffered / duration : 0;


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Custom Progress Bar</Text> */}
      <TouchableWithoutFeedback>
        <View style={styles.progressContainer}>
          <View
            style={[styles.bufferedBar, { width: `${bufferedProgress * 100}%` }]}
          />
          <View
            style={[styles.progressBar, { width: `${progress * 100}%` }]}
          />
          <View
            style={[styles.thumb, { left: `${progress * 100}%` }]}
          />
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20,
    paddingVertical: 20,
    height: 600,
    // borderWidth: 2,
    // borderColor: 'green'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginTop: 10,
    height: 30,
    // margin: 10,
    // borderWidth: 2,
    // borderColor: 'red'
  },
  timeText: {
    fontSize: 14,
    color: 'white',

  },
  progressContainer: {
    width: '95%',
    height: 5,
    backgroundColor: '#e0e0e0', 
    borderRadius: 5,
    position: 'relative',
  },
  bufferedBar: {
    height: 5,
    backgroundColor: '#d3d3d3', 
    borderRadius: 5,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressBar: {
    height: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  thumb: {
    position: 'absolute',
    top: -5,
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#CDE7BE', 
    // color: '#CDE7BE',
  },
});
