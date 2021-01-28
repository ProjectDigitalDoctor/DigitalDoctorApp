import AppointmentVideoChatScreen from '../../views/patient/AppointmentVideoChatScreen';
import DoctorModel from './doctor';

export default interface AppointmentModel {
  id: number;
  doctor: DoctorModel;
  timestamp: string;
  duration: number;
  reason: string;
  videoRoomName?: string;
};
