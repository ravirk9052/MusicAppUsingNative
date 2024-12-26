import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
} from 'react-native-track-player';

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          // AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        AppKilledPlaybackBehavior.ContinuePlayback,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
       
      ],
      progressUpdateEventInterval: 2,
    });

    isSetup = true;
  } finally {
    return isSetup;
  }
}

export async function addTracks() {
  await TrackPlayer.add([
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
      length: '2.53',
    },
    {
      title: 'Hate Me',
      artist: 'Ellie Goulding',
      artwork: 'https://samplesongs.netlify.app/album-arts/hate-me.jpg',
      url: 'https://samplesongs.netlify.app/Hate%20Me.mp3',
      id: '4',
      duration: '3M',
      length: '3.32',
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
  ]);
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export async function playbackService() {
  // TODO: Attach remote event handlers
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    await TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    await TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    await TrackPlayer.skipToNext();
  await  TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    await TrackPlayer.skipToPrevious();
    await TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemoteSeek, async(event) => {
    // console.log('109==>', event.position);
    await TrackPlayer.seekTo(event.position);
  });
  // TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async () => {
  //   const currentTrack = await TrackPlayer.getTrack(TrackPlayer.getActiveTrack());
  //   updateUIWithTrackInfo(currentTrack);
  // });

  // TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async () => {
  //   const currentTrack = await TrackPlayer.getTrack(TrackPlayer.getActiveTrack());
  //   // Update your UI here with the current track info
  //   console.log('Now Playing:', currentTrack.title);
  // });
  
}
