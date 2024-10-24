const Navbar = () => {
    return (
        <nav className="top-navbar">
            <a href="/" className="site-nav-title">StaySafe</a>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <div className="top-navbar-right">
                <a href="/login">Login</a>
                <a href="/register">Register</a>
            </div>
        </nav>
    );
};

export default Navbar;