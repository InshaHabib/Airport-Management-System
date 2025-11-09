import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';

const DebugUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const usersString = localStorage.getItem('users');
      if (usersString) {
        const parsedUsers = JSON.parse(usersString);
        setUsers(parsedUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const updatePassword = (userId, newPassword) => {
    try {
      const usersString = localStorage.getItem('users');
      if (usersString) {
        const parsedUsers = JSON.parse(usersString);
        const updatedUsers = parsedUsers.map((u) =>
          u.id === userId
            ? { ...u, password: newPassword.trim() }
            : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        loadUsers();
        setSelectedUser(null);
        setNewPassword('');
        alert('Password updated successfully!');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password');
    }
  };

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const usersString = localStorage.getItem('users');
        if (usersString) {
          const parsedUsers = JSON.parse(usersString);
          const filteredUsers = parsedUsers.filter((u) => u.id !== userId);
          localStorage.setItem('users', JSON.stringify(filteredUsers));
          loadUsers();
          alert('User deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const clearAllData = () => {
    if (
      window.confirm(
        '⚠️ WARNING: This will delete ALL data (users, tickets, bookings). Are you sure?'
      )
    ) {
      localStorage.clear();
      alert('All data cleared! Please refresh the page.');
      window.location.reload();
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Debug: User Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage all registered users (Development Only)
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Development Mode:</strong> This page shows all user passwords. 
                Remove this page in production!
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <Button
            variant="secondary"
            onClick={() => setShowPasswords(!showPasswords)}
          >
            {showPasswords ? 'Hide' : 'Show'} Passwords
          </Button>
          <Button variant="danger" onClick={clearAllData}>
            Clear All Data
          </Button>
          <Button variant="primary" onClick={loadUsers}>
            Refresh Users
          </Button>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found in localStorage</p>
              <p className="text-sm text-gray-400 mt-2">
                Register a new user to see it here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Password
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                          {currentUser?.id === user.id && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">
                          {showPasswords ? (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {user.password || 'No password'}
                            </span>
                          ) : (
                            <span className="text-gray-400">••••••••</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => setSelectedUser(user)}
                          >
                            Reset Password
                          </Button>
                          {currentUser?.id !== user.id && (
                            <Button
                              variant="danger"
                              onClick={() => deleteUser(user.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reset Password Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setSelectedUser(null)}></div>
              <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Reset Password for {selectedUser.email}
                </h3>
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  required
                />
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedUser(null);
                      setNewPassword('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (newPassword.length >= 6) {
                        updatePassword(selectedUser.id, newPassword);
                      } else {
                        alert('Password must be at least 6 characters');
                      }
                    }}
                    disabled={newPassword.length < 6}
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📋 How to Access localStorage Directly:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Open your browser's Developer Tools (Press F12 or Right-click → Inspect)</li>
            <li>Go to the <strong>"Application"</strong> tab (Chrome) or <strong>"Storage"</strong> tab (Firefox)</li>
            <li>Click on <strong>"Local Storage"</strong> in the left sidebar</li>
            <li>Click on your website's URL (e.g., http://localhost:5173)</li>
            <li>Look for the key <strong>"users"</strong> - this contains all registered users</li>
            <li>You can view, edit, or delete the data directly from there</li>
          </ol>
          <div className="mt-4 p-3 bg-white rounded border border-blue-200">
            <p className="text-xs font-mono text-gray-700">
              <strong>Quick Access:</strong> Open Console (F12) and type:<br />
              <code className="bg-gray-100 px-2 py-1 rounded">
                JSON.parse(localStorage.getItem('users'))
              </code>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DebugUsers;

