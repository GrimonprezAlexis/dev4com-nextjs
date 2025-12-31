import React, { useState, useEffect } from "react";
import { Database, AlertCircle, CheckCircle, User, Mail } from "lucide-react";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const SettingsPanel: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // États pour la modification d'email
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [updatingEmail, setUpdatingEmail] = useState(false);

  // Charger l'état du mode maintenance depuis Firestore
  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'settings', 'maintenance');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMaintenanceMode(docSnap.data().enabled || false);
      } else {
        // Créer le document s'il n'existe pas
        await setDoc(docRef, { enabled: false });
        setMaintenanceMode(false);
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement du statut' });
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceToggle = async () => {
    if (!auth.currentUser) {
      setMessage({ type: 'error', text: 'Authentification requise' });
      return;
    }

    try {
      setSaving(true);
      const newStatus = !maintenanceMode;

      // Sauvegarder dans Firestore
      await setDoc(doc(db, 'settings', 'maintenance'), {
        enabled: newStatus,
        updatedAt: new Date(),
        updatedBy: auth.currentUser.email
      });

      setMaintenanceMode(newStatus);
      setMessage({
        type: 'success',
        text: `Mode maintenance ${newStatus ? 'activé' : 'désactivé'} avec succès`
      });

      // Effacer le message après 3 secondes
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating maintenance status:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!auth.currentUser || !auth.currentUser.email) {
      setMessage({ type: 'error', text: 'Authentification requise' });
      return;
    }

    if (!newEmail || !password) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setMessage({ type: 'error', text: 'Format d\'email invalide' });
      return;
    }

    if (newEmail === auth.currentUser.email) {
      setMessage({ type: 'error', text: 'Le nouvel email est identique à l\'actuel' });
      return;
    }

    try {
      setUpdatingEmail(true);

      // Réauthentification requise pour la modification d'email
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Mise à jour de l'email
      await updateEmail(auth.currentUser, newEmail);

      setMessage({
        type: 'success',
        text: 'Email mis à jour avec succès'
      });

      // Réinitialiser le formulaire
      setIsEditingEmail(false);
      setNewEmail('');
      setPassword('');

      // Effacer le message après 3 secondes
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error updating email:', error);

      let errorMessage = 'Erreur lors de la mise à jour de l\'email';

      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe incorrect';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format d\'email invalide';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Veuillez vous reconnecter avant de modifier votre email';
      }

      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleCancelEmailEdit = () => {
    setIsEditingEmail(false);
    setNewEmail('');
    setPassword('');
    setMessage(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Paramètres</h2>
      </div>

      {/* Message de feedback */}
      {message && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-500/10 border-green-500/50 text-green-400'
            : 'bg-red-500/10 border-red-500/50 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Paramètres Compte */}
      <div className="bg-black/20 rounded-lg border border-white/5 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-medium text-white">Compte</h3>
            <p className="text-sm text-gray-400">Gérer votre compte</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Modification Email */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <label className="text-sm font-medium text-white block mb-1">
                  Adresse email
                </label>
                <p className="text-xs text-gray-400">
                  {isEditingEmail
                    ? 'Entrez votre nouvel email et votre mot de passe actuel'
                    : `Email actuel: ${auth.currentUser?.email || 'Non disponible'}`
                  }
                </p>
              </div>

              {!isEditingEmail && (
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm font-medium"
                >
                  Modifier
                </button>
              )}
            </div>

            {isEditingEmail && (
              <div className="mt-4 space-y-4 p-4 bg-black/30 rounded-lg border border-white/5">
                <div>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Nouvel email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-black/30 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                      disabled={updatingEmail}
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Mot de passe actuel"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/30 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                      disabled={updatingEmail}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateEmail}
                    disabled={updatingEmail || !newEmail || !password}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingEmail ? 'Mise à jour...' : 'Confirmer'}
                  </button>
                  <button
                    onClick={handleCancelEmailEdit}
                    disabled={updatingEmail}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paramètres Système */}
      <div className="bg-black/20 rounded-lg border border-white/5 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Database size={20} />
          </div>
          <div>
            <h3 className="font-medium text-white">Système</h3>
            <p className="text-sm text-gray-400">Paramètres système</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Mode Maintenance */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label htmlFor="maintenance" className="text-sm font-medium text-white block mb-1">
                Mode maintenance
              </label>
              <p className="text-xs text-gray-400">
                Affiche un message de maintenance sur la page d'accueil pour les visiteurs
              </p>
            </div>

            {loading ? (
              <div className="w-12 h-6 bg-gray-700 rounded-full animate-pulse" />
            ) : (
              <button
                onClick={handleMaintenanceToggle}
                disabled={saving}
                className={`w-12 h-6 rounded-full p-1 transition-all ${
                  maintenanceMode ? "bg-blue-500" : "bg-gray-700"
                } ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                    maintenanceMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            )}
          </div>

          {/* Indicateur d'état */}
          {maintenanceMode && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">
                  Le mode maintenance est actuellement activé
                </span>
              </div>
              <p className="text-xs text-yellow-400/70 mt-2">
                Les visiteurs verront un message de maintenance sur la page d'accueil.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
