import React, {Component, createRef} from 'react';
import {View, Text, StyleSheet, PermissionsAndroid, ToastAndroid, TouchableOpacity} from 'react-native';
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
import AppointmentRepository from '../../api/appointmentRepository';
import apiClient from '../../api/anonymousClient';
import AppointmentRoom from '../../api/models/appointmentRoom';
import {ActivityIndicator} from 'react-native-paper';
import Orientation from 'react-native-orientation';

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
};

type InDoctorAppointmentProps = {
  navigation: any;
};

class InDoctorAppointment extends Component<InDoctorAppointmentProps, InDoctorAppointmentState> {
  twilioRef: React.RefObject<TwilioVideo>;

  constructor(props: InDoctorAppointmentProps) {
    super(props);
    this.state = {
      hasPermissions: false,
      isVideoEnabled: true,
      isAudioEnabled: true,
      status: 'disconnected',
      videoTracks: new Map<string, VideoTrackData>(),
    };
    this.twilioRef = createRef<TwilioVideo>();
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
      Orientation.lockToLandscape();
    });

    let repo = new AppointmentRepository(apiClient);
    repo
      .joinAppointment(1)
      .then(this._connect)
      .catch((error) => {
        console.error(`failed to join room: ${error}`);
        ToastAndroid.show('Failed to join appointment!', ToastAndroid.LONG);
        this.props.navigation.goBack();
      });
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
    Orientation.unlockAllOrientations();
  }

  _connect = (appointmentRoom: AppointmentRoom) => {
    this.twilioRef.current.connect({
      accessToken: appointmentRoom.accessKey,
      roomName: appointmentRoom.roomName,
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
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  callContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
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
