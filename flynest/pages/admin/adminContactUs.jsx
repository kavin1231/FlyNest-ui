import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Mail, 
  User, 
  Calendar,
  Filter,
  Search,
  Reply,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Star
} from 'lucide-react';

const AdminContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [expandedContact, setExpandedContact] = useState(null);

  const token = localStorage.getItem('token');
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'booking', label: 'Booking' },
    { value: 'payment', label: 'Payment' },
    { value: 'flight', label: 'Flight' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'suggestion', label: 'Suggestion' },
    { value: 'technical', label: 'Technical' }
  ];

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BackendUrl}/api/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId, status) => {
    try {
      const response = await fetch(`${BackendUrl}/api/contacts/${contactId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchContacts();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const markAsRead = async (contactId) => {
    try {
      await fetch(`${BackendUrl}/api/contacts/${contactId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchContacts();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const sendResponse = async (contactId) => {
    if (!responseText.trim()) return;
    
    setIsResponding(true);
    try {
      const response = await fetch(`${BackendUrl}/api/contacts/${contactId}/respond`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: responseText })
      });
      
      if (response.ok) {
        setResponseText('');
        setSelectedContact(null);
        fetchContacts();
      }
    } catch (error) {
      console.error('Failed to send response:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const deleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const response = await fetch(`${BackendUrl}/api/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        fetchContacts();
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const statusMatch = filters.status === 'all' || contact.status === filters.status;
    const priorityMatch = filters.priority === 'all' || contact.priority === filters.priority;
    const categoryMatch = filters.category === 'all' || contact.category === filters.category;
    const searchMatch = searchTerm === '' || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && priorityMatch && categoryMatch && searchMatch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pending' },
      'in-progress': { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'In Progress' },
      resolved: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Resolved' },
      closed: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Closed' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-400',
      medium: 'text-yellow-400',
      high: 'text-orange-400',
      urgent: 'text-red-400'
    };
    return colors[priority] || 'text-gray-400';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      general: '❓',
      booking: '✈️',
      payment: '💳',
      flight: '🛫',
      complaint: '⚠️',
      suggestion: '💡',
      technical: '🔧'
    };
    return icons[category] || '❓';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Management</h1>
        <p className="text-gray-400">Manage customer inquiries and support requests</p>
      </div>

      {/* Filters and Search */}
      <div className="glassmorphism-card rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="glassmorphism-card rounded-2xl p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-400">Loading contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No contacts found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact._id}
                className={`border rounded-xl p-4 transition-all ${
                  !contact.isRead ? 'border-yellow-400/30 bg-yellow-400/5' : 'border-slate-700 bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${!contact.isRead ? 'bg-yellow-400/20' : 'bg-slate-700/50'}`}>
                      <span className="text-lg">{getCategoryIcon(contact.category)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{contact.subject}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <User className="h-3 w-3" />
                        <span>{contact.name}</span>
                        <Mail className="h-3 w-3 ml-2" />
                        <span>{contact.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getPriorityColor(contact.priority)}`}>
                      {contact.priority.toUpperCase()}
                    </span>
                    {getStatusBadge(contact.status)}
                    <button
                      onClick={() => setExpandedContact(expandedContact === contact._id ? null : contact._id)}
                      className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      {expandedContact === contact._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(contact.createdAt).toLocaleString()}</span>
                    </div>
                    {contact.adminResponse && (
                      <div className="flex items-center space-x-1 text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Responded</span>
                      </div>
                    )}
                  </div>
                </div>

                {expandedContact === contact._id && (
                  <div className="border-t border-slate-700 pt-4 mt-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Message:</h4>
                      <p className="text-gray-300 bg-slate-800/50 p-3 rounded-lg">{contact.message}</p>
                    </div>

                    {contact.adminResponse && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-green-400">Admin Response:</h4>
                        <p className="text-gray-300 bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                          {contact.adminResponse}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Responded on {new Date(contact.respondedAt).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {!contact.adminResponse && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Send Response:</h4>
                        <textarea
                          value={selectedContact === contact._id ? responseText : ''}
                          onChange={(e) => {
                            setSelectedContact(contact._id);
                            setResponseText(e.target.value);
                          }}
                          placeholder="Type your response here..."
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm resize-none"
                          rows={4}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <select
                          value={contact.status}
                          onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                          className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                        {!contact.isRead && (
                          <button
                            onClick={() => markAsRead(contact._id)}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-sm hover:bg-blue-500/30 transition-colors"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {selectedContact === contact._id && responseText.trim() && !contact.adminResponse && (
                          <button
                            onClick={() => sendResponse(contact._id)}
                            disabled={isResponding}
                            className="px-4 py-2 bg-yellow-400 text-slate-900 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center space-x-2"
                          >
                            {isResponding ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-slate-900 border-t-transparent" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <Reply className="h-3 w-3" />
                                <span>Send Response</span>
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => deleteContact(contact._id)}
                          className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactUs;