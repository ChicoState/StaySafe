import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="top-navbar">
      <Link to="/" className="site-nav-title">StaySafe</Link>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <div className="top-navbar-right">
        {isLoggedIn ? (
          <Link to="/" onClick={logout}>Log Out</Link>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
