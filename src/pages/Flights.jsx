import { useState } from 'react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { formatTime } from '../utils/dateFormatter';

const Flights = () => {
  const { tickets, getAllBookings, createBooking } = useTickets();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all'); // all, available, my-bookings
  const [message, setMessage] = useState({ type: '', text: '' });

  const bookings = getAllBookings();
  const userBookings = bookings.filter((b) => b.userId === user?.id);
  const bookedTicketIds = userBookings.map((b) => b.ticketId);

  const handleBookFlight = (ticketId) => {
    const result = createBooking(user.id, ticketId);
    if (result.success) {
      setMessage({ type: 'success', text: 'Flight booked successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to book flight' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      boarding: 'bg-yellow-100 text-yellow-800',
      departed: 'bg-gray-100 text-gray-800',
      arrived: 'bg-green-100 text-green-800',
      delayed: 'bg-red-100 text-red-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getFilteredTickets = () => {
    if (filter === 'my-bookings') {
      return tickets.filter((t) => bookedTicketIds.includes(t.id));
    } else if (filter === 'available') {
      return tickets.filter((t) => !bookedTicketIds.includes(t.id));
    }
    return tickets;
  };

  const filteredTickets = getFilteredTickets();

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Flights</h1>
          <p className="mt-2 text-sm text-gray-600">
            View all available flights and manage your bookings
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setFilter('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Flights ({tickets.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'available'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available ({tickets.length - bookedTicketIds.length})
            </button>
            <button
              onClick={() => setFilter('my-bookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'my-bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Bookings ({userBookings.length})
            </button>
          </nav>
        </div>

        {/* Flights Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white shadow rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No flights found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'my-bookings'
                  ? "You haven't booked any flights yet."
                  : 'No flights match your filter.'}
              </p>
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const isBooked = bookedTicketIds.includes(ticket.id);
              return (
                <div
                  key={ticket.id}
                  className={`bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                    isBooked ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {ticket.flightNumber || 'N/A'}
                        </h3>
                        {ticket.airline && (
                          <p className="text-sm text-gray-500">{ticket.airline}</p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <svg
                          className="h-4 w-4 text-gray-400 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-gray-600">
                          {ticket.origin} → {ticket.destination}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <svg
                          className="h-4 w-4 text-gray-400 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-600">
                          {formatTime(ticket.departureTime)} - {formatTime(ticket.arrivalTime)}
                        </span>
                      </div>
                      {ticket.gate && (
                        <div className="flex items-center text-sm">
                          <svg
                            className="h-4 w-4 text-gray-400 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-gray-600">Gate: {ticket.gate}</span>
                        </div>
                      )}
                      {ticket.price && (
                        <div className="text-lg font-semibold text-blue-600">
                          ${ticket.price}
                        </div>
                      )}
                    </div>

                    {isBooked && (
                      <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium">
                          ✓ You have booked this flight
                        </p>
                      </div>
                    )}

                    {!isBooked && filter !== 'my-bookings' && (
                      <Button
                        variant="primary"
                        onClick={() => handleBookFlight(ticket.id)}
                        className="w-full"
                      >
                        Book Flight
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Flights;

