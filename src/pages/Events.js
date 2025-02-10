import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Events.css";
const Events = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");

    const fetchEvents = useCallback(async () => {
        try {
            let query = "http://localhost:4000/api/events/";
            if (search) query += `search=${search}&`;
            if (date) query += `date=${date}&`;
            if (location) query += `location=${location}&`;

            const response = await axios.get(query);
            setEvents(response.data.events);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }, [search, date, location]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]); 

    return (
        <div className="events-container">
            
            <div className="filters">
                <input type="text" placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <button onClick={fetchEvents}>Search</button>
            </div>
            <h2>All Events</h2>
            <div className="event-list">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event._id} className="event-card">
                            <h3>{event.name}</h3>
                            <p>{event.description}</p>
                            <p><strong>Date:</strong> {event.date}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                        </div>
                    ))
                ) : (
                    <p>No events found</p>
                )}
            </div>
        </div>
    );
};

export default Events;
