import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Migrate existing users to normalized format (runs once on mount)
  useEffect(() => {
    try {
      const usersString = localStorage.getItem('users');
      if (usersString) {
        const users = JSON.parse(usersString);
        let needsUpdate = false;
        
        const migratedUsers = users.map((u) => {
          const normalizedEmail = (u.email || '').trim().toLowerCase();
          const normalizedPassword = (u.password || '').trim();
          
          // Check if migration is needed
          if (u.email !== normalizedEmail || u.password !== normalizedPassword) {
            needsUpdate = true;
            return {
              ...u,
              email: normalizedEmail,
              password: normalizedPassword,
            };
          }
          return u;
        });
        
        if (needsUpdate) {
          localStorage.setItem('users', JSON.stringify(migratedUsers));
          console.log('Migrated users to normalized format');
        }
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    try {
      // Get all users from localStorage
      const usersString = localStorage.getItem('users');
      const users = usersString ? JSON.parse(usersString) : [];
      
      // Debug: Log users array (remove in production)
      // console.log('Available users:', users.map(u => ({ email: u.email, hasPassword: !!u.password })));
      
      // Normalize email to lowercase for comparison and trim whitespace
      const normalizedEmail = (email || '').trim().toLowerCase();
      const normalizedPassword = (password || '').trim();
      
      // Debug: Log login attempt
      // console.log('Login attempt:', { normalizedEmail, passwordLength: normalizedPassword.length });
      
      if (!normalizedEmail || !normalizedPassword) {
        return { success: false, error: 'Email and password are required.' };
      }
      
      // Find user by email (case-insensitive) and exact password match
      const foundUser = users.find((u) => {
        const userEmail = (u.email || '').trim().toLowerCase();
        const userPassword = (u.password || '').trim();
        const emailMatch = userEmail === normalizedEmail;
        const passwordMatch = userPassword === normalizedPassword;
        
        // Debug individual comparisons
        if (emailMatch && !passwordMatch) {
          console.log('Email found but password mismatch');
        }
        
        return emailMatch && passwordMatch;
      });

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('authUser', JSON.stringify(userWithoutPassword));
        console.log('Login successful for:', userWithoutPassword.email);
        return { success: true };
      }
      
      // Check if email exists but password is wrong
      const emailExists = users.some((u) => 
        (u.email || '').trim().toLowerCase() === normalizedEmail
      );
      
      if (emailExists) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
      
      return { success: false, error: 'No account found with this email address. Please register first.' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login. Please try again.' };
    }
  };

  // Register function
  const register = (userData) => {
    try {
      const usersString = localStorage.getItem('users');
      const users = usersString ? JSON.parse(usersString) : [];
      
      // Normalize and validate email
      const normalizedEmail = (userData.email || '').trim().toLowerCase();
      const normalizedPassword = (userData.password || '').trim();
      
      // Validate email format
      if (!normalizedEmail) {
        return { success: false, error: 'Email is required.' };
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      
      // Check if email already exists (case-insensitive)
      if (users.some((u) => (u.email || '').trim().toLowerCase() === normalizedEmail)) {
        return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
      }

      // Validate password
      if (!normalizedPassword) {
        return { success: false, error: 'Password is required.' };
      }
      
      if (normalizedPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }

      // Create new user with normalized email and trimmed password
      const newUser = {
        id: Date.now().toString(),
        name: (userData.name || '').trim(),
        email: normalizedEmail,
        password: normalizedPassword, // Store trimmed password
        role: userData.role || 'user',
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      console.log('User registered successfully:', { email: newUser.email, name: newUser.name });

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('authUser', JSON.stringify(userWithoutPassword));
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An error occurred during registration. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


