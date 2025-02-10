import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EventDetails = () => {
    const { id } = useParams(); 
    const { user } = useContext(AuthContext); 
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [attending, setAttending] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/events/${id}`);
                setEvent(res.data);
                setLoading(false);
            } catch (err) {
                setError("Event not found.");
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleAttend = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:4000/api/events/${id}/attend`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAttending(true);
        } catch (err) {
            setError("Failed to attend event.");
        }
    };

    if (loading) return <p>Loading event...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>{event?.name}</h2>
            <p>{event?.description}</p>
            <p><strong>Date:</strong> {event?.date}</p>
            <p><strong>Location:</strong> {event?.location}</p>

            {user && (
                <button onClick={handleAttend} disabled={attending}>
                    {attending ? "You are attending" : "Attend Event"}
                </button>
            )}
        </div>
    );
};

export default EventDetails;
