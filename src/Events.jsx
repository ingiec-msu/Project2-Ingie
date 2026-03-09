import { useState, useEffect, useCallback } from 'react';
import EventsWidget from './EventsWidget.jsx';

function Events() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

  const fetchEvents = useCallback(async (currentPage, query = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?size=4&page=${currentPage}&apikey=${apiKey}${query ? `&keyword=${encodeURIComponent(query)}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      console.log(data); // As per the provided code
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
  }, [apiKey]);

  useEffect(() => {
    fetchEvents(page, searchQuery);
  }, [page, searchQuery, fetchEvents]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // Reset to first page on new search
    // searchQuery state will trigger useEffect
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events..."
          style={{ marginRight: '10px' }}
        />
        <button type="submit">Search</button>
      </form>
      <EventsWidget
        events={events}
        onPrev={handlePrev}
        onNext={handleNext}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default Events;