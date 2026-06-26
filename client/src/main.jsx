import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'

import router from './app/router.jsx'
import Providers from './app/Providers.jsx'
import theme from './theme/muiTheme.js'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ThemeProvider>
  </StrictMode>
);
