import React from 'react';
import { Song } from '../types';

interface PlaylistModalProps {
  theme: string;
  songs: Song[];
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ theme, songs, isLoading, error, onClose }) => {
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
                    <p className="text-gray-600 text-lg mt-4">Curating your playlist...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4" role="img" aria-label="Warning">⚠️</div>
                    <p className="text-gray-700 text-lg mb-6">{error}</p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            );
        }

        return (
            <>
                <ul className="space-y-2 mb-4 max-h-80 overflow-y-auto -mr-2 pr-2">
                    {songs.map((song, index) => {
                        const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`;
                        return (
                            <li key={index}>
                                <a
                                    href={spotifySearchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 w-full"
                                    aria-label={`Search for ${song.title} by ${song.artist} on Spotify`}
                                >
                                    <div className="flex-shrink-0 text-gray-500 font-mono text-sm w-5 text-center">{index + 1}.</div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800 leading-tight">{song.title}</p>
                                        <p className="text-sm text-gray-500">{song.artist}</p>
                                    </div>
                                    <div className="flex-shrink-0 text-gray-400 hover:text-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </div>
                                </a>
                            </li>
                        )
                    })}
                </ul>
                <p className="text-xs text-center text-gray-500 mt-2">
                    Clicking a song will search for it on Spotify.
                </p>
            </>
        );
    }
  
    return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="playlist-title"
    >
        <div 
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md m-4 transform animate-fade-in-up flex flex-col"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 id="playlist-title" className="text-xl font-bold text-gray-800 capitalize truncate" title={theme}>
                   {isLoading ? "Your Playlist" : theme}
                </h2>
                <button 
                    onClick={onClose} 
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                    aria-label="Close playlist"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex-grow overflow-hidden">
                 {renderContent()}
            </div>

        </div>
    </div>
  );
};

export default PlaylistModal;