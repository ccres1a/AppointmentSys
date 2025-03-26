import Timeslot from "./Timeslot";
import { useContext, useState, useMemo } from "react";
import { AppContext } from "./AppContext";
import "../css/ViewAppointment.css";

const DateSelector = ({ next14Days, handleDateChange }) => (
  <label htmlFor="date-select" className="date-selector">
    Select Date:
    <select id="date-select" onChange={handleDateChange}>
      {next14Days.map((date, index) => (
        <option key={index} value={date.toISOString()}>
          {date.toDateString()}
        </option>
      ))}
    </select>
  </label>
);

const AppointmentTable = ({ timeslotdata, appointmentsByArtist }) => {
  const mergedAppointments = useMemo(() => {
    const merged = {};
    Object.keys(appointmentsByArtist).forEach(artist => {
      merged[artist] = {};
      appointmentsByArtist[artist].forEach(appointment => {
        const time = appointment.timeslot.details.time;
        const identifier = appointment.timeslot.details.appointmentidentifier;
        if (!merged[artist][time]) {
          merged[artist][time] = {};
        }
        if (!merged[artist][time][identifier]) {
          merged[artist][time][identifier] = [];
        }
        merged[artist][time][identifier].push(appointment);
      });
    });
    return merged;
  }, [appointmentsByArtist]);

  return (
    <table className="appointment-table">
      <thead>
        <tr>
          <th>Time</th>
          {Object.keys(mergedAppointments).map((artist, index) => (
            <th key={index}>{artist}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeslotdata.map((time, index) => (
          <tr key={index}>
            <td>{time}</td>
            {Object.keys(mergedAppointments).map((artist, artistIndex) => {
              const appointmentsAtTime = mergedAppointments[artist][time];
              return (
                <td key={artistIndex}>
                  {appointmentsAtTime ? (
                    Object.values(appointmentsAtTime).map((appointments, i) => (
                      <div key={i}>
                        {appointments.map((appointment, j) => (
                          <p key={j}>{appointment.timeslot.details.firstname} {appointment.timeslot.details.lastname} {appointment.timeslot.details.email} {appointment.timeslot.details.serviceidentifier} </p>

                        ))}
                      </div>
                    ))
                  ) : null}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function ViewAppointment() {
  const { appointments } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const timeslotdata = useMemo(() => Timeslot().map(slot => slot.time), []);
  const next14Days = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  }), []);

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
  };

  const selectedDateString = selectedDate.toDateString();
  const selectedAppointments = useMemo(() => appointments.filter(
    (appointment) => new Date(appointment.timeslot.date).toDateString() === selectedDateString
  ), [appointments, selectedDateString]);

  const appointmentsByArtist = useMemo(() => selectedAppointments.reduce((acc, appointment) => {
    const artist = appointment.name;
    if (!acc[artist]) {
      acc[artist] = [];
    }
    acc[artist].push(appointment);
    return acc;
  }, {}), [selectedAppointments]);

  return (
    <div className="view-appointment">
      <h1>Appointments for {selectedDateString}</h1>
      <DateSelector next14Days={next14Days} handleDateChange={handleDateChange} />
      <AppointmentTable timeslotdata={timeslotdata} appointmentsByArtist={appointmentsByArtist} />
    </div>
  );
}
