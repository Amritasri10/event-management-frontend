import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EventForm = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [event, setEvent] = useState({
        name: "",
        description: "",
        date: "",
        location: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (id) {
        
            const fetchEvent = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(`http://localhost:4000/api/events/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setEvent(res.data);
                } catch (err) {
                    setError("Failed to load event details.");
                } finally {
                    setLoading(false);
                }
            };
            fetchEvent();
        } else {
            setLoading(false);
        }
    }, [id, user, navigate]);

    const handleChange = (e) => {
        setEvent({ ...event, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (id) {
                // Update event
                await axios.put(`http://localhost:4000/api/events/${id}`, event, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Create new event
                await axios.post(`http://localhost:4000/api/events`, event, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to save event.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>{id ? "Edit Event" : "Create Event"}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={event.name} onChange={handleChange} placeholder="Title" required />
                <textarea name="description" value={event.description} onChange={handleChange} placeholder="Description" required />
                <input type="date" name="date" value={event.date} onChange={handleChange} required />
                <input type="text" name="location" value={event.location} onChange={handleChange} placeholder="Location" required />
                <button type="submit">{id ? "Update Event" : "Create Event"}</button>
            </form>
        </div>
    );
};

export default EventForm;
