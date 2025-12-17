import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import ScrollToTop from './components/scrollToTop';
import './App.css';
import CategoryPage from './pages/CategoryPage';
import ProductsPage from './pages/ProductsPage';
import AuctionDetailsPage from './pages/AuctionDetailsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />

        <div className="App min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/category/:name" element={<CategoryPage />} />
              <Route path="/auction/:id" element={<AuctionDetailsPage />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
