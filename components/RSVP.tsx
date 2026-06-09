
import React, { useState } from 'react';
import { apiService } from '../services/apiService';

const RSVP: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    guestCount: 1,
    attending: 'Yes',
    dietVegan: false,
    dietNonDairy: false,
    dietGlutenFree: false,
    dietOther: '',
    accommodation: 'Please select',
    comments: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dietaryArr: string[] = [];
      if (formData.dietVegan) dietaryArr.push('Vegetarian/Vegan');
      if (formData.dietGlutenFree) dietaryArr.push('Gluten Free');
      if (formData.dietNonDairy) dietaryArr.push('Dairy Free');
      if (formData.dietOther.trim()) dietaryArr.push(formData.dietOther.trim());
      
      const dietaryString = dietaryArr.join(', ') || 'None';

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        attending: formData.attending,
        guestCount: formData.guestCount,
        accommodation: formData.accommodation,
        dietary: dietaryString,
        comments: formData.comments
      };

      await apiService.submitRSVP(payload);
      
      // Redirect to the Save the Date screen using hash routing
      window.location.hash = 'save_the_date';
    } catch (err) {
      console.error('RSVP submit error:', err);
      alert('Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-[#c39d6f] italic mb-4">RSVP</h2>
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">Kindly respond by May 15th, 2027</p>
          <p className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">We regret no children</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-stone-900/50 p-8 rounded-lg border border-[#c39d6f]/10 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-[9px] uppercase tracking-widest text-[#c39d6f] mb-3">Will you attend?</label>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, attending: 'Yes'})}
                className={`flex-1 py-3 border ${formData.attending === 'Yes' ? 'bg-[#c39d6f] text-black border-[#c39d6f]' : 'border-[#c39d6f]/30 text-[#c39d6f]'} text-[10px] tracking-widest uppercase rounded font-bold`}
              >
                Yes, with pleasure
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, attending: 'No'})}
                className={`flex-1 py-3 border ${formData.attending === 'No' ? 'bg-stone-800 text-white border-white' : 'border-[#c39d6f]/30 text-[#c39d6f]'} text-[10px] tracking-widest uppercase rounded font-bold`}
              >
                Declined with regret
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[9px] uppercase tracking-widest text-[#c39d6f] mb-2">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-black border border-[#c39d6f]/30 p-3 text-sm focus:outline-none focus:border-[#c39d6f] transition-colors text-white"
              placeholder="e.g. John Smith"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-[9px] uppercase tracking-widest text-[#c39d6f] mb-2">Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="bg-black border border-[#c39d6f]/30 p-3 text-sm focus:outline-none focus:border-[#c39d6f] transition-colors text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[9px] uppercase tracking-widest text-[#c39d6f] mb-2">Phone Number</label>
            <input 
              required
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="bg-black border border-[#c39d6f]/30 p-3 text-sm focus:outline-none focus:border-[#c39d6f] transition-colors text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-[9px] uppercase tracking-widest text-[#c39d6f] mb-2">Guests</label>
            <select 
              value={formData.guestCount}
              onChange={(e) => setFormData({...formData, guestCount: parseInt(e.target.value)})}
              className="bg-black border border-[#c39d6f]/30 p-3 text-sm focus:outline-none focus:border-[#c39d6f] transition-colors text-white"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3+</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[9px] uppercase tracking-widest text-[#c39d6f] mb-2">Accommodation?</label>
            <select 
              value={formData.accommodation}
              onChange={(e) => setFormData({...formData, accommodation: e.target.value as any})}
              className="bg-black border border-[#c39d6f]/30 p-3 text-sm focus:outline-none focus:border-[#c39d6f] transition-colors text-white"
            >
              <option value="Please select">Please select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-[9px] uppercase tracking-widest text-[#c39d6f] mb-2">Dietary Requirements</label>
          <div className="flex flex-wrap gap-4 mt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.dietVegan} 
                onChange={(e) => setFormData({...formData, dietVegan: e.target.checked})}
                className="w-4 h-4 accent-[#c39d6f] bg-black border-[#c39d6f]/30" 
              />
              <span className="text-white text-xs">Vegetarian/Vegan</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.dietGlutenFree} 
                onChange={(e) => setFormData({...formData, dietGlutenFree: e.target.checked})}
                className="w-4 h-4 accent-[#c39d6f] bg-black border-[#c39d6f]/30" 
              />
              <span className="text-white text-xs">Gluten Free</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.dietNonDairy} 
                onChange={(e) => setFormData({...formData, dietNonDairy: e.target.checked})}
                className="w-4 h-4 accent-[#c39d6f] bg-black border-[#c39d6f]/30" 
              />
              <span className="text-white text-xs">Dairy Free</span>
            </label>
          </div>
          <input 
            type="text" 
            value={formData.dietOther}
            onChange={(e) => setFormData({...formData, dietOther: e.target.value})}
            className="bg-black border border-[#c39d6f]/30 p-3 text-sm focus:outline-none focus:border-[#c39d6f] transition-colors text-white mt-3"
            placeholder="Other allergies or requirements..."
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[9px] uppercase tracking-widest text-[#c39d6f] mb-2">Comments or Song Requests</label>
          <textarea 
            value={formData.comments}
            onChange={(e) => setFormData({...formData, comments: e.target.value})}
            className="bg-black border border-[#c39d6f]/30 p-3 text-sm focus:outline-none focus:border-[#c39d6f] transition-colors text-white min-h-[100px]"
            placeholder="Any additional messages..."
          ></textarea>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full py-4 bg-[#c39d6f] text-black uppercase tracking-[0.2em] font-bold text-xs hover:bg-[#b28c5e] transition-colors disabled:opacity-50 shadow-lg"
        >
          {loading ? 'Processing...' : 'Confirm RSVP'}
        </button>
      </form>
    </div>
  );
};

export default RSVP;
