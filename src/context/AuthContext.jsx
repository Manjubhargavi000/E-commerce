/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // Load authenticated user from localStorage on init
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auralux_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [otpRequested, setOtpRequested] = useState(false);
  const [tempPhone, setTempPhone] = useState('');

  // Persist user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('auralux_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auralux_user');
    }
  }, [user]);

  // Request OTP phase
  const requestOtp = (phone) => {
    setTempPhone(phone);
    setOtpRequested(true);
    // Print simulated OTP code to console/alert for user convenience
    console.log(`[AUTH] Simulated OTP code for +91 ${phone} is 123456`);
  };

  // Verify OTP phase
  const verifyOtp = (code) => {
    // We accept '123456' as the mock OTP code
    if (code === '123456') {
      const authenticatedUser = { phone: tempPhone };
      setUser(authenticatedUser);
      setOtpRequested(false);
      setTempPhone('');
      return true;
    }
    return false;
  };

  // Cancel OTP request phase
  const cancelOtpRequest = () => {
    setOtpRequested(false);
    setTempPhone('');
  };

  // Log out user
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        otpRequested,
        tempPhone,
        requestOtp,
        verifyOtp,
        cancelOtpRequest,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
