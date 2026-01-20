import React from 'react'
import { Button } from './components/ui/button'
import RegisterEmployee from './pages/authentication/RegisterEmployee'

const App = () => {
  return (
    <div>
      <h1 class="text-3xl font-bold underline">
        <RegisterEmployee />
      </h1>
    </div>
  )
}

export default App
