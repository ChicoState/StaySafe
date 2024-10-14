import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { APIProvider, Map } from '@vis.gl/react-google-maps'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
    </>
  )
}

function Layout() {
  return (
    <div>
      <nav className="top-navbar">
        <a href="/" className="site-nav-title">StaySafe</a>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>

      <hr />
      <Outlet />
    </div>
  )
}

function GoogleMap() {
  const GMAPS_API_KEY = globalThis.GMAPS_API_KEY ?? (process.env.GMAPS_API_KEY);
  return (
    <>
      <APIProvider apiKey={GMAPS_API_KEY}>
        <Map
          style={{width: '100vw', height: '100vh'}}
          defaultZoom={3}
          defaultCenter={{lat: 22.54992, lng: 0}}
          gestureHandling={'greedy'}
        />
      </APIProvider>
    </>
  );
}

function Home() {
  return (
    <>
      {<GoogleMap />}
    </>
  )
}

function About() {
  return (
    <div>
      <p>StaySafe uses FBI data and Google Maps to make it easy to view the crime statistics of different areas.</p>
    </div>
  )
}

function Login() {
  return (
    <div>
      <p>Login page here</p>
    </div>
  )
}

function Register() {
  return (
    <div>
      <p>Register page here</p>
    </div>
  )
}

export default App
