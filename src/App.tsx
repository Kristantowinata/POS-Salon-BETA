
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';

function App() {
    const [currentPage, setCurrentPage] = useState('reservations'); // Default to reservations

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard activePage="dashboard" onNavigate={setCurrentPage} />;
            case 'reservations':
                return <Reservations activePage="reservations" onNavigate={setCurrentPage} />;
            case 'checkout':
                return <Checkout activePage="checkout" onNavigate={setCurrentPage} onProceed={() => setCurrentPage('payment')} />;
            case 'payment':
                return <Payment onBack={() => setCurrentPage('checkout')} onComplete={() => setCurrentPage('dashboard')} />;
            case 'customers':
                return <Customers activePage="customers" onNavigate={setCurrentPage} />;
            case 'inventory':
                return <Inventory activePage="inventory" onNavigate={setCurrentPage} />;
            case 'settings':
                return <Settings activePage="settings" onNavigate={setCurrentPage} />;
            case 'analytics':
                return <Analytics activePage="analytics" onNavigate={setCurrentPage} />;
            default:
                return <Dashboard activePage="dashboard" onNavigate={setCurrentPage} />;
        }
    };

    return (
        <>
            {renderPage()}
        </>
    );
}

export default App;
