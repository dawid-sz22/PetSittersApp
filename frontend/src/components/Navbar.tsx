import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="flex justify-between items-center bg-gray-800 p-4">
            <div className="text-white text-2xl">
                <Link to="/">Pet Sitters</Link>
            </div>
            <ul className="flex space-x-4">
                <li><Link to="/login" className="text-white text-lg hover:underline">Login</Link></li>
                <li><Link to="/petsitters" className="text-white text-lg hover:underline">Pet Sitters</Link></li>
                <li><Link to="/petowners" className="text-white text-lg hover:underline">Pet Owners</Link></li>
                <li><Link to="/profile" className="text-white text-lg hover:underline">Profile</Link></li>
                <li><Link to="/about" className="text-white text-lg hover:underline">About</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
