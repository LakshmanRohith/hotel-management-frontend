// src/components/HotelDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const HotelDetails = ({ apiBaseUrl }) => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [booking, setBooking] = useState({ checkin_date: '', checkout_date: '' });

    useEffect(() => {
        fetchHotelDetails();
        fetchRooms();
    }, [id]);

    const fetchHotelDetails = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/hotels/${id}`);
            setHotel(response.data);
        } catch (error) {
            console.error('Error fetching hotel details:', error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/hotels/${id}/rooms`);
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleBooking = async (roomId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to book a room.');
            return;
        }
        try {
            await axios.post(`${apiBaseUrl}/bookings`, {
                room_id: roomId,
                checkin_date: booking.checkin_date,
                checkout_date: booking.checkout_date
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Booking request sent successfully! Awaiting admin approval.');
        } catch (error) {
            alert('Booking failed. Please check your dates and try again.');
        }
    };

    if (!hotel) return <div>Loading...</div>;

    return (
        <div className="hotel-details-container">
            <div className="hotel-header">
                <img src={hotel.image_url} alt={hotel.name} className="hotel-image" />
                <h1>{hotel.name}</h1>
                <p>📍 {hotel.location}</p>
            </div>
            <div className="hotel-info">
                <p><strong>Description:</strong> {hotel.description}</p>
                <p><strong>Amenities:</strong> {hotel.amenities}</p>
                <p><strong>Contact:</strong> {hotel.contact_info}</p>
            </div>
            <hr />
            <div className="room-list">
                <h2>Available Rooms</h2>
                <div className="booking-dates">
                    <label>Check-in Date:
                        <input type="date" value={booking.checkin_date} onChange={(e) => setBooking({ ...booking, checkin_date: e.target.value })} />
                    </label>
                    <label>Check-out Date:
                        <input type="date" value={booking.checkout_date} onChange={(e) => setBooking({ ...booking, checkout_date: e.target.value })} />
                    </label>
                </div>
                {rooms.map(room => (
                    <div key={room.room_id} className="room-card">
                        <h3>{room.type}</h3>
                        <p><strong>Price:</strong> ${room.price} per night</p>
                        <p><strong>Capacity:</strong> {room.capacity} people</p>
                        <p><strong>Availability:</strong> {room.availability} rooms left</p>
                        {room.availability > 0 ? (
                            <button onClick={() => handleBooking(room.room_id)}>Book This Room</button>
                        ) : (
                            <button disabled>Fully Booked</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelDetails;