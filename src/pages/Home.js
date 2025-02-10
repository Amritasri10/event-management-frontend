import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/events/", {
                    params: { trending: true },
                });

                if (response.data && response.data.events) {
                    setEvents(response.data.events);
                } else {
                    setError("No events found.");
                }
            } catch (err) {
                setError("Error fetching events.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="home-container">

            <section className="hero">
            <Slider {...sliderSettings}>
    <div>
        <img src="/images/event-party1.jpg" alt="Event 1" className="slider-image" />
    </div>
    <div>
        <img src="/images/event-2.jpg" alt="Event 2" className="slider-image" />
    </div>

</Slider>

                <h1>🎉 Welcome to EventHub!</h1>
                <p>Discover amazing events near you</p>
                <button onClick={() => navigate("/events")}>Explore Events</button>
            </section>

            {/* Trending Events Section */}
            <section className="trending-events">
                <h2>🔥 Trending Events</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}
                <div className="events-list">
                    {events.length > 0 ? (
                        events.map(event => (
                            <div key={event._id} className="event-card">
                                <h3>{event.name}</h3>
                                <p>{event.description}</p>
                                <p><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
                                <button onClick={() => navigate(`/events/${event._id}`)}>View Details</button>
                            </div>
                        ))
                    ) : (
                        !loading && <p>No trending events available.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
