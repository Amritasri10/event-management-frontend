import React from "react";
import { BrowserRouter as Router, Route, Routes ,Navigate} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login  from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Dashboard from "./pages/Dashboard";
import EventForm from "./pages/EventForm";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    return user || token ? children : <Navigate to="/login" />;
};


const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/create-event" element={<CreateEvent />} />
                     <Route path="/edit-event/:id" element={<EditEvent />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create-event" element={<EventForm isEdit={false} />} />
                    <Route path="/edit-event/:id" element={<EventForm isEdit = {true}/>} />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
};

export default App;
