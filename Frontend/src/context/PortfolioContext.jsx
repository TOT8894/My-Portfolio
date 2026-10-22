import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { portfolioService } from '../services/api';

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState({
    profile: {},
    socialChannels: [],
    specializations: [],
    experience: [],
    projects: [],
    certificates: [],
    cv: null,
    announcement: {},
    footer: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolioData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await portfolioService.getAllData();
      if (!response?.data || typeof response.data !== 'object') {
        throw new Error('Portfolio API returned an invalid response.');
      }
      setPortfolioData(response.data);
    } catch (err) {
      console.error('Could not load portfolio data from the database:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        setPortfolioData,
        loading,
        error,
        refreshPortfolioData: fetchPortfolioData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
