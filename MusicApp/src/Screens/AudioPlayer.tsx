import {Component} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import TrackPlayer, {Event} from 'react-native-track-player';

import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/FontAwesome6';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import CustomProgressBar from './CustomProgressBar';
import {addTracks, setupPlayer} from './trackPlayerServices';
interface IProps {}

interface IState {
  isPlayerReady: boolean;
  modalVisible: boolean;
  clickedObject: IMusic;
  sliderValue: number;
  intervalId: any;
  pausePlayButton: boolean;
  isPaused: boolean;
  // timer: number | null;
  timer: number | NodeJS.Timeout | null;
  trendingTextArray: ITrending[];
}

interface ITrendingWithIndex {
  index: number;
  item: ITrending;
}

interface ITrending {
  id: number;
  name: string;
  text: string;
  iconname: string;
  isActive: boolean;
}

interface IMusicWithIndex {
  index: number;
  item: IMusic;
}

interface IMusic {
  title: string;
  artist: string;
  artwork: string;
  url: string;
  id: string;
  duration: string;
  length: string;
}

export const MusicArray = [
  {
    title: 'Death Bed',
    artist: 'Powfu',
    artwork: 'https://samplesongs.netlify.app/album-arts/death-bed.jpg',
    url: 'https://samplesongs.netlify.app/Death%20Bed.mp3',
    id: '1',
    duration: '3M',
    length: '2.53',
  },
  {
    title: 'Bad Liar',
    artist: 'Imagine Dragons',
    artwork: 'https://samplesongs.netlify.app/album-arts/bad-liar.jpg',
    url: 'https://samplesongs.netlify.app/Bad%20Liar.mp3',
    id: '2',
    duration: '4M',
    length: '4.20',
  },
  {
    title: 'Faded',
    artist: 'Alan Walker',
    artwork: 'https://samplesongs.netlify.app/album-arts/faded.jpg',
    url: 'https://samplesongs.netlify.app/Faded.mp3',
    id: '3',
    duration: '3M',
    length: '3.32',
  },
  {
    title: 'Hate Me',
    artist: 'Ellie Goulding',
    artwork: 'https://samplesongs.netlify.app/album-arts/hate-me.jpg',
    url: 'https://samplesongs.netlify.app/Hate%20Me.mp3',
    id: '4',
    duration: '3M',
    length: '3.06',
  },
  {
    title: 'Solo',
    artist: 'Clean Bandit',
    artwork: 'https://samplesongs.netlify.app/album-arts/solo.jpg',
    url: 'https://samplesongs.netlify.app/Solo.mp3',
    id: '5',
    duration: '3M',
    length: '3.42',
  },
  {
    title: 'Without Me',
    artist: 'Halsey',
    artwork: 'https://samplesongs.netlify.app/album-arts/without-me.jpg',
    url: 'https://samplesongs.netlify.app/Without%20Me.mp3',
    id: '6',
    duration: '4M',
    length: '3.48',
  },
];

export const trendingArray = [
  {
    id: 1,
    text: 'Trending',
    name: 'trending',
    iconname: 'fire',
    isActive: true,
  },
  {
    id: 2,
    text: '5-Minutes Read',
    name: '5-Minutes Read',
    iconname: 'book-open',
    isActive: false,
  },
  {
    id: 3,
    text: 'Quick Listen',
    name: 'Quick Listen',
    iconname: 'headphones',
    isActive: false,
  },
  // {
  //   id: 4,
  //  text: 'Trending',
  //  name: 'trending',
  //  iconname: 'fire',
  // },
];

class AudioPlayer extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isPlayerReady: false,
      modalVisible: false,
      clickedObject: {
        title: '',
        artist: '',
        artwork: '',
        url: '',
        id: '',
        duration: '',
        length: '',
      },
      sliderValue: 0,
      isPaused: false,
      intervalId: null,
      pausePlayButton: false,
      timer: null,
      trendingTextArray: trendingArray,
    };
  }

  setUp = async () => {
    let isSetup = await setupPlayer();

    const queue = await TrackPlayer.getQueue();
    if (isSetup && queue.length <= 0) {
      await addTracks();
    }

    this.setState({isPlayerReady: isSetup});
  };

  componentDidMount() {
    this.setUp();
    // this.callForTrackPlayer();
    // this.setupTrackChangeListener();
  }



  clearSliderInterval = () => {
    if (this.state.timer) {
      clearInterval(this.state.timer);
      this.setState({timer: null});
    }
  };

  componentWillUnmount(): void {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }
    TrackPlayer.stop();
  }

  onPressEachItem = async (item: IMusicWithIndex) => {
    this.setState({sliderValue: 0});
    const index = item.index;
    const eachItem = item.item;
    const queue = await TrackPlayer.getQueue();

    const isTrackInQueue = queue.some(track => track.id === eachItem.id);
    if (!isTrackInQueue) {
      await TrackPlayer.add(eachItem);
    }
    await TrackPlayer.skip(index);
    const activeTrack = await TrackPlayer.getActiveTrack();
    this.setState({modalVisible: true, clickedObject: eachItem});
    this.clearSliderInterval();
    this.onPressPauseButton();
    await TrackPlayer.play();
  };

  onPressPauseButton = async () => {
    this.setState({pausePlayButton: true});
    await TrackPlayer.play();
    const totalTimeInSeconds = parseInt(this.state.clickedObject.length) * 60;
    if (!this.state.timer) {
      const timerId = setInterval(() => {
        if (
          this.state.sliderValue < totalTimeInSeconds &&
          !this.state.isPaused
        ) {
          this.setState(prevState => ({
            sliderValue: prevState.sliderValue + 1,
          }));
        }
      }, 1000);

      this.setState({timer: timerId});
    }
  };

  onPressPlayButton = async () => {
    this.setState({pausePlayButton: false, isPaused: true});
    await TrackPlayer.pause();
  };

  onResumeButton = async () => {
    this.setState({isPaused: false, pausePlayButton: true});

    await TrackPlayer.play();
    const totalTimeInSeconds = parseInt(this.state.clickedObject.length) * 60;
    if (this.state.timer === null) {
      const timerId = setInterval(() => {
        if (
          this.state.sliderValue < totalTimeInSeconds &&
          !this.state.isPaused
        ) {
          this.setState(prevState => ({
            sliderValue: prevState.sliderValue + 1,
          }));
        }
      }, 1000);
      this.setState({
        timer: timerId,
      });
    }
  };

  forwardToTenSeconds = async () => {
    const currentPosition = await TrackPlayer.getPosition();
    console.log('Current Position:', currentPosition);
    const newPosition = currentPosition + 10;
    const duration = await TrackPlayer.getDuration();
    const finalPosition = Math.min(newPosition, duration);
    this.setState({
      sliderValue: finalPosition,
    });
    await TrackPlayer.seekTo(finalPosition);
  };
  backwardToTenSeconds = async () => {
    const currentPosition = await TrackPlayer.getPosition();
    const newPosition = Math.max(0, currentPosition - 10);
    this.setState({
      sliderValue: newPosition,
    });
    await TrackPlayer.seekTo(newPosition);
  };

  skipToPreviousMusic = async () => {
    await TrackPlayer.skipToPrevious();
    const activedObject = await TrackPlayer.getActiveTrack();
    this.setState({
      clickedObject: activedObject,
      pausePlayButton: true,
      sliderValue: 0,
    });
    await TrackPlayer.play();
  };

  skipToNextMusic = async () => {
    await TrackPlayer.skipToNext();
    const activedObject = await TrackPlayer.getActiveTrack();
    this.setState({
      clickedObject: activedObject,
      pausePlayButton: true,
      sliderValue: 0,
    });
    await TrackPlayer.play();
  };

  modalCloseButton = () => {
    this.setState({modalVisible: false});
  };

  renderMusicItem = (item: IMusicWithIndex) => {
    const eachItem = item.item;
    const {title, artwork, artist, id, url, duration} = eachItem;
    return (
      <TouchableOpacity
        style={styles.flatImageContainer}
        onPress={() => this.onPressEachItem(item)}>
        <Image
          source={{uri: `${artwork}`}}
          resizeMode="contain"
          style={styles.flatListImage}
        />
        <View style={{marginTop: -30}}>
          <Text style={styles.flatListTitle}>{title}</Text>
          <Text style={styles.flatListArtist}>{artist}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View style={styles.iconContainer}>
              <Icons name="headphones" color="#C4CCCC" size={20} />
              <Text style={styles.flstListDuration}>{duration} </Text>
            </View>
            <View style={styles.eyeIconContainer}>
              <SimpleLineIcons name="eyeglass" color="#C4CCCC" size={20} />
              <Text style={styles.flstListDuration}>{duration} </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  onPressTrendingItem = (eachItem: ITrending) => {
    trendingArray.forEach(item => {
      if (item.id === eachItem.id) {
        return (item.isActive = true);
      } else {
        return (item.isActive = false);
      }
    });

    // console.log('412 ==>', trendingArray);
    this.setState({trendingTextArray: trendingArray});
  };

  renderTrendingItem = (item: ITrendingWithIndex) => {
    // console.log("386", item)
    const  eachItem = item.item;
    return (
      <View>
        {eachItem.isActive ? (
          <View style={styles.trendingContainerList}>
            <Icons name={eachItem.iconname} color="black" size={20} />
            <Text style={styles.trendingContainerText}>{eachItem.text}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.trendingContainerListFalse}
            onPress={() => this.onPressTrendingItem(eachItem)}>
            <Icons name={eachItem.iconname} color="white" size={20} />
            <Text style={styles.trendingContainerTextFalse}>
              {eachItem.text}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  onPressDoubleClickIcon = async (clickedObject: IMusic) => {
    // console.log('394==>', clickedObject);
    await TrackPlayer.skipToNext();
    const activedObject = await TrackPlayer.getActiveTrack();
    // console.log('397==>',activedObject)
    this.setState({clickedObject: activedObject})
  }

  render() {
    const {modalVisible, clickedObject, sliderValue, pausePlayButton} =
      this.state;
    const {title, artwork, artist, id, url, duration, length} = clickedObject;
    const totalTimeInSeconds = parseInt(length) * 60;
    const progress = (sliderValue / totalTimeInSeconds) * 100;

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.mainContainer}>
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
          <View style={{marginTop: 15, marginBottom: 15}}>
            <FlatList
              data={trendingArray}
              renderItem={this.renderTrendingItem}
              keyExtractor={item => item.id.toString()}
              horizontal
              contentContainerStyle={styles.trendingFlatlistStyle}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={styles.mainFrameContainer}>
            <Image
              source={require('../assets/images/profileImage1.png')}
              resizeMode="stretch"
              style={styles.mainFrameImage}
            />
          </View>
          <View>
            <View style={styles.trendingContainer}>
              <Text style={styles.trendingText}>Trending All</Text>
              <View style={styles.showAllContainer}>
                <Text style={styles.showAllText}>Show All </Text>
                <AntDesign name="rightcircle" color="#CDE7BE" size={25} />
              </View>
            </View>
            <FlatList
              data={MusicArray}
              renderItem={this.renderMusicItem}
              horizontal={true}
              contentContainerStyle={styles.flatListContainerStyle}
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
            />

            {clickedObject.url !== '' && (
              <TouchableOpacity
                style={styles.musicBottomContainer}
                onPress={() => this.setState({modalVisible: true})}>
                <Image
                  source={{uri: `${clickedObject.artwork}`}}
                  style={styles.imgStyleForBottom}
                />
                <View style={styles.bottomTextContainer}>
                  <Text style={styles.bottomTextTitle}>Continue Listening</Text>
                  <Text style={styles.bottomTextArtist}>
                    Managers who want to create positive work enviroments..
                  </Text>
                </View>
                <View style={styles.bottomIconContainer}>
                  {pausePlayButton ? (
                    <TouchableOpacity onPress={this.onPressPlayButton}>
                      <Image
                        source={require('../assets/images/playButton.png')}
                        style={{width: 36, height: 36, marginRight: 10}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={this.onPressPauseButton}>
                      <Image
                        source={require('../assets/images/puaseButton.png')}
                        style={{width: 36, height: 36, marginRight: 10}}
                      />
                    </TouchableOpacity>
                  )}

                  <TouchableHighlight onPress={() => this.onPressDoubleClickIcon(clickedObject)}>
                  <Image
                    source={require('../assets/images/doublePause.png')}
                    style={{width: 36, height: 36}}
                  /></TouchableHighlight>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              this.modalCloseButton();
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalHeaderContainer}>
                  <TouchableOpacity onPress={this.modalCloseButton}>
                    <Feather name="chevron-down" color="white" size={30} />
                  </TouchableOpacity>
                  <Entypo name="dots-three-vertical" color="white" size={25} />
                </View>

                <View>
                  <ImageBackground
                    source={{uri: `${artwork}`}}
                    blurRadius={12}
                    style={styles.imageBackground}>
                    <View style={styles.imgContainer}>
                      <Image
                        source={{uri: `${artwork}`}}
                        style={styles.imgStyle}
                      />
                    </View>
                  </ImageBackground>
                  <View style={{padding: 10}}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalArtist}>By {artist}</Text>
                  </View>
                  <View>
                    <View>
                      <CustomProgressBar />
                    </View>

                    <View style={styles.musicContainer}>
                      <View style={styles.pausePlayContainer}>
                        <TouchableOpacity onPress={this.skipToPreviousMusic}>
                          <Image
                            source={require('../assets/images/backward.png')}
                            style={styles.musicIcon}
                          />
                        </TouchableOpacity>
                        <View style={styles.middleContainer}>
                          <TouchableOpacity onPress={this.backwardToTenSeconds}>
                            <Image
                              source={require('../assets/images/skip-backword-10.png')}
                              style={styles.musicIcon}
                            />
                          </TouchableOpacity>

                          {pausePlayButton ? (
                            <TouchableOpacity onPress={this.onPressPlayButton}>
                              <Image
                                source={require('../assets/images/playButton.png')}
                                style={[
                                  styles.musicIcon,
                                  styles.pausePlayButton,
                                ]}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={
                                this.state.isPaused
                                  ? this.onResumeButton
                                  : this.onPressPauseButton
                              }>
                              <Image
                                source={require('../assets/images/puaseButton.png')}
                                style={[
                                  styles.musicIcon,
                                  styles.pausePlayButton,
                                ]}
                              />
                            </TouchableOpacity>
                          )}

                          <TouchableOpacity onPress={this.forwardToTenSeconds}>
                            <Image
                              source={require('../assets/images/skip-forward-10.png')}
                              style={styles.musicIcon}
                            />
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={this.skipToNextMusic}>
                          <Image
                            source={require('../assets/images/forward.png')}
                            style={{width: 20, height: 20}}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.darkSpeedContainer}>
                        <TouchableOpacity>
                          <Feather name="moon" color="white" size={25} />
                        </TouchableOpacity>
                        <Text style={styles.speedText}>1.0x</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: responsiveHeight(100),
    padding: 5,
    backgroundColor: 'black',
  },
  headerContainer: {
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: responsiveHeight(10),
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
  mainFrameContainer: {
    width: responsiveWidth(98),
    height: responsiveHeight(28),
    padding: 6,
    marginBottom: 15,
  },
  mainFrameImage: {
    height: '100%',
    width: '100%',
  },
  flatImageContainer: {
    height: responsiveHeight(38),
    width: responsiveWidth(35),
    margin: 6,
  },
  flatListImage: {
    height: responsiveHeight(27),
    width: responsiveWidth(35),
  },
  flatListTitle: {
    color: '#EAF4F4',
    fontSize: 18,
    marginTop: 4,
    fontStyle: 'italic',
  },
  flatListArtist: {
    color: '#EAF4F4',
  },
  flatListContainerStyle: {
    marginTop: -30,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 4,
  },
  flstListDuration: {
    color: '#EAF4F4',
    marginLeft: 6,
  },
  eyeIconContainer: {
    marginLeft: 10,
    flexDirection: 'row',
    marginTop: 4,
  },
  trendingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: 'white',
    marginBottom: 5,
    marginTop: 5,
  },
  trendingText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 700,
    marginLeft: 5,
  },
  showAllContainer: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    marginRight: 5,
  },
  showAllText: {
    color: '#CDE7BE',
    fontSize: 16,
    fontWeight: 700,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: responsiveWidth(100),
    height: responsiveHeight(100),
    margin: 20,
    backgroundColor: '#181A1A',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveWidth(100),
    paddingHorizontal: 15,
    marginBottom: 4,
  },
  imageBackground: {
    width: responsiveWidth(98),
    height: responsiveHeight(50),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  imgStyle: {
    width: responsiveWidth(65),
    height: 300,
    borderRadius: 10,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 700,
  },
  modalArtist: {
    color: 'gray',
    fontSize: 12,
  },
  musicContainer: {
    flexDirection: 'column',
  },
  musicIcon: {
    width: 24,
    height: 24,
  },
  pausePlayButton: {
    width: 60,
    height: 60,
  },
  imgStyleForBottom: {
    width: responsiveWidth(20),
  },
  musicBottomContainer: {
    width: responsiveWidth(98),
    flexDirection: 'row',
    height: 90,
    position: 'relative',
    bottom: 10,
    borderTopColor: '#CDE7BE',
    borderTopWidth: 1,
  },
  bottomTextContainer: {
    marginLeft: 5,
    width: responsiveWidth(50),

    justifyContent: 'center',
  },
  bottomTextTitle: {
    color: '#CDE7BE',
    fontSize: 18,
    fontWeight: 600,
  },
  bottomTextArtist: {
    color: 'white',
    fontSize: 14,
  },
  bottomIconContainer: {
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  sliderContainer: {
    height: 3,
    marginLeft: 5,
    width: responsiveWidth(96),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 5,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
    paddingTop: 5,
  },
  pausePlayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 6,
  },
  darkSpeedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 10,
  },
  speedText: {
    color: 'white',
    fontSize: 18,
  },
  middleContainer: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  trendingFlatlistStyle: {
    // flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trendingContainerList: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 2,
    paddingHorizontal: 20,
    backgroundColor: '#CDE7BE',
  },
  trendingContainerListFalse: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#313333',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  trendingContainerText: {
    color: 'black',
    marginLeft: 6,
    fontSize: 16,
    fontWeight: 600,
  },
  trendingContainerTextFalse: {
    color: 'white',
    marginLeft: 6,
    fontSize: 16,
    fontWeight: 600,
  },
});

export default AudioPlayer;
