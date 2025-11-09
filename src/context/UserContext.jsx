import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever users change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users, loading]);

  // Create user
  const createUser = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  // Read user
  const getUser = (id) => {
    return users.find((u) => u.id === id);
  };

  // Update user
  const updateUser = (id, updatedData) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, ...updatedData, updatedAt: new Date().toISOString() }
          : user
      )
    );
  };

  // Delete user
  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  // Get all users
  const getAllUsers = () => {
    return users;
  };

  const value = {
    users,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


