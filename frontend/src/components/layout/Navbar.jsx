import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="top-navbar">
      <Link to="/" className="site-nav-title">StaySafe</Link>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <div className="top-navbar-right">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;