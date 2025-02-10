import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [createdEvents, setCreatedEvents] = useState([]);
    const [attendingEvents, setAttendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");

                // Fetch all events
                const allEventsRes = await axios.get(`http://localhost:4000/api/events`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("All Events Response:", allEventsRes.data);

                const allEvents = allEventsRes.data.events || [];

                const userId = user.userId; 
                const createdByUser = allEvents.filter(event => event.owner === userId);

                // Fetch attending events
                const attendingRes = await axios.get(`http://localhost:4000/api/events?attending=me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setCreatedEvents(createdByUser);
                setAttendingEvents(attendingRes.data.events || []);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to fetch dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:4000/api/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Remove deleted event from state
            setCreatedEvents(prevEvents => prevEvents.filter(event => event._id !== id));
        } catch (err) {
            alert("Failed to delete event.");
        }
    };

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-4">
    <div className="dashboard-container">
        <h2 className="text-center">Dashboard</h2>

        {/* Created Events Section */}
        <h3 className="mt-4">Your Created Events</h3>
        {createdEvents.length > 0 ? (
            <ul className="list-group">
                {createdEvents.map(event => (
                    <li key={event._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <a href={`/events/${event._id}`} className="event-link">{event.name}</a> 
                        <span className="event-date">{event.date}</span>
                        <div>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/edit-event/${event._id}`)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(event._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-muted">You haven't created any events yet.</p>
        )}

        {/* Attending Events Section */}
        <h3 className="mt-4">Events You're Attending</h3>
        {attendingEvents.length > 0 ? (
            <ul className="list-group">
                {attendingEvents.map(event => (
                    <li key={event._id} className="list-group-item">
                        <a href={`/events/${event._id}`} className="event-link">{event.name}</a> 
                        <span className="event-date">{event.date}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-muted">You're not attending any events yet.</p>
        )}
    </div>
</div>

    );
};

export default Dashboard;
