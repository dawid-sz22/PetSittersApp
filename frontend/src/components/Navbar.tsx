import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Assuming you have a CSS file for styling

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">Pet Sitters</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/petsitters">Pet Sitters</Link></li>
                <li><Link to="/petowners">Pet Owners</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
