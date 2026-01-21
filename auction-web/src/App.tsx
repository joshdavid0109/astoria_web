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
import AuctionCategoryPage from './pages/AuctionCategoryPage';
import AuctionsPage from './pages/AuctionsPage';
import CartPage from './pages/CartPage';
import TodaysDealsPage from './pages/TodaysDealsPage';
import BestSellersPage from './pages/BestSellersPage';
import CategoriesPage from './pages/CategoriesPage';

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
              <Route path="/auctions/category/:id" element={<AuctionCategoryPage/>}/>
              <Route path="/auctions" element={<AuctionsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="todays-deals" element={<TodaysDealsPage/> }/>
              <Route path="best-sellers" element={<BestSellersPage />} />
              <Route path="/categories" element={<CategoriesPage />} />


            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
