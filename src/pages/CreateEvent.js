import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./CreateEvent.css";
const CreateEvent = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [eventData, setEventData] = useState({
        name: "",
        date: "",
        location: "",
        description: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle form input change
    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 
        setLoading(true);
        
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token);
            
        
            if (!token) {
                setError("User is not authenticated.");
                setLoading(false);
                return;
            }

            
            if (!eventData.name || !eventData.date || !eventData.location || !eventData.description) {
                setError("All fields are required.");
                setLoading(false);
                return;
            }

            // Send POST request
            const res = await axios.post(
                "http://localhost:4000/api/events",
                eventData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            console.log("Event Created Successfully:", res.data);
            navigate("/dashboard");
        } catch (err) {
            console.error("Error creating event:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to create event.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
        <div className="form-container">
            <h2>Create Event</h2>
            {error && <p className="text-danger">{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input type="text" name="name" placeholder="Event Name" 
                        value={eventData.name} onChange={handleChange} required
                        className="form-control" />
                </div> 
    
                <div className="mb-3">
                    <input type="date" name="date" 
                        value={eventData.date} onChange={handleChange} required
                        className="form-control" />
                </div>
    
                <div className="mb-3">
                    <input type="text" name="location" placeholder="Location" 
                        value={eventData.location} onChange={handleChange} required
                        className="form-control" />
                </div>
    
                <div className="mb-3">
                    <textarea name="description" placeholder="Event Description" 
                        value={eventData.description} onChange={handleChange} required
                        className="form-control" rows="4"></textarea>
                </div>
    
                <div className="text-center">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Creating..." : "Create Event"}
                    </button>
                </div>
            </form>
        </div>
    </div>
    

    );
};

export default CreateEvent;
