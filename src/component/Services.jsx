import React, { useContext, useMemo } from 'react';
import { AppContext } from './AppContext';
import '../css/Services.css';

const ServiceItem = ({ service }) => (
  <li className="service-item">
    <h3>{service.name}</h3>
    <p>Price: ${service.price}</p>
  </li>
);

export default function Services() {
  const { services } = useContext(AppContext);

  const memoizedServices = useMemo(() => services, [services]);

  return (
    <div className="services-container">
      <h1>Services</h1>
      <ul className="service-list">
        {memoizedServices.map((service, index) => (
          <ServiceItem key={index} service={service} />
        ))}
      </ul>
    </div>
  );
}