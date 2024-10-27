// src/components/layout/Layout.jsx
import Navbar from './Navbar';
import { Outlet } from "react-router-dom";

const Layout = () => {

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;