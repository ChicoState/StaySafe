// src/components/layout/Layout.jsx
import Navbar from './Navbar';
import { Outlet } from "react-router-dom";

const Layout = () => { 

    return (
        <div>
            <Navbar />
            <hr />
            <Outlet />
        </div>
    );
};

export default Layout;