import React from 'react';
import { Link } from 'react-router-dom';

function Navbar () {
    return (
        <nav className="flex justify-between items-center bg-gray-800 p-4">
            <div className="text-white text-2xl">
                <Link to={"/register"}>Pet Sitters</Link>
            </div>
            <ul className="flex space-x-4">
                <li><Link to={"/register"} className="text-white text-lg hover:underline rounded-lg px-3 py-1">Login</Link></li>
                <li><Link to={"/register"} className="text-white text-lg hover:underline rounded-lg px-3 py-1">Pet Sitters</Link></li>
                <li><Link to={"/register"} className="text-white text-lg hover:underline rounded-lg px-3 py-1">Pet Owners</Link></li>
                <li><Link to={"/register"} className="text-white text-lg hover:underline rounded-lg px-3 py-1">Profile</Link></li>
                <li><Link to={"/register"} className="text-white text-lg hover:underline rounded-lg px-3 py-1">About</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
