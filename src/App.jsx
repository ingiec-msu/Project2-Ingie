import { useState } from 'react'
import './App.css'
import Events from './Events.jsx'


function App() {
  const [count, setCount] = useState(0)


  return (
    <>
      <h1>True Fan</h1>
      
      <div>
        <Events />
      </div>

    </>
  )
}


export default App
