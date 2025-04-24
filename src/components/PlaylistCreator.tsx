'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaPlus, FaTrash } from 'react-icons/fa';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  isFavorite: boolean;
  videoId: string;
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
}

interface YouTubePlayerEvent {
  target: YouTubePlayer;
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          height: string;
          width: string;
          videoId: string;
          playerVars: {
            autoplay: number;
            controls: number;
            modestbranding: number;
            rel: number;
          };
          events: {
            onReady: (event: YouTubePlayerEvent) => void;
            onError: (event: YouTubePlayerEvent) => void;
          };
        }
      ) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const initialSongs: Song[] = [
  {
    id: 1,
    title: "Happy Birthday",
    artist: "Stevie Wonder",
    duration: "3:45",
    isFavorite: true,
    videoId: "inS9gAgSENE"
  },
  {
    id: 2,
    title: "Birthday",
    artist: "Katy Perry",
    duration: "3:35",
    isFavorite: false,
    videoId: "jqYxyd1iSNk"
  },
  {
    id: 3,
    title: "Celebration",
    artist: "Kool & The Gang",
    duration: "4:58",
    isFavorite: true,
    videoId: "cIg6odS-fA0"
  },
  {
    id: 4,
    title: "Venus in Furs",
    artist: "The Velvet Underground",
    duration: "5:12",
    isFavorite: false,
    videoId: "Jow9HujXZ00"
  },
  {
    id: 5,
    title: "Lover, You Should've Come Over",
    artist: "Jeff Buckley",
    duration: "6:44",
    isFavorite: false,
    videoId: "HxfE6PJmGS8"
  }
];

export default function PlaylistCreator() {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '', duration: '', videoId: '' });
  const [player, setPlayer] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize YouTube player
    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: '',
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
          },
          onError: (event: any) => {
            setError('Failed to load video: ' + event.data);
          }
        }
      });
    };

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  const handlePlayPause = (song: Song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    } else {
      if (player) {
        player.loadVideoById(song.videoId);
        setCurrentSong(song);
        setIsPlaying(true);
      }
    }
  };

  const handleToggleFavorite = (songId: number) => {
    setSongs(songs.map(song => 
      song.id === songId ? { ...song, isFavorite: !song.isFavorite } : song
    ));
  };

  const handleAddSong = () => {
    if (newSong.title && newSong.artist && newSong.duration && newSong.videoId) {
      const song: Song = {
        id: Date.now(),
        title: newSong.title,
        artist: newSong.artist,
        duration: newSong.duration,
        isFavorite: false,
        videoId: newSong.videoId
      };
      setSongs([...songs, song]);
      setNewSong({ title: '', artist: '', duration: '', videoId: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteSong = (songId: number) => {
    setSongs(songs.filter(song => song.id !== songId));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-700 mb-2">Birthday Playlist Creator</h2>
        <p className="text-gray-600">Create your perfect birthday playlist! 🎵</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Your Playlist</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <FaPlus /> Add Song
          </button>
        </div>

        <div id="youtube-player" className="w-full aspect-video mb-6"></div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-purple-50 p-4 rounded-lg mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Song Title"
                  value={newSong.title}
                  onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                  className="p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Artist"
                  value={newSong.artist}
                  onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                  className="p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 3:45)"
                  value={newSong.duration}
                  onChange={(e) => setNewSong({ ...newSong, duration: e.target.value })}
                  className="p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="YouTube Video ID"
                  value={newSong.videoId}
                  onChange={(e) => setNewSong({ ...newSong, videoId: e.target.value })}
                  className="p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAddSong}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Add to Playlist
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="sr-only">Dismiss</span>
              ×
            </button>
          </div>
        )}

        <div className="space-y-4">
          {songs.map((song) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center justify-between p-4 rounded-lg ${
                currentSong?.id === song.id ? 'bg-purple-100' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handlePlayPause(song)}
                  className="text-purple-600 hover:text-purple-700 transition"
                >
                  {currentSong?.id === song.id && isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <div>
                  <h4 className="font-medium text-gray-800">{song.title}</h4>
                  <p className="text-sm text-gray-600">{song.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-500">{song.duration}</span>
                <button
                  onClick={() => handleToggleFavorite(song.id)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  {song.isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>
                <button
                  onClick={() => handleDeleteSong(song.id)}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Happy Birthday, Aviu! 🎂 May your day be filled with joy and great music! 🎵
          </p>
        </div>
      </div>
    </div>
  );
} 