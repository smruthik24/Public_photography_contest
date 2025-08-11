import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuthContext } from '../context/UserAuthContext';
import { AdminAuthContext } from '../context/AdminAuthContext';

const NavbarComponent = () => {
    const navigate = useNavigate();


    const { isAuth: isUserAuth, logout: userLogout } = useContext(UserAuthContext);
    const { isAdminAuth, logout: adminLogout } = useContext(AdminAuthContext);

    const handleLogout = () => {
        if (isAdminAuth) {
            adminLogout();
        } else {
            userLogout();
        }
        navigate('/');
    };

    return (
        <div className="fixed top-0 w-full z-80 shadow bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            <div className="container mx-auto navbar">
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost text-xl normal-case text-white">
                        Photography Contest
                    </Link>
                </div>
                <ul className="menu menu-horizontal px-1 flex">
                    {(isUserAuth || isAdminAuth) ? (
                        <>
                             <li className="mt-2">
                            <li><Link to="/" className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors no-underline">Home</Link></li>
                            </li>
                            <li className="ml-2">
                            <li className="mt-2">
                            <li><Link to="/contests" className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors no-underline">Contests</Link></li>
                            </li>
                            </li>
                            <li className="mt-2">
                            {isAdminAuth && <li><Link to="/admin-dashboard" className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors no-underline">Dashboard</Link></li>}
                            </li>
                            
                            <li>
                                <button className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors mx-2 no-underline" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>   
                            <li className="mt-2">
                            <li><Link to="/login" className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors no-underline">Login</Link></li>
                            </li>
                            <li className="mt-2">
                            <li><Link to="/register" className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors mx-2 no-underline">Register</Link></li>
                            </li>
                            <li className="mt-2">
                            <li><Link to="/admin-login" className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors no-underline">Admin Login</Link></li>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NavbarComponent;
