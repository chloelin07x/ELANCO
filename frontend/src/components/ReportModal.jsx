import { useState } from 'react';
import LATIN_NAMES from '../data/latinNames.js';
import { createNewSighting } from '../services/home.js';

function ReportModal({ isOpen, onClose, onSuccess, cities, tickSpecies }) {
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [species, setSpecies] = useState('');

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        const latinName = LATIN_NAMES[species];

        try {
            await createNewSighting(date, location, species, latinName);
            onSuccess(); // This will trigger the window.location.reload() in Home.jsx
            onClose();
        } catch (error) {
            console.error("Failed to submit sighting:", error);
            alert("Failed to submit the report. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-2xl transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-elanco-blue">Report a Sighting</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-lg leading-none">&times;</button>
                </div>

                <div className="py-4">
                    <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                        
                        {/* DATE */}
                        <div className='flex flex-col'>
                            <label className="font-din text-sm font-bold tracking-wider mb-1">Date of Tick Sighting:</label>
                            <input 
                                type="date" 
                                name="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border-2 border-[#dadada] rounded-md p-2"
                            />
                        </div>

                        {/* LOCATION */}
                        <div className='flex flex-col'>
                            <label className="font-din text-sm font-bold tracking-wider mb-1">Location of Tick Sighting:</label>
                            <select
                                name="selectedLocation"
                                value={location}
                                required
                                className='w-full border-2 rounded-md border-elanco-accent bg-[#fdfdfd] p-2 text-sm'
                                onChange={(e) => setLocation(e.target.value)}>
                                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* SPECIES */}
                        <div className='flex flex-col'>
                            <label className="font-din text-sm font-bold tracking-wider mb-1">Species of Tick:</label>
                            <select
                                name="selectedSpecies"
                                value={species}
                                required
                                className='w-full border-2 rounded-md border-elanco-accent bg-[#fdfdfd] p-2 text-sm'
                                onChange={(e) => setSpecies(e.target.value)}>
                                  {tickSpecies.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            className='mt-4 self-center bg-elanco-blue py-2 px-6 rounded-md font-din font-bold tracking-wider text-sm text-white hover:brightness-110 transition disabled:opacity-50'>
                              Submit</button>
                    </form>         
                </div>
            </div>
        </div>
    );
}

export default ReportModal;