import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from './AppContext';
import '../css/Administrator.css';

const ServiceForm = ({ name, price, time, onNameChange, onPriceChange, onTimeChange, onSave, onCancel }) => (
  <div className="form-group">
    <input type="text" value={name} onChange={onNameChange} placeholder="Service Name" />
    <input type="number" value={price} onChange={onPriceChange} placeholder="Service Price" />
    <p></p>Service Time<select value={time} onChange={onTimeChange}>
      {[15, 30, 45, 60, 75, 90, 105, 120].map((option) => (
        <option key={option} value={option}>{option} minutes</option>
      ))}
    </select>
    <button className="service-button" onClick={onSave}>Save</button>
    {onCancel && <button className="service-button" onClick={onCancel}>Cancel</button>}
  </div>
);

const ArtistForm = ({ name, onNameChange, onSave, onCancel }) => (
  <div className="form-group">
    <input type="text" value={name} onChange={onNameChange} placeholder="Barber Name" />
    <button className="service-button" onClick={onSave}>Save</button>
    {onCancel && <button className="service-button" onClick={onCancel}>Cancel</button>}
  </div>
);

export default function Administrator() {
  const { services, setServices, artists, setArtists, isAuthenticated } = useContext(AppContext);
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editTime, setEditTime] = useState('');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceTime, setNewServiceTime] = useState('');
  const [editArtistIndex, setEditArtistIndex] = useState(null);
  const [editArtistName, setEditArtistName] = useState('');
  const [newArtistName, setNewArtistName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleDeleteService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleEditService = (index) => {
    setEditIndex(index);
    setEditName(services[index].name);
    setEditPrice(services[index].price);
    setEditTime(services[index].servicetime * 15);
  };

  const handleSaveService = () => {
    const updatedServices = [...services];
    updatedServices[editIndex] = { ...updatedServices[editIndex], name: editName, price: editPrice, servicetime: editTime / 15 };
    setServices(updatedServices);
    setEditIndex(null);
  };

  const handleAddService = () => {
    const newService = { name: newServiceName, price: parseFloat(newServicePrice), servicetime: parseFloat(newServiceTime / 15) };
    setServices([...services, newService]);
    setNewServiceName('');
    setNewServicePrice('');
    setNewServiceTime('');
  };

  const handleDeleteArtist = (index) => {
    setArtists(artists.filter((_, i) => i !== index));
  };

  const handleEditArtist = (index) => {
    setEditArtistIndex(index);
    setEditArtistName(artists[index]);
  };

  const handleSaveArtist = () => {
    const updatedArtists = [...artists];
    updatedArtists[editArtistIndex] = editArtistName;
    setArtists(updatedArtists);
    setEditArtistIndex(null);
  };

  const handleAddArtist = () => {
    setArtists([...artists, newArtistName]);
    setNewArtistName('');
  };

  return (
    <div className="administrator-container">
      <h1>Welcome to All Stars Barbers</h1>
      <div className="services-section">
        <div className="services-list-container">
          <h2>Services</h2>
          <ul className="services-list">
            {services.map((service, index) => (
              <li key={index} className="service-item">
                {editIndex === index ? (
                  <ServiceForm
                    name={editName}
                    price={editPrice}
                    time={editTime}
                    onNameChange={(e) => setEditName(e.target.value)}
                    onPriceChange={(e) => setEditPrice(e.target.value)}
                    onTimeChange={(e) => setEditTime(e.target.value)}
                    onSave={handleSaveService}
                    onCancel={() => setEditIndex(null)}
                  />
                ) : (
                  <>
                    <span className="service-name">{service.name}</span>
                    <span className="service-price">${service.price}</span>
                    <span className="service-time">{service.servicetime * 15} minutes</span>
                    <div className="button-container">
                      <button className="service-button" onClick={() => handleEditService(index)}>Edit</button>
                      <button className="service-button" onClick={() => handleDeleteService(index)}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="add-service">
          <h2>Add New Service</h2>
          <ServiceForm
            name={newServiceName}
            price={newServicePrice}
            time={newServiceTime}
            onNameChange={(e) => setNewServiceName(e.target.value)}
            onPriceChange={(e) => setNewServicePrice(e.target.value)}
            onTimeChange={(e) => setNewServiceTime(e.target.value)}
            onSave={handleAddService}
          />
        </div>
      </div>
      <div className="barbers-section">
        <div className="barbers-list-container">
          <h2>Barbers</h2>
          <ul className="barbers-list">
            {artists.map((artist, index) => (
              <li key={index} className="barber-item">
                {editArtistIndex === index ? (
                  <ArtistForm
                    name={editArtistName}
                    onNameChange={(e) => setEditArtistName(e.target.value)}
                    onSave={handleSaveArtist}
                    onCancel={() => setEditArtistIndex(null)}
                  />
                ) : (
                  <>
                    <h3>{artist}</h3>
                    <div className="button-container">
                      <button className="service-button" onClick={() => handleEditArtist(index)}>Edit</button>
                      <button className="service-button" onClick={() => handleDeleteArtist(index)}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="add-barber">
          <h2>Add New Barber</h2>
          <ArtistForm
            name={newArtistName}
            onNameChange={(e) => setNewArtistName(e.target.value)}
            onSave={handleAddArtist}
          />
        </div>
      </div>
    </div>
  );
}