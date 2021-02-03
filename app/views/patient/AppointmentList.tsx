import React, {Component} from 'react';
import {View, Text, StyleSheet, ToastAndroid} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native';
import AppointmentRepository from '../../api/appointmentRepository';
import AppointmentModel from '../../api/models/appointment';
import apiClient from '../../api/anonymousClient';
import {Calendar, DateCallbackHandler, DateObject, LocaleConfig} from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionButton from 'react-native-action-button';

LocaleConfig.locales.de = {
  monthNames: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ],
  monthNamesShort: ['Jan.', 'Feb.', 'März', 'April', 'Mai', 'Juni', 'Juli.', 'Aug', 'Sept.', 'Okt.', 'Nov.', 'Dez.'],
  dayNames: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
  dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
};
LocaleConfig.defaultLocale = 'de';

type AppointmentListProps = {
  navigation: any;
};

type AppointmentListState = {
  appointments: AppointmentModel[];
  isFetching: boolean;
  selectedDay: DateObject;
};

function getCalendarDateTime(date: Date): string {
  return date.toISOString().split('T')[0];
}

class AppointmentList extends Component<AppointmentListProps, AppointmentListState> {
  repo: AppointmentRepository = new AppointmentRepository(apiClient);

  constructor(props: AppointmentListProps) {
    super(props);
    const today = new Date();
    this.state = {
      appointments: [],
      isFetching: false,
      selectedDay: {
        dateString: getCalendarDateTime(today),
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
        timestamp: today.getTime(),
      },
    };
    this.repo
      .loadCachedAppointments()
      .then((appointments) => this.setState({appointments}))
      .catch((error) => console.error(`failed to load cached appointments: ${error}`));
  }

  loadAppointments = () => {
    this.setState({isFetching: true});
    this.repo
      .getAllAppointments()
      .then((appointments) => this.setState({appointments, isFetching: false}))
      .catch((error) => {
        console.error(`failed to load appointments: ${error}`);
        ToastAndroid.show('Laden der Termine fehlgeschlagen!', ToastAndroid.LONG);
        this.setState({isFetching: false});
      });
  };

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <MaterialCommunityIcons.Button name="reload" backgroundColor="#32a852" onPress={this.loadAppointments} />
      ),
    });
    this.loadAppointments();
  }

  _onAppointmentPress = (appointment: AppointmentModel) => {
    this.props.navigation.push('AppointmentScreen', {appointment: appointment});
  };

  _onCalendarDayPress: DateCallbackHandler = (day: DateObject) => {
    this.setState({selectedDay: day});
  };

  render() {
    const dateTimeFormat = new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const appointmentElement = ({item}: {item: AppointmentModel}) => (
      <TouchableOpacity onPress={() => this._onAppointmentPress(item)}>
        <View style={styles.item}>
          <Text style={styles.title}>{item.reason}</Text>
          <Text style={styles.details}>{dateTimeFormat.format(new Date(item.timestamp))}</Text>
          <Text style={styles.details}>
            {item.doctor.firstName} {item.doctor.lastName} ({item.doctor.profession})
          </Text>
        </View>
      </TouchableOpacity>
    );

    const markedDates: {[date: string]: any} = {};
    markedDates[this.state.selectedDay!.dateString] = {selected: true};
    for (const appointment of this.state.appointments) {
      const day = getCalendarDateTime(new Date(appointment.timestamp));
      if (day in markedDates) {
        markedDates[day].marked = true;
      } else {
        markedDates[day] = {marked: true};
      }
    }

    const filteredAppointments = this.state.appointments.filter((appointment) => {
      const date = new Date(appointment.timestamp);
      return date.getMonth() + 1 === this.state.selectedDay.month && date.getDate() === this.state.selectedDay.day;
    });

    return (
      <View style={styles.container}>
        <Calendar
          firstDay={1}
          onDayPress={this._onCalendarDayPress}
          enableSwipeMonths={true}
          theme={{
            todayTextColor: '#16cc46',
            arrowColor: '#16cc46',
          }}
          markedDates={markedDates}
        />
        {filteredAppointments.length === 0 && (
          <Text style={styles.noAppointmentsText}>Keine Termine an diesem Tag!</Text>
        )}
        <FlatList
          style={styles.list}
          data={filteredAppointments}
          renderItem={appointmentElement}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={this.loadAppointments}
          refreshing={this.state.isFetching}
        />
        <ActionButton
          buttonColor="#32a852"
          offsetY={15}
          onPress={() => {
            this.props.navigation.navigate('FindDoctor');
          }}
        />
      </View>
    );
  }
}

export default AppointmentList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  item: {
    backgroundColor: 'lightgray',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
  details: {
    fontSize: 14,
  },
  noAppointmentsText: {
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 17,
  },
});
