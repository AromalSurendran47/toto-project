import React, { useEffect, useState } from 'react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', date: '', time: '', venue: '' });
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

useEffect(() => {
  const fetchEvents = async () => {
    const MIN_LOADING_TIME = 2000; // 3 seconds
    const startTime = Date.now();

    try {
      const res = await fetch('http://localhost:3001/events');
      if (!res.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error fetching events');
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, MIN_LOADING_TIME - elapsed);
      setTimeout(() => setLoading(false), delay);
    }
  };
  fetchEvents();
}, []);


  const formatDate = (isoDate) => {
    if (!isoDate) return '-';
    try {
      return new Date(isoDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return isoDate;
    }
  };

  const startEdit = (evt) => {
    setEditingEventId(evt._id);
    setEditForm({
      title: evt.title || '',
      description: evt.description || '',
      date: evt.date ? new Date(evt.date).toISOString().slice(0, 10) : '',
      time: evt.time || '',
      venue: evt.venue || ''
    });
  };

  const cancelEdit = () => {
    setEditingEventId(null);
    setEditForm({ title: '', description: '', date: '', time: '', venue: '' });
  };

  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    setSavingId(id);
    try {
      const res = await fetch(`http://localhost:3001/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Failed to update event');
      }
      const updated = result.event || result; // support either shape
      setEvents((prev) => prev.map((e) => (e._id === id ? { ...e, ...updated } : e)));
      cancelEdit();
      setToast({ visible: true, message: 'Event updated successfully', type: 'success' });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
    } catch (e) {
      setToast({ visible: true, message: e.message || 'Error updating event', type: 'error' });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
    } finally {
      setSavingId(null);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:3001/events/${id}`, { method: 'DELETE' });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result.message || 'Failed to delete event');
      }
      setEvents((prev) => prev.filter((e) => e._id !== id));
      setToast({ visible: true, message: 'Event deleted', type: 'success' });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000);
    } catch (e) {
      setToast({ visible: true, message: e.message || 'Error deleting event', type: 'error' });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Toast */}
      {toast.visible && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-sm ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {toast.message}
        </div>
      )}

      {/* Edit Modal */}
      {editingEventId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={cancelEdit}></div>
          <div className="relative z-50 w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Event</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={cancelEdit}>✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Title</label>
                <input type="text" name="title" value={editForm.title} onChange={onEditChange} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Description</label>
                <textarea name="description" value={editForm.description} onChange={onEditChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date</label>
                  <input type="date" name="date" value={editForm.date} onChange={onEditChange} className="w-full border px-3 py-2 rounded" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Time</label>
                  <input type="time" name="time" value={editForm.time} onChange={onEditChange} className="w-full border px-3 py-2 rounded" required />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Venue</label>
                <input type="text" name="venue" value={editForm.venue} onChange={onEditChange} className="w-full border px-3 py-2 rounded" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={cancelEdit}>Cancel</button>
              <button className={`px-4 py-2 rounded text-white ${savingId === editingEventId ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`} onClick={() => saveEdit(editingEventId)} disabled={savingId === editingEventId}>
                {savingId === editingEventId ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Events</h2>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          + Add New Event
        </button>
      </div>

      {loading && (
  <div className="flex justify-center items-center py-12">
    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
    <span className="ml-2 text-gray-600">Loading events...</span>
  </div>
)}


      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {event.title?.charAt(0) || '?'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        {event.description && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">{event.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(event.date)}</div>
                    <div className="text-sm text-gray-500">{event.time || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.venue || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="mr-2 px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">View</button>
                    <button className="mr-2 px-3 py-1.5 rounded text-white bg-gray-600 hover:bg-gray-700" onClick={() => startEdit(event)}>Edit</button>
                    <button
                      className={`px-3 py-1.5 rounded text-white ${deletingId === event._id ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                      onClick={() => deleteEvent(event._id)}
                      disabled={deletingId === event._id}
                    >
                      {deletingId === event._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{events.length > 0 ? 1 : 0}</span> to{' '}
                <span className="font-medium">{events.length}</span> of{' '}
                <span className="font-medium">{events.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </a>
                <a
                  href="#"
                  className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  2
                </a>
                <a
                  href="#"
                  className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  3
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
