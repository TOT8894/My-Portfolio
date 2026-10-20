import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_DATA } from '../data/defaultPortfolioData';
import { portfolioService } from '../services/api';

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolioData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await portfolioService.getAllData();
      if (response && response.data && typeof response.data === 'object') {
        const dbData = response.data;
        
        // Merge with DEFAULT_DATA so any missing section gracefully keeps demo structure
        const mergedData = {
          profile: dbData.profile && Object.keys(dbData.profile).length > 0
            ? { ...DEFAULT_DATA.profile, ...dbData.profile }
            : DEFAULT_DATA.profile,
          socialChannels: Array.isArray(dbData.socialChannels) && dbData.socialChannels.length > 0
            ? dbData.socialChannels
            : DEFAULT_DATA.socialChannels,
          specializations: Array.isArray(dbData.specializations) && dbData.specializations.length > 0
            ? dbData.specializations
            : DEFAULT_DATA.specializations,
          experience: Array.isArray(dbData.experience) && dbData.experience.length > 0
            ? dbData.experience
            : DEFAULT_DATA.experience,
          projects: Array.isArray(dbData.projects) && dbData.projects.length > 0
            ? dbData.projects
            : DEFAULT_DATA.projects,
          certificates: Array.isArray(dbData.certificates) && dbData.certificates.length > 0
            ? dbData.certificates
            : DEFAULT_DATA.certificates,
          cv: dbData.cv !== undefined ? dbData.cv : DEFAULT_DATA.cv,
          announcement: dbData.announcement || DEFAULT_DATA.announcement,
          footer: dbData.footer || DEFAULT_DATA.footer,
        };

        setPortfolioData(mergedData);
        setIsUsingFallback(false);
      } else {
        setPortfolioData(DEFAULT_DATA);
        setIsUsingFallback(true);
      }
    } catch (err) {
      console.warn("Backend not reached or empty. Gracefully serving default demo data:", err.message);
      setPortfolioData(DEFAULT_DATA);
      setIsUsingFallback(true);
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
        isUsingFallback,
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
