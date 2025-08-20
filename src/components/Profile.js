// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ apiBaseUrl }) => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile(token);
            fetchUserBookings(token);
        }
    }, []);

    const fetchUserProfile = async (token) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchUserBookings = async (token) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/bookings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching user bookings:', error);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${apiBaseUrl}/bookings/${bookingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Booking canceled successfully!');
            fetchUserBookings(token); // Refresh bookings
        } catch (error) {
            alert('Failed to cancel booking.');
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <hr />
            <h3>My Bookings</h3>
            <div className="booking-history">
                {bookings.length > 0 ? (
                    bookings.map(booking => (
                        <div key={booking.booking_id} className="booking-card">
                            <p>Booking ID: {booking.booking_id}</p>
                            <p>Check-in: {new Date(booking.checkin_date).toLocaleDateString()}</p>
                            <p>Check-out: {new Date(booking.checkout_date).toLocaleDateString()}</p>
                            <p>Status: <span className={`status-${booking.status}`}>{booking.status}</span></p>
                            {booking.status === 'pending' && (
                                <button onClick={() => handleCancelBooking(booking.booking_id)}>Cancel Booking</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>You have no bookings.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;