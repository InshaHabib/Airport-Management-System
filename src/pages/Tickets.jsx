import { useState } from 'react';
import { useTickets } from '../context/TicketContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import ConfirmModal from '../components/ConfirmModal';
import { toDateTimeLocal, formatTime } from '../utils/dateFormatter';

const Tickets = () => {
  const { tickets, createTicket, updateTicket, deleteTicket, loading } = useTickets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [formData, setFormData] = useState({
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    gate: '',
    status: 'scheduled',
    price: '',
    airline: '',
  });
  const [error, setError] = useState('');

  const handleOpenModal = (ticket = null) => {
    if (ticket) {
      setSelectedTicket(ticket);
      setFormData({
        flightNumber: ticket.flightNumber || '',
        origin: ticket.origin || '',
        destination: ticket.destination || '',
        departureTime: toDateTimeLocal(ticket.departureTime) || '',
        arrivalTime: toDateTimeLocal(ticket.arrivalTime) || '',
        gate: ticket.gate || '',
        status: ticket.status || 'scheduled',
        price: ticket.price || '',
        airline: ticket.airline || '',
      });
    } else {
      setSelectedTicket(null);
      setFormData({
        flightNumber: '',
        origin: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        gate: '',
        status: 'scheduled',
        price: '',
        airline: '',
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    setFormData({
      flightNumber: '',
      origin: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      gate: '',
      status: 'scheduled',
      price: '',
      airline: '',
    });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.flightNumber || !formData.origin || !formData.destination || !formData.departureTime) {
      setError('Please fill in all required fields');
      return;
    }

    if (selectedTicket) {
      updateTicket(selectedTicket.id, formData);
    } else {
      createTicket(formData);
    }

    handleCloseModal();
  };

  const handleDelete = (ticket) => {
    setSelectedTicket(ticket);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTicket) {
      deleteTicket(selectedTicket.id);
      setIsDeleteModalOpen(false);
      setSelectedTicket(null);
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

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tickets Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage all flight tickets in the system
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => handleOpenModal()}>Add New Ticket</Button>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new ticket.
              </p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
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

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="secondary"
                      onClick={() => handleOpenModal(ticket)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(ticket)}
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedTicket ? 'Edit Ticket' : 'Add New Ticket'}
          size="lg"
        >
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Flight Number"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleChange}
                required
              />
              <Input
                label="Airline"
                name="airline"
                value={formData.airline}
                onChange={handleChange}
              />
              <Input
                label="Origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
              />
              <Input
                label="Destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />
              <Input
                label="Departure Time"
                name="departureTime"
                type="datetime-local"
                value={formData.departureTime}
                onChange={handleChange}
                required
              />
              <Input
                label="Arrival Time"
                name="arrivalTime"
                type="datetime-local"
                value={formData.arrivalTime}
                onChange={handleChange}
              />
              <Input
                label="Gate"
                name="gate"
                value={formData.gate}
                onChange={handleChange}
              />
              <Input
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="boarding">Boarding</option>
                <option value="departed">Departed</option>
                <option value="arrived">Arrived</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedTicket ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTicket(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Ticket"
          message={`Are you sure you want to delete ticket ${selectedTicket?.flightNumber}? This action cannot be undone.`}
        />
      </div>
    </Layout>
  );
};

export default Tickets;

