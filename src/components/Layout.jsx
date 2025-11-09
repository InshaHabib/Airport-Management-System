import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/users', label: 'Users' },
    { path: '/tickets', label: 'Tickets' },
    { path: '/flights', label: 'Flights' },
    { path: '/bookings', label: 'Bookings' },
    // { path: '/debug-users', label: 'Debug Users' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-lg shadow-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Airport Management
                  </h1>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      location.pathname === link.path
                        ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:shadow-sm'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg border border-purple-100">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-semibold">
                    {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-700">
                  <span className="font-semibold">{user?.name || user?.email}</span>
                </span>
              </div>
              <Button variant="secondary" onClick={handleLogout} className="text-sm">
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden border-t border-purple-100 bg-white">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                  location.pathname === link.path
                    ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-purple-100 mt-2">
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-semibold">
                    {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-700 font-semibold">
                  {user?.name || user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;


