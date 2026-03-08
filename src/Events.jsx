import { useState, useEffect } from 'react';
import EventsWidget from './EventsWidget.jsx';

function Events() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

  const fetchEvents = async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?size=4&page=${currentPage}&apikey=${apiKey}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      if (data._embedded && data._embedded.events) {
        setEvents(data._embedded.events);
        setTotalPages(data.page.totalPages);
      } else {
        setEvents([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const handlePrev = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  return (
    <EventsWidget
      events={events}
      onPrev={handlePrev}
      onNext={handleNext}
      loading={loading}
      error={error}
    />
  );
}

export default Events;