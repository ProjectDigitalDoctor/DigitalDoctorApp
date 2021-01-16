import React, {Component, createRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  ToastAndroid,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import {
  RoomErrorEventArgs,
  RoomErrorEventCb,
  RoomEventCb,
  TrackEventCb,
  TrackEventCbArgs,
  TwilioVideo,
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
} from 'react-native-twilio-video-webrtc';

async function requestPermission(): Promise<boolean> {
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  ]);
  if (
    granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
    granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED
  ) {
    console.log('Requesting permissions successful');
    return true;
  } else {
    console.log('Requesting permissions failed');
    return false;
  }
}

type VideoTrackData = {
  participantSid: string;
  videoTrackSid: string;
};

type InDoctorAppointmentState = {
  hasPermissions: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  status: string;
  videoTracks: Map<string, VideoTrackData>;
  token: string;
  roomName: string;
};

type InDoctorAppointmentProps = {
  navigation: any;
};

class InDoctorAppointment extends Component<InDoctorAppointmentProps, InDoctorAppointmentState> {
  twilioRef = createRef<TwilioVideo>();

  constructor(props: InDoctorAppointmentProps) {
    super(props);
    this.state = {
      hasPermissions: false,
      isVideoEnabled: true,
      isAudioEnabled: true,
      status: 'disconnected',
      videoTracks: new Map<string, VideoTrackData>(),
      token: '',
      roomName: '',
    };
  }

  componentDidMount() {
    requestPermission().then((gotPermission) => {
      if (gotPermission) {
        this.setState({
          hasPermissions: true,
        });
      } else {
        ToastAndroid.show('Permissions required for appointment!', ToastAndroid.LONG);
        this.props.navigation.goBack();
      }
    });
  }

  _onConnectButtonPress = () => {
    this.twilioRef.current.connect({
      accessToken: this.state.token,
      roomName: this.state.roomName,
    });
    this.setState({status: 'connecting'});
  };

  _onEndButtonPress = () => {
    this.twilioRef.current.disconnect();
  };

  _onMuteButtonPress = () => {
    this.twilioRef.current
      .setLocalAudioEnabled(!this.state.isAudioEnabled)
      .then((isEnabled: boolean) => this.setState({isAudioEnabled: isEnabled}));
  };

  _onFlipButtonPress = () => {
    this.twilioRef.current.flipCamera();
  };

  _onRoomDidConnect: RoomEventCb = ({roomName}: any) => {
    console.log('onRoomDidConnect: ', roomName);

    this.setState({status: 'connected'});
  };

  _onRoomDidDisconnect: RoomErrorEventCb = ({error}: RoomErrorEventArgs) => {
    console.log('[Disconnect] ERROR: ', error);

    this.setState({status: 'disconnected'});
  };

  _onRoomDidFailToConnect: RoomErrorEventCb = ({error}: RoomErrorEventArgs) => {
    console.log('[FailToConnect] ERROR: ', error);

    this.setState({status: 'disconnected'});
  };

  _onParticipantAddedVideoTrack: TrackEventCb = ({participant, track}: TrackEventCbArgs) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    this.setState({
      videoTracks: new Map<string, VideoTrackData>([
        ...this.state.videoTracks,
        [track.trackSid, {participantSid: participant.sid, videoTrackSid: track.trackSid}],
      ]),
    });
  };

  _onParticipantRemovedVideoTrack: TrackEventCb = ({participant, track}: TrackEventCbArgs) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracksLocal = this.state.videoTracks;
    videoTracksLocal.delete(track.trackSid);

    this.setState({videoTracks: videoTracksLocal});
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.status === 'disconnected' && (
          <View>
            <Text style={styles.welcome}>React Native Twilio Video</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={this.state.token}
              onChangeText={(text) => this.setState({token: text})}
            />
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={this.state.roomName}
              onChangeText={(text) => this.setState({roomName: text})}
            />
            <Button title="Connect" onPress={this._onConnectButtonPress} />
          </View>
        )}

        {(this.state.status === 'connected' || this.state.status === 'connecting') && (
          <View style={styles.callContainer}>
            {this.state.status === 'connected' && (
              <View style={styles.remoteGrid}>
                {Array.from(this.state.videoTracks, ([trackSid, trackIdentifier]) => {
                  return (
                    <TwilioVideoParticipantView
                      style={styles.remoteVideo}
                      key={trackSid}
                      trackIdentifier={trackIdentifier}
                    />
                  );
                })}
              </View>
            )}
            <View style={styles.optionsContainer}>
              <TouchableOpacity onPress={this._onEndButtonPress} style={styles.optionButton}>
                <Text style={{fontSize: 12}}>End</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._onMuteButtonPress} style={styles.optionButton}>
                <Text style={{fontSize: 12}}>{this.state.isAudioEnabled ? 'Mute' : 'Unmute'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._onFlipButtonPress} style={styles.optionButton}>
                <Text style={{fontSize: 12}}>Flip</Text>
              </TouchableOpacity>
              <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
            </View>
          </View>
        )}

        <TwilioVideo
          ref={this.twilioRef}
          onRoomDidConnect={this._onRoomDidConnect}
          onRoomDidDisconnect={this._onRoomDidDisconnect}
          onRoomDidFailToConnect={this._onRoomDidFailToConnect}
          onParticipantAddedVideoTrack={this._onParticipantAddedVideoTrack}
          onParticipantRemovedVideoTrack={this._onParticipantRemovedVideoTrack}
        />
      </View>
    );
  }
}

export default InDoctorAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  callContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  button: {
    marginTop: 100,
  },
  localVideo: {
    flex: 1,
    width: 150,
    height: 250,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  remoteVideo: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    width: 100,
    height: 120,
  },
  optionsContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 100,
    backgroundColor: 'blue',
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
