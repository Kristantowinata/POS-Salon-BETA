
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/ui/ToastContainer';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

function AppRoutes() {
    const { isLoggedIn, isLoading } = useAuth();

    // Show loading spinner while restoring session
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-400 text-sm font-medium">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Login />;
    }

    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/services" element={<Settings defaultTab="Services & Stylists" />} />
                <Route path="/settings" element={<Settings defaultTab="General" />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </MainLayout>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <AppRoutes />
                <ToastContainer />
            </ErrorBoundary>
        </BrowserRouter>
    );
}

export default App;
