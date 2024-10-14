import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {APIProvider, Map} from '@vis.gl/react-google-maps'

function App() {
  const [count, setCount] = useState(0)
  const GMAPS_API_KEY = globalThis.GMAPS_API_KEY ?? (process.env.GMAPS_API_KEY);
  return (
    <>
    <div>
      <nav className="top-navbar">
        <a href="/" className="site-nav-title">StaySafe</a>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </div>
    <APIProvider apiKey={GMAPS_API_KEY}>
      <Map
        style={{width: '100vw', height: '100vh'}}
        defaultZoom={3}
        defaultCenter={{lat: 22.54992, lng: 0}}
        gestureHandling={'greedy'}
      />
    </APIProvider>
    </>
  )
}


export default App
