import React from 'react';
import { Song } from '../types';

interface InlinePlaylistProps {
  theme: string;
  songs: Song[];
}

const InlinePlaylist: React.FC<InlinePlaylistProps> = ({ theme, songs }) => {
  if (!songs || songs.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span role="img" aria-label="music note">🎵</span>
            <span>Your Playlist: <span className="capitalize font-bold">{theme}</span></span>
        </h4>
        <div className="flex flex-wrap gap-2">
            {songs.map((song, index) => {
                const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`;
                return (
                    <a
                        key={index}
                        href={spotifySearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-full hover:bg-gray-200 hover:text-black transition-colors"
                        title={`${song.title} by ${song.artist}`}
                    >
                        <span>{song.title}</span>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                )
            })}
        </div>
         <p className="text-xs text-left text-gray-500 mt-3">
            Click a song to search for it on Spotify.
        </p>
    </div>
  );
};

export default InlinePlaylist;
