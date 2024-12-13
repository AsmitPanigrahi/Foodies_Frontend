import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Check if user is logged in on mount
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('Loaded user state:', parsedUser); // Debug log
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          // Only clear the corrupted user data, keep the token
          localStorage.removeItem('user');
        }
      } else {
        console.log('No stored user session found'); // Debug log
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      // Only clear data if there's a critical error
      if (error.name !== 'SecurityError' && error.name !== 'QuotaExceededError') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    try {
      console.log('Logging in user:', userData); // Debug log
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error saving auth state:', error);
      throw error; // Propagate the error to handle it in the login component
    }
  };

  const logout = () => {
    try {
      console.log('Logging out user'); // Debug log
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error during logout:', error);
      // Continue with the logout even if there's an error
    }
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
