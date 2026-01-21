import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'  // ← This line is crucial!
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <App />
  </BrowserRouter>
)