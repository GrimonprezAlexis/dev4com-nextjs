'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, User, Clock, Tag, Wrench } from 'lucide-react';
import { collection, getDocs, query, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AudioFile } from '../types/audio';

const AudioCard: React.FC<{
  audio: AudioFile;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
}> = ({ audio, index, isPlaying, onPlay }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="group h-full"
    >
      <div className="relative h-full bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col shadow-lg">
        {/* macOS-style bar */}
        <div className="relative h-9 bg-gradient-to-b from-gray-700 to-gray-800 flex items-center px-4 border-b border-gray-900/50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-[#28ca41] shadow-sm"></div>
          </div>
          <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-300 truncate max-w-[60%] pointer-events-none">
            {audio.title}
          </h2>
        </div>

        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {audio.coverUrl ? (
            <img
              src={audio.coverUrl}
              alt={audio.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <Music size={64} className="text-white/30" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              onClick={onPlay}
              className={`p-5 rounded-full transition-all duration-300 ${
                isPlaying
                  ? 'bg-purple-500 shadow-lg shadow-purple-500/50'
                  : 'bg-white/20 backdrop-blur-sm group-hover:bg-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/50'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause size={28} className="text-white" />
              ) : (
                <Play size={28} className="text-white ml-1" />
              )}
            </motion.button>
          </div>

          {/* Duration badge */}
          {audio.duration && audio.duration > 0 && (
            <div className="absolute bottom-2 right-2">
              <span className="px-2 py-1 text-xs bg-black/60 text-white rounded flex items-center gap-1">
                <Clock size={12} />
                {formatDuration(audio.duration)}
              </span>
            </div>
          )}

          {/* Category badge */}
          {audio.category && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 text-xs bg-purple-500/80 backdrop-blur-sm text-white rounded-full">
                {audio.category}
              </span>
            </div>
          )}
        </div>

        {/* Card content */}
        <div className="flex-1 p-5 bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-sm flex flex-col">
          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
            {audio.title}
          </h4>

          {audio.artist && (
            <div className="flex items-center gap-2 text-purple-300 mb-3">
              <User size={14} />
              <span className="text-sm">{audio.artist}</span>
            </div>
          )}

          {audio.description && (
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 flex-1">
              {audio.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Audio: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    checkMaintenanceMode();
    fetchAudioFiles();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      const docRef = doc(db, 'settings', 'audioMaintenance');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setIsMaintenanceMode(docSnap.data().enabled || false);
      }
    } catch (err) {
      console.error('Error checking maintenance mode:', err);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const fetchAudioFiles = async () => {
    try {
      setLoading(true);
      const audioCollection = collection(db, 'audio');
      const q = query(audioCollection);
      const querySnapshot = await getDocs(q);

      const audioData: AudioFile[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'Published') {
          audioData.push({
            id: doc.id,
            title: data.title,
            description: data.description || '',
            artist: data.artist || '',
            category: data.category || '',
            fileUrl: data.fileUrl,
            coverUrl: data.coverUrl || '',
            duration: data.duration || 0,
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        }
      });

      audioData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setAudioFiles(audioData);
      setError(null);
    } catch (err) {
      console.error('Error fetching audio files:', err);
      setError('Erreur lors du chargement des fichiers audio');
    } finally {
      setLoading(false);
    }
  };

  const playTrack = (audio: AudioFile) => {
    if (currentTrack?.id === audio.id) {
      togglePlayPause();
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setCurrentTrack(audio);
    setIsPlaying(true);
    setCurrentTime(0);

    const newAudio = new window.Audio(audio.fileUrl);
    newAudio.volume = isMuted ? 0 : volume;
    audioRef.current = newAudio;

    newAudio.onloadedmetadata = () => {
      setDuration(newAudio.duration);
    };

    newAudio.ontimeupdate = () => {
      setCurrentTime(newAudio.currentTime);
    };

    newAudio.onended = () => {
      playNext();
    };

    newAudio.play();
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentTrack || audioFiles.length === 0) return;
    const currentIndex = audioFiles.findIndex(a => a.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % audioFiles.length;
    playTrack(audioFiles[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentTrack || audioFiles.length === 0) return;
    const currentIndex = audioFiles.findIndex(a => a.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? audioFiles.length - 1 : currentIndex - 1;
    playTrack(audioFiles[prevIndex]);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mode maintenance
  if (isMaintenanceMode) {
    return (
      <motion.div
        className="min-h-screen pt-24 pb-16 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-12"
            >
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                  <Wrench size={48} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Page en maintenance
                </h1>
              </div>
              <p className="text-gray-300 text-lg mb-6">
                Nous travaillons actuellement sur cette page pour vous offrir une meilleure experience.
              </p>
              <p className="text-gray-400 text-sm">
                La page Audio sera de retour tres bientot. Merci de votre patience !
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        className="min-h-screen pt-24 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Nos Creations Audio
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Decouvrez nos realisations sonores
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-[400px]"
              >
                <div className="h-full animate-pulse bg-white/5 rounded-xl border border-white/10">
                  <div className="h-48 bg-white/10 rounded-t-xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                    <div className="h-3 bg-white/10 rounded w-full" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen pt-24 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (audioFiles.length === 0) {
    return (
      <motion.div
        className="min-h-screen pt-24 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Nos Creations Audio
            </h1>
          </div>
          <div className="text-center py-12">
            <Music size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">Aucun fichier audio disponible pour le moment</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen pt-24 pb-32 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            Nos Creations Audio
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Decouvrez nos realisations sonores, de la musique aux voix off en passant par le sound design
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {audioFiles.map((audio, index) => (
            <AudioCard
              key={audio.id}
              audio={audio}
              index={index}
              isPlaying={isPlaying && currentTrack?.id === audio.id}
              onPlay={() => playTrack(audio)}
            />
          ))}
        </div>
      </div>

      {/* Audio Player Bar */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50"
          >
            {/* Progress bar */}
            <div
              className="h-1 bg-gray-800 cursor-pointer group"
              onClick={seekTo}
            >
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 relative"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Track info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {currentTrack.coverUrl ? (
                    <img
                      src={currentTrack.coverUrl}
                      alt={currentTrack.title}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <Music size={24} className="text-purple-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-white font-medium truncate">{currentTrack.title}</h4>
                    {currentTrack.artist && (
                      <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={playPrevious}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <SkipBack size={24} />
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:opacity-90 transition-opacity"
                  >
                    {isPlaying ? (
                      <Pause size={24} className="text-white" />
                    ) : (
                      <Play size={24} className="text-white ml-1" />
                    )}
                  </button>
                  <button
                    onClick={playNext}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <SkipForward size={24} />
                  </button>
                </div>

                {/* Time & Volume */}
                <div className="flex items-center gap-4 flex-1 justify-end">
                  <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                  </div>

                  <div className="hidden md:flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        setIsMuted(false);
                      }}
                      className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Audio;
