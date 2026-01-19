
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as Sidebar } from './Sidebar';
export { default as SearchBar } from './SearchBar';
export { default as Pagination } from './Pagination';
export { default as LoadingSpinner, BookSkeleton, TableSkeleton, CardSkeleton } from './LoadingSpinner';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export { default as LoginForm } from './LoginForm';
export { default as RegisterForm } from './RegisterForm';

export { default as ActiveLoans } from './ActiveLoans';
export { default as LoanHistory } from './LoanHistory';
export { default as RenewLoanModal } from './RenewLoanModal';

export { default as ReservationList } from './ReservationList';
export { default as CreateReservation } from './CreateReservation';
