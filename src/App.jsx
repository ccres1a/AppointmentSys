import { Routes, Route } from 'react-router';
import Homepage from './component/Homepage';
import ViewAppointment from './component/ViewAppointment';
import AppointmentBooking from './component/AppointmentBooking';
import Navbar from './component/Navigationbar.jsx';
import Services from './component/Services';
import About from './component/About';
import Administrator from './component/Administrator';
import { AppProvider } from './component/AppContext.jsx'; // Import the global CSS file

function App() {
  return (
    <>
      <AppProvider>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/appointmentbooking" element={<AppointmentBooking />} />
            <Route path="/viewappointment" element={<ViewAppointment />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/administrator" element={<Administrator />} />
          </Routes>
        </div>
      </AppProvider>
    </>
  );
}

export default App;
