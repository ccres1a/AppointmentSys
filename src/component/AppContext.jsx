import React, { createContext, useEffect, useState } from 'react';
export const AppContext = createContext();
import barbertimeslot from './barbertimeslot';
export const AppProvider = ({ children }) => {
    const [services, setServices] = useState([
        {
            name: 'Haircut',
            price: 32,
            servicetime: 2,
        },
        {
            name: 'Beard Trim',
            price: 28,
            servicetime: 2,
        },
        {
            name: 'Shave',
            price: 30,
            servicetime: 2,
        },
        {
            name: 'Haircut & Beard Trim',
            price: 45,
            servicetime: 4,
        },
        {
            name: 'Haircut & Shave',
            price: 50,
            servicetime: 4,
        },
        {
            name: 'Buzzcut',
            price: 20,
            servicetime: 1,
        },
        {
            name: 'Skin Fade',
            price: 37,
            servicetime: 3,
        }
    ]);
    const [artists, setArtists] = useState(['Kevin', 'John', 'Mike', 'Tom']);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [appointmentCount, setAppointmentCount] = useState(0);

    useEffect(() => {
        const barbertimeslotdata = barbertimeslot(artists);
        setAppointments(barbertimeslotdata);
    }, [artists]);

    return (
        <AppContext.Provider value={{ appointmentCount, setAppointmentCount,services, setServices, artists, setArtists, isAuthenticated, setIsAuthenticated, appointments, setAppointments }}>
            {children}
        </AppContext.Provider>
    );
};