import { createContext, useContext, useState, useEffect } from 'react';

const TicketContext = createContext();

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tickets and bookings from localStorage on mount
  useEffect(() => {
    const storedTickets = localStorage.getItem('tickets');
    const storedBookings = localStorage.getItem('bookings');
    
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    }
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever tickets or bookings change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('tickets', JSON.stringify(tickets));
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [tickets, bookings, loading]);

  // Create ticket
  const createTicket = (ticketData) => {
    const newTicket = {
      id: Date.now().toString(),
      ...ticketData,
      createdAt: new Date().toISOString(),
    };
    setTickets((prev) => [...prev, newTicket]);
    return newTicket;
  };

  // Read ticket
  const getTicket = (id) => {
    return tickets.find((t) => t.id === id);
  };

  // Update ticket
  const updateTicket = (id, updatedData) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, ...updatedData, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
  };

  // Delete ticket
  const deleteTicket = (id) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
    // Also remove related bookings
    setBookings((prev) => prev.filter((booking) => booking.ticketId !== id));
  };

  // Get all tickets
  const getAllTickets = () => {
    return tickets;
  };

  // Booking functions
  const createBooking = (userId, ticketId) => {
    // Check if booking already exists
    const existingBooking = bookings.find(
      (b) => b.userId === userId && b.ticketId === ticketId
    );
    
    if (existingBooking) {
      return { success: false, error: 'Booking already exists' };
    }

    const newBooking = {
      id: Date.now().toString(),
      userId,
      ticketId,
      bookedAt: new Date().toISOString(),
    };
    setBookings((prev) => [...prev, newBooking]);
    return { success: true, booking: newBooking };
  };

  const deleteBooking = (bookingId) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
  };

  const getBookingsByUser = (userId) => {
    return bookings.filter((b) => b.userId === userId);
  };

  const getBookingsByTicket = (ticketId) => {
    return bookings.filter((b) => b.ticketId === ticketId);
  };

  const getAllBookings = () => {
    return bookings;
  };

  const value = {
    tickets,
    bookings,
    createTicket,
    getTicket,
    updateTicket,
    deleteTicket,
    getAllTickets,
    createBooking,
    deleteBooking,
    getBookingsByUser,
    getBookingsByTicket,
    getAllBookings,
    loading,
  };

  return (
    <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
  );
};


