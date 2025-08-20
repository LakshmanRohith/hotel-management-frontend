// src/components/Hotels.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Hotels = ({ apiBaseUrl }) => {
    const [hotels, setHotels] = useState([]);
    const [search, setSearch] = useState({ location: '', name: '' });

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/hotels`);
            setHotels(response.data);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${apiBaseUrl}/hotels`, { params: search });
            setHotels(response.data);
        } catch (error) {
            console.error('Error searching hotels:', error);
        }
    };

    return (
        <div>
            <h2>Hotels</h2>
            <form onSubmit={handleSearch} className="search-form">
                <input type="text" placeholder="Search by location" value={search.location} onChange={(e) => setSearch({ ...search, location: e.target.value })} />
                <input type="text" placeholder="Search by name" value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} />
                <button type="submit">Search</button>
            </form>
            <div className="hotel-list">
                {hotels.map(hotel => (
                    <div key={hotel.hotel_id} className="hotel-card">
                        <img src={hotel.image_url} alt={hotel.name} />
                        <h3><Link to={`/hotels/${hotel.hotel_id}`}>{hotel.name}</Link></h3>
                        <p>📍 {hotel.location}</p>
                        <p>{hotel.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hotels;