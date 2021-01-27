import InDoctorAppointment from '../../views/patient/InDoctorAppointment';
import DoctorModel from './doctor';

export default interface AppointmentModel {
  id: number;
  doctor: DoctorModel;
  timestamp: string;
  duration: string;
  reason: string;
  videoRoomName?: string;
};
