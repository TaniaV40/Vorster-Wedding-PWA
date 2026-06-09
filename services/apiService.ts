/**
 * API Service for interacting with Google Apps Script Backend.
 * Automatically falls back to localStorage persistence if the GAS_API_URL is not configured.
 */

// Retrieve the GAS Web App URL from injected process environment variables
const API_URL = (process.env.GAS_API_URL || '').trim();

export interface RSVPData {
  name: string;
  email: string;
  phone: string;
  attending: string;
  guestCount: number;
  accommodation: string;
  dietary: string; // Combined dietary preferences string
  comments: string;
}

export interface GuestbookData {
  author: string;
  message: string;
}

export interface PhotoData {
  base64: string;
  filename: string;
  mimeType: string;
  guestName: string;
}

// LocalStorage keys for fallbacks
const MOCK_RSVP_KEY = 'vorster_wedding_rsvps';
const MOCK_GUESTBOOK_KEY = 'vorster_wedding_guestbook';
const MOCK_GALLERY_KEY = 'vorster_wedding_gallery_v2';

// Helper to parse dates from spreadsheets robustly across all browsers
function parseSheetDate(dateStr: any): string {
  if (!dateStr) return 'Unknown Date';
  
  // If it's already a date object or looks like an ISO string
  const dateObj = new Date(dateStr);
  if (!isNaN(dateObj.getTime())) {
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  // Handle common spreadsheet formats like "dd/mm/yyyy hh:mm:ss" or "yyyy-mm-dd hh:mm:ss"
  const str = String(dateStr).trim();
  
  // Try splitting date and time
  const dateTimeParts = str.split(' ');
  if (dateTimeParts[0]) {
    const dateParts = dateTimeParts[0].split(/[/\-]/);
    if (dateParts.length === 3) {
      let day = 1, month = 0, year = 2026;
      // Check if first part is 4 digits (yyyy-mm-dd or yyyy/mm/dd)
      if (dateParts[0].length === 4) {
        year = parseInt(dateParts[0], 10);
        month = parseInt(dateParts[1], 10) - 1;
        day = parseInt(dateParts[2], 10);
      } else if (dateParts[2].length === 4) {
        // Assume dd/mm/yyyy
        day = parseInt(dateParts[0], 10);
        month = parseInt(dateParts[1], 10) - 1;
        year = parseInt(dateParts[2], 10);
      } else {
        // Fallback guess
        day = parseInt(dateParts[0], 10);
        month = parseInt(dateParts[1], 10) - 1;
        year = parseInt(dateParts[2], 10);
      }
      
      let hour = 0, minute = 0, second = 0;
      if (dateTimeParts[1]) {
        const timeParts = dateTimeParts[1].split(':');
        hour = parseInt(timeParts[0] || '0', 10);
        minute = parseInt(timeParts[1] || '0', 10);
        second = parseInt(timeParts[2] || '0', 10);
      }
      
      const d = new Date(year, month, day, hour, minute, second);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      }
    }
  }

  return 'Unknown Date';
}

// Helper to initialize mock data if not present
const getMockStorage = <T>(key: string, initialData: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

const saveMockStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Default Mock Fallbacks
const initialMessages = [
  { id: '1', name: 'Aunt Marie', message: 'So happy for you both! Can’t wait for July!', date: 'Jan 12, 2027' },
  { id: '2', name: 'Chris & Sarah', message: 'Wishing you a lifetime of love and joy. The sunflowers are such a beautiful touch!', date: 'Feb 05, 2027' },
  { id: '3', name: 'Grandma Vorster', message: 'My beautiful grandson and his lovely bride. God bless you both.', date: 'Mar 20, 2027' },
];

const initialPhotos = [
  { id: '5', url: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=400&auto=format&fit=crop', likes: 19 },
  { id: '6', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&auto=format&fit=crop', likes: 42 },
];

const initialRSVPs = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phone: '+27 82 123 4567', attending: 'Yes', guestCount: 2, accommodation: 'Yes', dietary: 'None', comments: 'Can\'t wait!', timestamp: new Date().toISOString() },
  { id: '2', name: 'Jane Doe', email: 'jane@example.com', phone: '+27 83 987 6543', attending: 'No', guestCount: 0, accommodation: 'No', dietary: 'Vegan', comments: 'So sorry we can\'t make it.', timestamp: new Date().toISOString() }
];

export const apiService = {
  isConfigured(): boolean {
    return !!API_URL;
  },

  /**
   * Helper to perform GET request
   */
  async get(action: string) {
    if (!API_URL) {
      throw new Error('GAS_API_URL not configured');
    }
    const response = await fetch(`${API_URL}?action=${action}`);
    if (!response.ok) {
      throw new Error(`API GET Error: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Helper to perform POST request
   */
  async post(action: string, data: any, token?: string) {
    if (!API_URL) {
      throw new Error('GAS_API_URL not configured');
    }
    const payload = {
      action,
      token,
      data
    };
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // GAS requires text/plain or no preflight to avoid CORS issues
      }
    });
    if (!response.ok) {
      throw new Error(`API POST Error: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Submit guest RSVP responses
   */
  async submitRSVP(data: RSVPData): Promise<{ id: string; message: string }> {
    if (!this.isConfigured()) {
      console.log('[Mock API] submitRSVP:', data);
      const mockList = getMockStorage(MOCK_RSVP_KEY, initialRSVPs);
      const newId = Math.random().toString(36).substring(2, 11);
      const newEntry = { id: newId, ...data, timestamp: new Date().toISOString() };
      saveMockStorage(MOCK_RSVP_KEY, [newEntry, ...mockList]);
      return { id: newId, message: 'Mock RSVP successful' };
    }

    const res = await this.post('submitRSVP', data);
    if (res.status === 'error') throw new Error(res.message);
    return { id: res.id, message: res.message };
  },

  /**
   * Retrieve all messages in guestbook
   */
  async getGuestbook(): Promise<Array<{ id: string; name: string; message: string; date: string }>> {
    if (!this.isConfigured()) {
      return getMockStorage(MOCK_GUESTBOOK_KEY, initialMessages);
    }

    try {
      const res = await this.get('getGuestbook');
      if (res.status === 'error') throw new Error(res.message);
      
      return (res.messages || []).map((r: any) => {
        // Case-insensitive lookup for headers
        const authorKey = Object.keys(r).find(k => k.toLowerCase() === 'author' || k.toLowerCase() === 'name') || 'Author';
        const messageKey = Object.keys(r).find(k => k.toLowerCase() === 'message' || k.toLowerCase() === 'content') || 'Message';
        const dateKey = Object.keys(r).find(k => k.toLowerCase() === 'timestamp' || k.toLowerCase() === 'date' || k.toLowerCase() === 'time') || 'Timestamp';
        const idKey = Object.keys(r).find(k => k.toLowerCase() === 'id') || 'ID';
        
        return {
          id: r[idKey] || '',
          name: r[authorKey] || 'Anonymous',
          message: r[messageKey] || '',
          date: parseSheetDate(r[dateKey])
        };
      });
    } catch (e) {
      console.error('Failed to get guestbook from GAS, falling back to mock:', e);
      return getMockStorage(MOCK_GUESTBOOK_KEY, initialMessages);
    }
  },

  /**
   * Submit a new message to guestbook
   */
  async submitMessage(data: GuestbookData): Promise<{ id: string; message: string }> {
    if (!this.isConfigured()) {
      console.log('[Mock API] submitMessage:', data);
      const mockList = getMockStorage(MOCK_GUESTBOOK_KEY, initialMessages);
      const newId = Math.random().toString(36).substring(2, 11);
      const newEntry = {
        id: newId,
        name: data.author,
        message: data.message,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };
      saveMockStorage(MOCK_GUESTBOOK_KEY, [newEntry, ...mockList]);
      return { id: newId, message: 'Mock Message added' };
    }

    const res = await this.post('submitMessage', data);
    if (res.status === 'error') throw new Error(res.message);
    return { id: res.id, message: res.message };
  },

  /**
   * Retrieve all photos in gallery
   */
  async getGallery(): Promise<Array<{ id: string; url: string; likes: number }>> {
    if (!this.isConfigured()) {
      return getMockStorage(MOCK_GALLERY_KEY, initialPhotos);
    }

    try {
      const res = await this.get('getGallery');
      if (res.status === 'error') throw new Error(res.message);
      
      return (res.photos || []).map((r: any) => {
        const fileIdKey = Object.keys(r).find(k => k.toLowerCase() === 'fileid' || k.toLowerCase() === 'field' || k.toLowerCase() === 'id') || 'FileId';
        const fileUrlKey = Object.keys(r).find(k => k.toLowerCase() === 'fileurl' || k.toLowerCase() === 'file url' || k.toLowerCase() === 'url') || 'FileUrl';
        const likesKey = Object.keys(r).find(k => k.toLowerCase() === 'likes' || k.toLowerCase() === 'like') || 'Likes';
        const idKey = Object.keys(r).find(k => k.toLowerCase() === 'id') || 'ID';

        const fileId = r[fileIdKey];
        const fileUrl = r[fileUrlKey] || '';
        const isVideo = fileUrl.includes('#video');
        
        const url = fileId 
          ? (isVideo 
              ? `https://drive.google.com/uc?export=download&id=${fileId}#video`
              : `https://lh3.googleusercontent.com/d/${fileId}`)
          : fileUrl;

        return {
          id: r[idKey] || '',
          url: url,
          likes: Number(r[likesKey] || 0)
        };
      });
    } catch (e) {
      console.error('Failed to get gallery from GAS, falling back to mock:', e);
      return getMockStorage(MOCK_GALLERY_KEY, initialPhotos);
    }
  },

  /**
   * Upload a photo base64
   */
  async uploadPhoto(data: PhotoData): Promise<{ id: string; fileUrl: string; message: string }> {
    if (!this.isConfigured()) {
      console.log('[Mock API] uploadPhoto:', data.filename);
      const mockList = getMockStorage(MOCK_GALLERY_KEY, initialPhotos);
      const newId = Math.random().toString(36).substring(2, 11);
      const newEntry = {
        id: newId,
        url: data.base64, // Local base64 string works for local testing preview
        likes: 0
      };
      saveMockStorage(MOCK_GALLERY_KEY, [newEntry, ...mockList]);
      return { id: newId, fileUrl: data.base64, message: 'Mock Photo uploaded' };
    }

    const res = await this.post('uploadPhoto', data);
    if (res.status === 'error') throw new Error(res.message);
    return { id: res.id, fileUrl: res.fileUrl, message: res.message };
  },

  /**
   * Increment likes for a photo
   */
  async likePhoto(id: string): Promise<{ likes: number; message: string }> {
    if (!this.isConfigured()) {
      console.log('[Mock API] likePhoto:', id);
      const mockList = getMockStorage(MOCK_GALLERY_KEY, initialPhotos);
      let updatedLikes = 0;
      const updated = mockList.map(p => {
        if (p.id === id) {
          updatedLikes = (p.likes || 0) + 1;
          return { ...p, likes: updatedLikes };
        }
        return p;
      });
      saveMockStorage(MOCK_GALLERY_KEY, updated);
      return { likes: updatedLikes, message: 'Mock liked photo' };
    }

    const res = await this.post('likePhoto', { id });
    if (res.status === 'error') throw new Error(res.message);
    return { likes: Number(res.likes), message: res.message };
  },

  /**
   * Retrieve admin dashboard configurations and RSVPs
   */
  async getAdminData(token: string): Promise<{ rsvps: any[]; config: any[] }> {
    if (!this.isConfigured()) {
      console.log('[Mock API] getAdminData with token:', token);
      const rsvps = getMockStorage(MOCK_RSVP_KEY, initialRSVPs);
      return {
        rsvps,
        config: [{ Key: 'AdminToken', Value: 'JessicaJuan2027' }]
      };
    }

    const res = await this.post('getAdminData', {}, token);
    if (res.status === 'error') throw new Error(res.message);
    return {
      rsvps: res.rsvps || [],
      config: res.config || []
    };
  },

  /**
   * Admin: Delete a guestbook message
   */
  async deleteMessage(id: string, token: string): Promise<void> {
    if (!this.isConfigured()) {
      console.log('[Mock API] deleteMessage:', id);
      const mockList = getMockStorage(MOCK_GUESTBOOK_KEY, initialMessages);
      const filtered = mockList.filter(m => m.id !== id);
      saveMockStorage(MOCK_GUESTBOOK_KEY, filtered);
      return;
    }

    const res = await this.post('deleteMessage', { id }, token);
    if (res.status === 'error') throw new Error(res.message);
  },

  /**
   * Admin: Delete a gallery photo
   */
  async deletePhoto(id: string, fileId: string, token: string): Promise<void> {
    if (!this.isConfigured()) {
      console.log('[Mock API] deletePhoto:', id);
      const mockList = getMockStorage(MOCK_GALLERY_KEY, initialPhotos);
      const filtered = mockList.filter(p => p.id !== id);
      saveMockStorage(MOCK_GALLERY_KEY, filtered);
      return;
    }

    const res = await this.post('deletePhoto', { id, fileId }, token);
    if (res.status === 'error') throw new Error(res.message);
  }
};
