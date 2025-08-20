// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminBookings from './AdminBookings';

const AdminDashboard = ({ apiBaseUrl }) => {
    const [hotels, setHotels] = useState([]);
    const [view, setView] = useState('hotels');
    const [selectedHotel, setSelectedHotel] = useState(null); // State to manage the selected hotel for room management
    const [rooms, setRooms] = useState([]);
    const [newHotel, setNewHotel] = useState({ name: '', location: '', image_url: '' });
    const [newRoom, setNewRoom] = useState({ type: '', price: '', capacity: '', availability: '' });

    const navigate = useNavigate();

    useEffect(() => {
        fetchAdminHotels();
    }, []);

    const fetchAdminHotels = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const response = await axios.get(`${apiBaseUrl}/hotels`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setHotels(response.data);
        } catch (error) {
            console.error('Error fetching hotels for admin:', error);
            if (error.response?.status === 403) {
                alert('Access denied. Admin role required.');
                navigate('/');
            }
        }
    };

    const handleDeleteHotel = async (hotelId) => {
        const token = localStorage.getItem('token');
        if (window.confirm('Are you sure you want to delete this hotel? This will also delete all its rooms and bookings.')) {
            try {
                await axios.delete(`${apiBaseUrl}/hotels/${hotelId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Hotel deleted successfully.');
                fetchAdminHotels();
            } catch (error) {
                alert('Failed to delete hotel.');
            }
        }
    };

    const handleAddHotel = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${apiBaseUrl}/hotels`, newHotel, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Hotel added successfully!');
            setNewHotel({ name: '', location: '', image_url: '' });
            fetchAdminHotels();
        } catch (error) {
            alert('Failed to add hotel.');
        }
    };

    const handleManageRooms = async (hotel) => {
        setSelectedHotel(hotel);
        setView('rooms');
        await fetchRooms(hotel.hotel_id);
    };

    const fetchRooms = async (hotelId) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/hotels/${hotelId}/rooms`);
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${apiBaseUrl}/rooms`, { ...newRoom, hotel_id: selectedHotel.hotel_id }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Room added successfully!');
            setNewRoom({ type: '', price: '', capacity: '', availability: '' });
            fetchRooms(selectedHotel.hotel_id);
        } catch (error) {
            alert('Failed to add room.');
        }
    };

    const handleDeleteRoom = async (roomId) => {
        const token = localStorage.getItem('token');
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await axios.delete(`${apiBaseUrl}/rooms/${roomId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Room deleted successfully.');
                fetchRooms(selectedHotel.hotel_id);
            } catch (error) {
                alert('Failed to delete room.');
            }
        }
    };
    
    // The conditional rendering part
    return (
        <div className="admin-dashboard-container">
            <h2>Admin Dashboard</h2>
            
            <div className="admin-nav">
                <button onClick={() => { setView('hotels'); setSelectedHotel(null); }}>Manage Hotels</button>
                <button onClick={() => setView('bookings')}>Manage Bookings</button>
                {selectedHotel && <button onClick={() => setView('rooms')}>Back to Room List</button>}
            </div>

            {view === 'hotels' && (
                <>
                    <h3>Add New Hotel</h3>
                    <form onSubmit={handleAddHotel} className="admin-form">
                        <input type="text" value={newHotel.name} onChange={(e) => setNewHotel({...newHotel, name: e.target.value})} placeholder="Hotel Name" required />
                        <input type="text" value={newHotel.location} onChange={(e) => setNewHotel({...newHotel, location: e.target.value})} placeholder="Location" required />
                        <input type="text" value={newHotel.image_url} onChange={(e) => setNewHotel({...newHotel, image_url: e.target.value})} placeholder="Image URL" required />
                        <button type="submit">Add Hotel</button>
                    </form>
                    <hr />
                    <h3>Manage Hotels</h3>
                    <div className="hotel-list">
                        {hotels.map(hotel => (
                            <div key={hotel.hotel_id} className="admin-card">
                                <h4>{hotel.name}</h4>
                                <p>{hotel.location}</p>
                                <button onClick={() => handleDeleteHotel(hotel.hotel_id)}>Delete</button>
                                <button onClick={() => handleManageRooms(hotel)}>Manage Rooms</button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {view === 'rooms' && selectedHotel && (
                <div>
                    <h3>Manage Rooms for {selectedHotel.name}</h3>
                    <form onSubmit={handleAddRoom} className="admin-form">
                        <input type="text" value={newRoom.type} onChange={(e) => setNewRoom({...newRoom, type: e.target.value})} placeholder="Room Type (e.g., Suite)" required />
                        <input type="number" value={newRoom.price} onChange={(e) => setNewRoom({...newRoom, price: e.target.value})} placeholder="Price" required />
                        <input type="number" value={newRoom.capacity} onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})} placeholder="Capacity" required />
                        <input type="number" value={newRoom.availability} onChange={(e) => setNewRoom({...newRoom, availability: e.target.value})} placeholder="Availability" required />
                        <button type="submit">Add Room</button>
                    </form>
                    <hr />
                    <h4>Existing Rooms</h4>
                    <div className="hotel-list">
                        {rooms.map(room => (
                            <div key={room.room_id} className="room-card">
                                <h5>{room.type}</h5>
                                <p>Price: ${room.price}</p>
                                <p>Capacity: {room.capacity}</p>
                                <p>Available: {room.availability}</p>
                                <button onClick={() => handleDeleteRoom(room.room_id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'bookings' && <AdminBookings apiBaseUrl={apiBaseUrl} />}
        </div>
    );
};

export default AdminDashboard;