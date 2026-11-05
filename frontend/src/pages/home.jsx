import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from "react-leaflet";
import { getAllTickSightings } from '../services/home.js';

import CITY_COORDS from '../data/cityCoords.js'
import TickMarker, { severity } from '../components/TickMarker.jsx';
import ReportModal from '../components/ReportModal.jsx';

function Home() {
    const [allTickSightings, setAllTickSightings] = useState(null);

    const [dateRange, setDateRange] = useState(0);
    const [selectedSpecies, setSelectedSpecies] = useState('');
    const [selectedSeverity, setSelectedSeverity] = useState('');
    const [selectedCity, setSelectedCity] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllTickSightings();
                setAllTickSightings(data);
            } catch (err) {
                console.log(err.response?.data?.detail ?? "Failed to load data with API");
            }
        }
        fetchData();
    }, [])

    const today = new Date();
    const sightings = allTickSightings ?? [];
    const speciesOptions = [...new Set(sightings.map((s) => s.species))].sort();
    const citiesOptions = [...new Set(sightings.map((s) => s.location))].sort();

    const visibleSightings = sightings.filter((s) => {
        if (selectedSpecies !== '' && s.species !== selectedSpecies) {
            return false;
        }

        if (dateRange > 0) {
            const cutoffDate = new Date(today);
            cutoffDate.setDate(today.getDate() - dateRange);
            
            if (new Date(s.date) < cutoffDate) {
                return false;
            }
        }
        return true;
    });

    const perCity = visibleSightings.reduce((acc, s) => {
        acc[s.location] = (acc[s.location] ?? 0) + 1;
        return acc;
    }, {});

    const sidebarCityCount = selectedCity ? (perCity[selectedCity] ?? 0) : 0;
    const [sidebarColor, sidebarSeverityText] = severity(sidebarCityCount);

    function rerender(e) {
        e.preventDefault();
    }

    return (
        <>
            {/* Heading */}
            <div className="flex flex-col w-full h-fit">
                <div className="grid grid-cols-3 items-center justify-items-center border-b-[6px] border-elanco-blue text-center py-2">
                    <p className="font-din font-bold tracking-wider text-xl text-elanco-blue">ELANCO</p>
                    <p className="font-din text-2xl">TickWatch</p>
                    <p className="font-din font-bold text-xl">Frontend Task</p>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-3 items-center justify-items-center border-b-2 border-surface text-center py-2">
                    <button onClick={() => setIsModalOpen(true)} className="bg-elanco-blue py-1 px-2 border-white rounded-sm font-din font-bold tracking-wider text-xs text-white hover:brightness-110 transition">Report</button>
                    <button className="bg-elanco-blue py-1 px-2 border-white rounded-sm font-din font-bold tracking-wider text-xs text-white hover:brightness-110 transition">Get Directions</button>
                    <button className="bg-elanco-blue py-1 px-2 border-white rounded-sm font-din font-bold tracking-wider text-xs text-white hover:brightness-110 transition">Share</button>
                </div>
            </div>

            <div className='flex flex-col w-full pt-10 pb-6 px-12 bg-[#fbfbfb]'>
                {/* Middle Section*/}
                <div className='flex flex-col bg-white rounded-xl overflow-hidden shadow-lg'>
                    {/* Filter controls */}
                    <div className='flex flex-row h-20 px-6 justify-around items-center border-b-2 border-[#dadada]'>
                        <div className='flex flex-col gap-2 w-40'>
                            <p className='font-din tracking-wider text-xs font-bold'>DATE RANGE</p>
                            <form onSubmit={rerender}>
                                <select
                                    name="selectedRange"
                                    value={dateRange}
                                    className='w-full border-2 rounded-md border-elanco-accent bg-[#fdfdfd] px-2 text-sm'
                                    onChange={(e) => setDateRange(parseInt(e.target.value))}>
                                        <option value={0}>All time</option>
                                        <option value={365}>Within the last year</option>
                                        <option value={730}>Within the last 2 years</option>
                                        <option value={1825}>Within the last 5 years</option>
                                </select>
                            </form>
                        </div>

                        <div className='flex flex-col gap-2 w-40'>
                            <p className='font-din tracking-wider text-xs font-bold'>SPECIES</p>
                            <form onSubmit={rerender}>
                                <select
                                    name="selectedSpecies"
                                    value={selectedSpecies}
                                    className='w-full border-2 rounded-md border-elanco-accent bg-[#fdfdfd] px-2 text-sm'
                                    onChange={(e) => setSelectedSpecies(e.target.value)}>
                                        <option value="">All species</option>
                                        {speciesOptions.map((s) => (
                                            <option key={s} value={s}>{s}</option>))}
                                </select>
                            </form>
                        </div>

                        <div className='flex flex-col gap-2 w-40'>
                            <p className='font-din tracking-wider text-xs font-bold'>SEVERITY</p>
                            <form onSubmit={rerender}>
                                <select
                                    name="selectedSeverity"
                                    value={selectedSeverity}
                                    className='w-full border-2 rounded-md border-elanco-accent bg-[#fdfdfd] px-2 text-sm'
                                    onChange={(e) => setSelectedSeverity(e.target.value)}>
                                        <option value="">All Severities</option>
                                </select>
                            </form>
                        </div>
                    </div>

                    {/* ONLY RENDER MAP IF MODAL IS CLOSED */}
                    {!isModalOpen && (
                        <div className='flex flex-row'>
                            {/* Dynamic Map */}
                            <MapContainer 
                                center={[54.5, -3]} 
                                zoom={6} 
                                scrollWheelZoom={true}
                                style={{ height:"600px", width:"70%" }}>
                                
                                <TileLayer
                                    attribution='&copy; OpenStreetMap contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                {Object.entries(perCity).map(([city, count]) => {
                                    const pos = CITY_COORDS[city]
                                    if (!pos) return null;
                                    return <TickMarker key={city} pos={pos} count={count} city={city} onMarkerClick={setSelectedCity}/>
                                })}
                            </MapContainer>

                            {/* Side Bar */}
                            <aside className='flex flex-col w-[30%] p-6 border-l-2 border-[#dadada]'>
                                {selectedCity ? (
                                    <div className="flex flex-col h-full w-full gap-4">
                                        <h3 className="font-din font-bold text-2xl text-elanco-accent text-center uppercase tracking-wider">
                                            {selectedCity}
                                        </h3>
                                        
                                        <div className="flex flex-col gap-4">
                                            <div className="bg-[#fbfbfb] p-4 rounded-md border border-[#dadada]">
                                                <p className="font-din text-xs font-bold tracking-wider text-gray-500 mb-1">TOTAL SIGHTINGS</p>
                                                <p className="text-2xl text-elanco-blue font-bold">{sidebarCityCount}</p>
                                            </div>

                                            <div className="bg-[#fbfbfb] p-4 rounded-md border border-[#dadada]">
                                                <p className="font-din text-xs font-bold tracking-wider text-gray-500 mb-1">RISK LEVEL</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: sidebarColor }}/>
                                                    <p className="text-lg font-bold">{sidebarSeverityText}</p>
                                                </div>
                                            </div>

                                            <div className="bg-[#fbfbfb] p-4 rounded-md border border-[#dadada]">
                                                <p className="font-din text-xs font-bold tracking-wider text-gray-500 mb-1">SELECTED SPECIES</p>
                                                <p className="text-2xl font-bold">{selectedSpecies ? selectedSpecies : "All"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="font-din tracking-wider text-sm">Select a marker on the map to view location details</p>
                                    </div>
                                )}
                            </aside>
                        </div>
                    )}
                </div>
            </div>

            <section className="flex flex-col px-10 py-4 bg-[#fbfbfb] gap-4">
                <h2 className="font-din font-bold text-2xl text-elanco-blue">Education Hub</h2>
                {/* Education Cards on each Tick - eventually make a component and use map */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='bg-white border-[#dadada] border-2 rounded-md p-4'>
                        <h1 className='h-50 text-2xl text-elanco-accent text-center font-din font-bold tracking-wide'>Marsh Ticks</h1>
                    </div>
                    <div className='bg-white border-[#dadada] border-2 rounded-md p-4'>
                        <h1 className='h-50 text-2xl text-elanco-accent text-center font-din font-bold tracking-wide'>Fox/Badger Ticks</h1>
                    </div>
                    <div className='bg-white border-[#dadada] border-2 rounded-md p-4'>
                        <h1 className='h-50 text-2xl text-elanco-accent text-center font-din font-bold tracking-wide'>Passerine Ticks</h1>
                    </div>
                </div>
            </section>
            
            <ReportModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => { window.location.reload(); }} 
                cities={citiesOptions} 
                tickSpecies={speciesOptions}/>
        </>
    )
} 

export default Home;