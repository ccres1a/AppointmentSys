export default function Timeslot() {
  const timeslot = [];
  const defaultDetails = {
    appointmentidentifier: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    serviceidentifier: '',
  };

  for (let i = 9; i < 20; i++) {
    for (let tracker = 1; tracker <= 4; tracker++) {
      let meridian = i >= 12 ? "pm" : "am";
      let realtime = i > 12 ? i - 12 : i;
      let time = "";

      switch (tracker) {
        case 1:
          time = `${realtime}${meridian}`;
          break;
        case 2:
          time = `${realtime}:15${meridian}`;
          break;
        case 3:
          time = `${realtime}:30${meridian}`;
          break;
        case 4:
          time = `${realtime}:45${meridian}`;
          break;
        default:
          break;
      }

      timeslot.push({ time, ...defaultDetails });
    }
  }

  return timeslot;
}

