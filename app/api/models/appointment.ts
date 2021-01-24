import InDoctorAppointment from '../../views/patient/InDoctorAppointment';

export default interface Appointment {
  id: number;
  doctor: any;
  timestamp: string;
  duration: string;
  reason: string;
  videoRoomName?: string;
};
