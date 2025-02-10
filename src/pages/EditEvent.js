import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EditEvent = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [eventData, setEventData] = useState({
        name: "",
        date: "",
        location: "",
        description: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`http://localhost:4000/api/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.owner !== user.userId) {
                    alert("You are not authorized to edit this event.");
                    navigate("/dashboard");
                    return;
                }

                setEventData(res.data);
            } catch (err) {
                setError("Failed to fetch event details.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, navigate, user]);

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:4000/api/events/${id}`, eventData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Event updated successfully!");
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to update event.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:4000/api/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Event deleted successfully!");
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to delete event.");
        }
    };

    if (loading) return <p>Loading event...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Edit Event</h2>
            <form onSubmit={handleUpdate}>
                <input type="text" name="name" value={eventData.name} onChange={handleChange} required />
                <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
                <input type="text" name="location" value={eventData.location} onChange={handleChange} required />
                <textarea name="description" value={eventData.description} onChange={handleChange} required />
                <button type="submit">Update Event</button>
            </form>
            <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>
                Delete Event
            </button>
        </div>
    );
};

export default EditEvent;
