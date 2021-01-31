import React, {Component, createRef} from 'react';
import {View, Text, StyleSheet, PermissionsAndroid, ToastAndroid, TouchableOpacity} from 'react-native';
import {
  RoomErrorEventArgs,
  RoomErrorEventCb,
  RoomEventCb,
  TrackEventCb,
  TrackEventCbArgs,
  TrackIdentifier,
  TwilioVideo,
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
} from 'react-native-twilio-video-webrtc';
import AppointmentRepository from '../../api/appointmentRepository';
import apiClient from '../../api/anonymousClient';
import AppointmentRoomModel from '../../api/models/appointmentRoom';
import {ActivityIndicator} from 'react-native-paper';

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

type AppointmentVideoChatScreenState = {
  hasPermissions: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  status: string;
  videoTracks: Map<string, TrackIdentifier>;
  lastJoinedTrackSid?: string;
};

type AppointmentVideoChatScreenProps = {
  navigation: any;
  route: any;
};

class AppointmentVideoChatScreen extends Component<AppointmentVideoChatScreenProps, AppointmentVideoChatScreenState> {
  twilioRef: React.RefObject<TwilioVideo>;

  constructor(props: AppointmentVideoChatScreenProps) {
    super(props);
    this.state = {
      hasPermissions: false,
      isVideoEnabled: true,
      isAudioEnabled: true,
      status: 'disconnected',
      videoTracks: new Map<string, TrackIdentifier>(),
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
        ToastAndroid.show('Sie haben keine Berechtigung für die Teilnahme am Meeting!', ToastAndroid.LONG);
        this.props.navigation.goBack();
      }
    });

    let repo = new AppointmentRepository(apiClient);
    repo
      .joinAppointment(this.props.route.params.appointmentID)
      .then(this._connect)
      .catch((error) => {
        console.error(`failed to join room: ${error}`);
        ToastAndroid.show('Beitreten fehlegeschlagen!', ToastAndroid.LONG);
        this.props.navigation.goBack();
      });
  }

  componentWillUnmount() {}

  _connect = (appointmentRoom: AppointmentRoomModel) => {
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

    this.props.navigation.goBack();
  };

  _onRoomDidFailToConnect: RoomErrorEventCb = ({error}: RoomErrorEventArgs) => {
    console.log('[FailToConnect] ERROR: ', error);

    this.setState({status: 'disconnected'});
  };

  _onParticipantAddedVideoTrack: TrackEventCb = ({participant, track}: TrackEventCbArgs) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    this.setState({
      videoTracks: new Map<string, TrackIdentifier>([
        ...this.state.videoTracks,
        [track.trackSid, {participantSid: participant.sid, videoTrackSid: track.trackSid}],
      ]),
      lastJoinedTrackSid: track.trackSid,
    });
  };

  _onParticipantRemovedVideoTrack: TrackEventCb = ({participant, track}: TrackEventCbArgs) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracksLocal = this.state.videoTracks;
    videoTracksLocal.delete(track.trackSid);
    const lastJoinedTrackSid =
      this.state.lastJoinedTrackSid === track.trackSid ? undefined : this.state.lastJoinedTrackSid;

    this.setState({videoTracks: videoTracksLocal, lastJoinedTrackSid});
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
            {this.state.status === 'connected' && this.state.lastJoinedTrackSid !== undefined ? (
              <TwilioVideoParticipantView
                style={styles.remoteVideo}
                key={this.state.lastJoinedTrackSid}
                trackIdentifier={this.state.videoTracks.get(this.state.lastJoinedTrackSid)!}
              />
            ) : (
              <ActivityIndicator style={styles.remoteVideo} />
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
            </View>
            <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
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

export default AppointmentVideoChatScreen;

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
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
  localVideo: {
    width: 150,
    height: 250,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    right: 170,
    height: 80,
    backgroundColor: 'grey',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 20,
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: 'darkgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
