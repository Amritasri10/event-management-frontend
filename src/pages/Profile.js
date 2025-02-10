import React, { useEffect, useState } from "react";

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatedName, setUpdatedName] = useState("");
    const [updatedEmail, setUpdatedEmail] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:4000/api/auth/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            if (res.ok) {
                setProfile(data);
                setUpdatedName(data.name);
                setUpdatedEmail(data.email);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:4000/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: updatedName,
                    email: updatedEmail,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Profile updated successfully!");
                setProfile(data);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("Failed to update profile");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Profile</h2>
            <p><strong>Name:</strong> <input type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} /></p>
            <p><strong>Email:</strong> <input type="email" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} /></p>
            <button onClick={updateProfile}>Update Profile</button>
        </div>
    );
};

export default Profile;
