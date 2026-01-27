import React, { useState, useEffect, useRef } from 'react';
import { Upload, Search, Grid, List, Plus, Edit2, Trash2, X, Save, Music, Play, Pause, Volume2, Image as ImageIcon } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { uploadToS3, deleteFromS3 } from '../../lib/s3';
import { AudioFile, AudioStatus, AUDIO_STATUSES, AUDIO_CATEGORIES } from '../../types/audio';

const AudioManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAudio, setEditingAudio] = useState<Partial<AudioFile> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        fetchAudioFiles();
      } else {
        setError("Veuillez vous connecter pour accéder au gestionnaire audio");
        setAudioFiles([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAudioFiles = async () => {
    try {
      if (!auth.currentUser) {
        setError("Authentification requise");
        return;
      }

      const querySnapshot = await getDocs(collection(db, 'audio'));
      const audioData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description || '',
          artist: data.artist || '',
          category: data.category || 'Autre',
          fileUrl: data.fileUrl,
          coverUrl: data.coverUrl || '',
          duration: data.duration || 0,
          status: data.status as AudioStatus,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }) as AudioFile[];

      audioData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setAudioFiles(audioData);
      setError(null);
    } catch (error) {
      console.error('Error fetching audio files:', error);
      setError("Erreur lors du chargement des fichiers audio");
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        setError("Le fichier est trop volumineux. Taille maximale: 50MB");
        return;
      }

      if (!file.type.startsWith('audio/')) {
        setError("Le fichier doit être un fichier audio");
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Get audio duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        setEditingAudio(prev => prev ? { ...prev, duration: Math.round(audio.duration) } : prev);
        URL.revokeObjectURL(audio.src);
      };
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("L'image est trop volumineuse. Taille maximale: 5MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError("Le fichier doit être une image");
        return;
      }

      setSelectedCover(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAudio = async () => {
    if (!auth.currentUser) {
      setError("Authentification requise");
      return;
    }
    setIsEditing(true);
    setEditingAudio({
      title: '',
      description: '',
      artist: '',
      category: 'Musique',
      fileUrl: '',
      coverUrl: '',
      duration: 0,
      status: 'Processing',
      createdAt: new Date(),
    });
    setSelectedFile(null);
    setSelectedCover(null);
    setCoverPreviewUrl(null);
  };

  const handleEditAudio = (audio: AudioFile) => {
    setIsEditing(true);
    setEditingAudio(audio);
    setCoverPreviewUrl(audio.coverUrl || null);
    setSelectedFile(null);
    setSelectedCover(null);
  };

  const handleSaveAudio = async () => {
    try {
      if (!editingAudio || !auth.currentUser) {
        setError("Authentification requise");
        return;
      }

      if (!editingAudio.title) {
        setError("Veuillez remplir au moins le titre");
        return;
      }

      if (!editingAudio.id && !selectedFile) {
        setError("Veuillez sélectionner un fichier audio");
        return;
      }

      setIsLoading(true);
      setError(null);

      let fileUrl = editingAudio.fileUrl || '';
      let coverUrl = editingAudio.coverUrl || '';

      // Upload audio file if selected
      if (selectedFile) {
        try {
          console.log('Uploading audio to S3...');
          fileUrl = await uploadToS3(selectedFile, 'audio');
          console.log('Audio uploaded successfully:', fileUrl);
        } catch (uploadError) {
          console.error('S3 upload error:', uploadError);
          throw new Error('Échec de l\'upload du fichier audio: ' + (uploadError instanceof Error ? uploadError.message : 'Erreur inconnue'));
        }
      }

      // Upload cover if selected
      if (selectedCover) {
        try {
          console.log('Uploading cover to S3...');
          coverUrl = await uploadToS3(selectedCover, 'audio-covers');
          console.log('Cover uploaded successfully:', coverUrl);
        } catch (uploadError) {
          console.error('S3 cover upload error:', uploadError);
          // Non-critical, continue without cover
        }
      }

      const audioData = {
        title: editingAudio.title,
        description: editingAudio.description || '',
        artist: editingAudio.artist || '',
        category: editingAudio.category || 'Autre',
        fileUrl: fileUrl,
        coverUrl: coverUrl,
        duration: editingAudio.duration || 0,
        status: editingAudio.status || 'Processing',
        createdAt: Timestamp.fromDate(editingAudio.createdAt || new Date()),
      };

      console.log('Saving audio data:', audioData);

      if (editingAudio.id) {
        console.log('Updating audio:', editingAudio.id);
        await updateDoc(doc(db, 'audio', editingAudio.id), audioData);

        // Delete old files if new ones were uploaded
        if (selectedFile && editingAudio.fileUrl && editingAudio.fileUrl !== fileUrl) {
          try {
            await deleteFromS3(editingAudio.fileUrl);
          } catch (err) {
            console.error('Error deleting old audio (non-critical):', err);
          }
        }
        if (selectedCover && editingAudio.coverUrl && editingAudio.coverUrl !== coverUrl) {
          try {
            await deleteFromS3(editingAudio.coverUrl);
          } catch (err) {
            console.error('Error deleting old cover (non-critical):', err);
          }
        }
      } else {
        console.log('Creating new audio');
        await addDoc(collection(db, 'audio'), audioData);
      }

      console.log('Audio saved successfully');
      setIsEditing(false);
      setEditingAudio(null);
      setSelectedFile(null);
      setSelectedCover(null);
      setCoverPreviewUrl(null);
      setError(null);
      setIsLoading(false);
      await fetchAudioFiles();
    } catch (error) {
      console.error('Error saving audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError("Erreur lors de l'enregistrement: " + errorMessage);
      setIsLoading(false);
    }
  };

  const handleDeleteAudio = async (audio: AudioFile) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${audio.title}" ?`)) {
      return;
    }

    try {
      if (!auth.currentUser) {
        setError("Authentification requise");
        return;
      }

      await deleteDoc(doc(db, 'audio', audio.id));

      if (audio.fileUrl) {
        try {
          await deleteFromS3(audio.fileUrl);
        } catch (err) {
          console.error('Error deleting audio from S3:', err);
        }
      }

      if (audio.coverUrl) {
        try {
          await deleteFromS3(audio.coverUrl);
        } catch (err) {
          console.error('Error deleting cover from S3:', err);
        }
      }

      setError(null);
      fetchAudioFiles();
    } catch (error) {
      console.error('Error deleting audio:', error);
      setError("Erreur lors de la suppression");
    }
  };

  const togglePlay = (audio: AudioFile) => {
    if (playingId === audio.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audio.fileUrl);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingId(null);
      setPlayingId(audio.id);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredAudio = audioFiles.filter(audio => {
    const matchesSearch =
      audio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || audio.status === statusFilter;
    const matchesCategory = !categoryFilter || audio.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Veuillez vous connecter pour accéder au gestionnaire audio</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <audio ref={audioRef} className="hidden" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Gestionnaire Audio</h2>
        <button
          onClick={handleAddAudio}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Nouveau fichier audio</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Tous les statuts</option>
          {AUDIO_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Toutes catégories</option>
          {AUDIO_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="flex bg-black/40 rounded-lg border border-white/10 overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {filteredAudio.length === 0 ? (
        <div className="text-center py-12 bg-black/20 rounded-xl border border-white/10">
          <Volume2 size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">Aucun fichier audio trouvé</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAudio.map(audio => (
            <div
              key={audio.id}
              className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="relative h-48">
                {audio.coverUrl ? (
                  <img
                    src={audio.coverUrl}
                    alt={audio.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <Music size={64} className="text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => togglePlay(audio)}
                    className="p-4 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    {playingId === audio.id ? (
                      <Pause size={24} className="text-white" />
                    ) : (
                      <Play size={24} className="text-white" />
                    )}
                  </button>
                </div>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEditAudio(audio)}
                    className="p-2 bg-blue-500/80 backdrop-blur-sm rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit2 size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDeleteAudio(audio)}
                    className="p-2 bg-red-500/80 backdrop-blur-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    audio.status === 'Published' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    audio.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {audio.status}
                  </span>
                </div>
                {audio.duration && audio.duration > 0 && (
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-1 text-xs bg-black/60 text-white rounded">
                      {formatDuration(audio.duration)}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{audio.title}</h3>
                {audio.artist && (
                  <p className="text-sm text-blue-400 mb-2">{audio.artist}</p>
                )}
                {audio.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{audio.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="px-2 py-1 bg-white/10 rounded-full">{audio.category}</span>
                  <span>{audio.createdAt.toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAudio.map(audio => (
            <div
              key={audio.id}
              className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all flex items-center space-x-4"
            >
              <button
                onClick={() => togglePlay(audio)}
                className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                {playingId === audio.id ? (
                  <Pause size={20} className="text-white" />
                ) : (
                  <Play size={20} className="text-white ml-1" />
                )}
              </button>
              {audio.coverUrl ? (
                <img
                  src={audio.coverUrl}
                  alt={audio.title}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music size={24} className="text-white/30" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">{audio.title}</h3>
                {audio.artist && <p className="text-sm text-blue-400">{audio.artist}</p>}
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span>{audio.category}</span>
                  {audio.duration && audio.duration > 0 && <span>{formatDuration(audio.duration)}</span>}
                  <span className={`px-2 py-1 rounded-full ${
                    audio.status === 'Published' ? 'bg-green-500/20 text-green-400' :
                    audio.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {audio.status}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleEditAudio(audio)}
                  className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit2 size={16} className="text-white" />
                </button>
                <button
                  onClick={() => handleDeleteAudio(audio)}
                  className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && editingAudio && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl max-w-5xl w-full border border-white/10 shadow-2xl my-8">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 border-b border-white/10 flex justify-between items-center rounded-t-xl z-10">
                <h3 className="text-xl font-bold text-white">
                  {editingAudio.id ? 'Modifier le fichier audio' : 'Nouveau fichier audio'}
                </h3>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingAudio(null);
                    setSelectedFile(null);
                    setSelectedCover(null);
                    setCoverPreviewUrl(null);
                    setError(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto">
                {/* Error message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Titre <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingAudio.title}
                    onChange={(e) => setEditingAudio({ ...editingAudio, title: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Titre du fichier audio"
                  />
                </div>

                {/* Artist & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Artiste / Auteur
                    </label>
                    <input
                      type="text"
                      value={editingAudio.artist || ''}
                      onChange={(e) => setEditingAudio({ ...editingAudio, artist: e.target.value })}
                      className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Nom de l'artiste"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={editingAudio.category}
                      onChange={(e) => setEditingAudio({ ...editingAudio, category: e.target.value })}
                      className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {AUDIO_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Statut
                  </label>
                  <select
                    value={editingAudio.status}
                    onChange={(e) => setEditingAudio({ ...editingAudio, status: e.target.value as AudioStatus })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {AUDIO_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingAudio.description || ''}
                    onChange={(e) => setEditingAudio({ ...editingAudio, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Description du fichier audio"
                  />
                </div>

                {/* Audio File */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Fichier audio {!editingAudio.id && <span className="text-red-400">*</span>}
                  </label>
                  <div className="space-y-4">
                    {editingAudio.fileUrl && !selectedFile && (
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Music size={16} />
                        <span>Fichier actuel: {editingAudio.fileUrl.split('/').pop()}</span>
                      </div>
                    )}
                    {selectedFile && (
                      <div className="flex items-center space-x-2 text-sm text-green-400">
                        <Music size={16} />
                        <span>Nouveau fichier: {selectedFile.name}</span>
                      </div>
                    )}
                    <div className="w-full">
                      <label className="block w-full cursor-pointer">
                        <div className="flex items-center justify-center space-x-3 px-6 py-6 bg-purple-500/20 border-2 border-dashed border-purple-500/40 rounded-xl text-purple-400 hover:bg-purple-500/30 hover:border-purple-500/60 transition-all">
                          <Upload size={28} />
                          <span className="text-lg font-medium">{editingAudio.id ? 'Remplacer le fichier' : 'Choisir un fichier audio'}</span>
                        </div>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">Formats: MP3, WAV, OGG, etc. Max: 50MB</p>
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Image de couverture (optionnel)
                  </label>
                  <div className="space-y-4">
                    {coverPreviewUrl && (
                      <img
                        src={coverPreviewUrl}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleSaveAudio}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>Enregistrer</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditingAudio(null);
                      setSelectedFile(null);
                      setSelectedCover(null);
                      setCoverPreviewUrl(null);
                      setError(null);
                    }}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioManager;
