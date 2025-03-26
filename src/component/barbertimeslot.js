import Timeslot from "./Timeslot";

export default function barbertimeslot(artists) {
  const currentYear = new Date().getFullYear();
  const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);

  const months = [
    { name: "January", days: 31 },
    { name: "February", days: isLeapYear ? 29 : 28 },
    { name: "March", days: 31 },
    { name: "April", days: 30 },
    { name: "May", days: 31 },
    { name: "June", days: 30 },
    { name: "July", days: 31 },
    { name: "August", days: 31 },
    { name: "September", days: 30 },
    { name: "October", days: 31 },
    { name: "November", days: 30 },
    { name: "December", days: 31 },
  ];

  const timeslot = Timeslot();
  const fourteenDaysSlots = [];

  for (let a = 0; a < 14; a++) {
    const date = new Date();
    date.setDate(date.getDate() + a);
    const dateString = date.toDateString();

    timeslot.forEach(slot => {
      fourteenDaysSlots.push({
        date: dateString,
        details: slot,
      });
    });
  }

  const barberTimeSlots = artists.flatMap(artist =>
    fourteenDaysSlots.map(slot => ({
      name: artist,
      timeslot: slot,
    }))
  );

  return barberTimeSlots;
}



