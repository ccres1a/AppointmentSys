import { useContext, useState, useMemo } from "react";
import { AppContext } from "./AppContext";
import Timeslot from "./Timeslot";
import "../css/AppointmentBooking.css";

export default function AppointmentBooking() {
  const { appointmentCount, setAppointmentCount, services, artists, appointments, setAppointments } = useContext(AppContext);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [rescheduleData, setRescheduleData] = useState({
    email: "",
    lastname: "",
  });
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [appointmentReschedule, setAppointmentReschedule] = useState(false);

  const next14Days = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  }), []);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    setStep(3);
  };

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleBackClick = () => {
    setStep(step - 1);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRescheduleInputChange = (event) => {
    const { name, value } = event.target;
    setRescheduleData({ ...rescheduleData, [name]: value });
  };

  const bookMultipleAppointmentSlots = (servicetime, selectedtime) => {
    const timeslotsdata = Timeslot().map(slot => slot.time);
    const index = timeslotsdata.indexOf(selectedtime);
    return Array.from({ length: servicetime }, (_, i) => timeslotsdata[index + i]);
  };

  const checkEndSlots=(servicetime)=>
  {
    const timeslotdata = Timeslot().map(slot => slot.time);
    return timeslotdata.slice(0, timeslotdata.length - servicetime+1);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const multipleslotsbook = bookMultipleAppointmentSlots(selectedService.servicetime, selectedTime);
    const updatedAppointments = appointments.map((appointment) => {
      if (appointmentReschedule && (appointment.timeslot.details.appointmentidentifier === appointmentToReschedule.timeslot.details.appointmentidentifier)) {
        return {
          ...appointment,
          timeslot: {
            ...appointment.timeslot,
            details: {
              ...appointment.timeslot.details,
              appointmentidentifier: "",
              firstname: "",
              lastname: "",
              email: "",
              phone: "",
              serviceidentifier: "",
            },
          },
        };
      }
      if (
        appointment.name === selectedArtist &&
        new Date(appointment.timeslot.date).toDateString() === selectedDate.toDateString() &&
        multipleslotsbook.includes(appointment.timeslot.details.time)
      ) {
        setAppointmentCount(appointmentCount + 1);
        return {
          ...appointment,
          timeslot: {
            ...appointment.timeslot,
            details: {
              ...appointment.timeslot.details,
              appointmentidentifier: String(appointmentCount + 1),
              firstname: formData.firstName,
              lastname: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              serviceidentifier: selectedService.name,
            },
          },
        };
      }
      return appointment;
    });
    setAppointments(updatedAppointments);
    alert("Appointment booked successfully!");
    setStep(1);
  };

  const handleRescheduleSubmit = (event) => {
    event.preventDefault();
    const appointment = appointments.find(
      (appointment) =>
        appointment.timeslot.details.email === rescheduleData.email &&
        appointment.timeslot.details.lastname === rescheduleData.lastname
    );
    if (appointment) {
      setAppointmentToReschedule(appointment);
      setSelectedService(services.find((service) => service.name === appointment.timeslot.details.serviceidentifier));
      setAppointmentReschedule(true);
      setFormData({
        firstName: appointment.timeslot.details.firstname,
        lastName: appointment.timeslot.details.lastname,
        email: appointment.timeslot.details.email,
        phone: appointment.timeslot.details.phone,
      });
      setStep(2);
    } else {
      alert("No appointment found with the provided email and lastname.");
    }
  };

  const selectedDateString = selectedDate.toDateString();

  const availableTimes = appointments
    .filter(
      (appointment) =>
        appointment.name === selectedArtist &&
        new Date(appointment.timeslot.date).toDateString() === selectedDateString &&
        !appointment.timeslot.details.firstname &&
        !appointment.timeslot.details.lastname &&
        !appointment.timeslot.details.phone &&
        checkEndSlots(selectedService.servicetime).includes(appointment.timeslot.details.time)
    )
    .map((appointment) => appointment.timeslot.details.time);

  return (
    <div className="appointment-booking">
      <h1>Welcome to All Stars Barbers</h1>
      {step === 1 && (
        <div className="step step-1">
          <h2>Select a Service</h2>
          <ul className="service-list">
            {services.map((service, index) => (
              <li key={index} onClick={() => handleServiceClick(service)}>
                <h3>{service.name}</h3>
                <p>Price: ${service.price}</p>
              </li>
            ))}
          </ul>
          <h2>Reschedule Appointment</h2>
          <form onSubmit={handleRescheduleSubmit} className="reschedule-form">
            <label>
              Email:
              <input type="email" name="email" value={rescheduleData.email} onChange={handleRescheduleInputChange} required />
            </label>
            <label>
              Lastname:
              <input type="text" name="lastname" value={rescheduleData.lastname} onChange={handleRescheduleInputChange} required />
            </label>
            <button type="submit">Fetch Appointment</button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div className="step step-2">
          <h2>Select an Artist</h2>
          <button onClick={handleBackClick}>Back</button>
          <ul className="artist-list">
            {artists.map((artist, index) => (
              <li key={index} onClick={() => handleArtistClick(artist)}>
                <h3>{artist}</h3>
              </li>
            ))}
          </ul>
        </div>
      )}
      {step === 3 && (
        <div className="step step-3">
          <h2>Select a Date</h2>
          <button onClick={handleBackClick}>Back</button>
          <label htmlFor="date-select">Select Date: </label>
          <select id="date-select" onChange={handleDateChange}>
            {next14Days.map((date, index) => (
              <option key={index} value={date.toISOString()}>
                {date.toDateString()}
              </option>
            ))}
          </select>
          <h2>Select a Time Slot</h2>
          <ul className="time-slot-list">
            {availableTimes.map((time, index) => (
              <li key={index} onClick={() => handleTimeClick(time)}>
                <h3>{time}</h3>
              </li>
            ))}
          </ul>
        </div>
      )}
      {step === 4 && (
        <div className="step step-4">
          <h2>Book Appointment</h2>
          <button onClick={handleBackClick}>Back</button>
          <form onSubmit={handleFormSubmit} className="booking-form">
            <label>
              First Name:
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            </label>
            <label>
              Last Name:
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </label>
            <label>
              Phone:
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </label>
            <button type="submit">Book Appointment</button>
          </form>
        </div>
      )}
    </div>
  );
}
