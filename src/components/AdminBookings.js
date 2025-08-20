// src/components/AdminBookings.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminBookings = ({ apiBaseUrl }) => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${apiBaseUrl}/admin/bookings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching admin bookings:', error);
            alert('Failed to fetch bookings. Check your admin permissions.');
        }
    };

    const handleAction = async (bookingId, action) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${apiBaseUrl}/bookings/${bookingId}/${action}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(`Booking ${action}d successfully!`);
            fetchBookings(); // Refresh the list
        } catch (error) {
            alert(`Failed to ${action} booking.`);
        }
    };

    return (
        <div>
            <h2>Manage Bookings</h2>
            <div className="booking-history">
                {bookings.length > 0 ? (
                    bookings.map(booking => (
                        <div key={booking.booking_id} className="booking-card">
                            <p><strong>User:</strong> {booking.user_name}</p>
                            <p><strong>Hotel:</strong> {booking.hotel_name}</p>
                            <p><strong>Room:</strong> {booking.room_type}</p>
                            <p><strong>Check-in:</strong> {new Date(booking.checkin_date).toLocaleDateString()}</p>
                            <p><strong>Check-out:</strong> {new Date(booking.checkout_date).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> <span className={`status-${booking.status}`}>{booking.status}</span></p>
                            {booking.status === 'pending' && (
                                <>
                                    <button onClick={() => handleAction(booking.booking_id, 'approve')}>Approve</button>
                                    <button onClick={() => handleAction(booking.booking_id, 'cancel')}>Cancel</button>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No bookings to manage.</p>
                )}
            </div>
        </div>
    );
};

export default AdminBookings;