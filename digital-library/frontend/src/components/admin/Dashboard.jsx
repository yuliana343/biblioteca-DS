import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today'); // today, week, month, year
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try { 
      const mockStats = {
        totalBooks: 1234,
        totalUsers: 567,
        activeLoans: 89,
        pendingReservations: 23,
        overdueLoans: 12,
        availableBooks: 987,
        newBooksThisMonth: 45,
        averageLoanDuration: 14.5,
        userSatisfaction: 4.8,
        systemUptime: 99.9
      };

      const mockActivity = [
        { id: 1, type: 'loan', user: 'Juan Pérez', book: 'Cien años de soledad', time: '10:30 AM', status: 'completed' },
        { id: 2, type: 'reservation', user: 'María García', book: 'Harry Potter', time: '11:15 AM', status: 'pending' },
        { id: 3, type: 'return', user: 'Carlos López', book: 'El principito', time: '12:00 PM', status: 'completed' },
        { id: 4, type: 'new_book', user: 'Admin', book: 'Nuevo libro añadido', time: '01:30 PM', status: 'completed' },
        { id: 5, type: 'user_registration', user: 'Ana Martínez', book: 'Nuevo usuario', time: '02:45 PM', status: 'completed' }
      ];

      setTimeout(() => {
        setStats(mockStats);
        setRecentActivity(mockActivity);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const getMetricTrend = (metric) => {
     
    const trends = {
      totalBooks: { value: '+12%', positive: true },
      totalUsers: { value: '+8%', positive: true },
      activeLoans: { value: '-3%', positive: false },
      overdueLoans: { value: '+5%', positive: false },
      userSatisfaction: { value: '+0.2', positive: true }
    };
    return trends[metric] || { value: '0%', positive: true };
  };

  const getActivityIcon = (type) => {
    const icons = {
      loan: '📖',
      return: '📚',
      reservation: '📅',
      new_book: '➕',
      user_registration: '👤',
      renewal: '🔄',
      fine: '💰'
    };
    return icons[type] || '📊';
  };

  const getActivityColor = (type) => {
    const colors = {
      loan: '#4fc3f7',
      return: '#4caf50',
      reservation: '#ff9800',
      new_book: '#9c27b0',
      user_registration: '#2196f3',
      renewal: '#00bcd4',
      fine: '#f44336'
  
