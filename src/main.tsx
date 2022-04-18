import React from 'react'
import { RecoilRoot } from 'recoil';
import { render } from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter, Routes } from 'react-router-dom'

render(
  <React.StrictMode>
    <BrowserRouter basename="/next">
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
