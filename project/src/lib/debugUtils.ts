import React from 'react';

// Debug utilities for helping identify issues
export const logAppState = () => {
  try {
    console.log('App initialized');
    
    // Check if MetaMask is available
    if (window.ethereum) {
      console.log('MetaMask is available');
    } else {
      console.error('MetaMask is not available');
    }
    
    // Log browser compatibility
    console.log('Browser user agent:', navigator.userAgent);
    
    // Log React version
    console.log('React version:', React.version);
    
    // Check local storage availability
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      console.log('Local storage is available');
    } catch (e) {
      console.error('Local storage is not available:', e);
    }
  } catch (e) {
    console.error('Error in logAppState:', e);
  }
}; 