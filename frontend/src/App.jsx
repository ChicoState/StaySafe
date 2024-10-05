import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <nav class="top-navbar">
        <a href="/" class="site-nav-title">StaySafe</a>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </div>
    <h1>Map here</h1>
    </>
  )
}

export default App
