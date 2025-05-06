import React from 'react';
import { Globe, Bell, Shield, Database } from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const settingsSections = [
    {
      icon: <Globe size={20} />,
      title: 'Général',
      description: 'Paramètres généraux du site',
      settings: [
        { id: 'site-name', label: 'Nom du site', type: 'text', value: 'DM Development' },
        { id: 'site-desc', label: 'Description', type: 'textarea', value: 'Agence de développement web' },
      ]
    },
    {
      icon: <Bell size={20} />,
      title: 'Notifications',
      description: 'Gérer les notifications',
      settings: [
        { id: 'email-notif', label: 'Notifications par email', type: 'toggle', value: true },
        { id: 'contact-notif', label: 'Alertes formulaire de contact', type: 'toggle', value: true },
      ]
    },
    {
      icon: <Shield size={20} />,
      title: 'Sécurité',
      description: 'Paramètres de sécurité',
      settings: [
        { id: '2fa', label: 'Authentification à deux facteurs', type: 'toggle', value: false },
        { id: 'session-timeout', label: 'Expiration de session (minutes)', type: 'number', value: '30' },
      ]
    },
    {
      icon: <Database size={20} />,
      title: 'Système',
      description: 'Paramètres système',
      settings: [
        { id: 'maintenance', label: 'Mode maintenance', type: 'toggle', value: false },
        { id: 'debug', label: 'Mode debug', type: 'toggle', value: false },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Paramètres</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => (
          <div
            key={section.title}
            className="bg-black/20 rounded-lg border border-white/5 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                {section.icon}
              </div>
              <div>
                <h3 className="font-medium">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {section.settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <label htmlFor={setting.id} className="text-sm">
                    {setting.label}
                  </label>
                  {setting.type === 'toggle' ? (
                    <button
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        setting.value ? 'bg-blue-500' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                        setting.value ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  ) : (
                    <input
                      type={setting.type}
                      id={setting.id}
                      value={setting.value}
                      className="bg-black/30 border border-white/10 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingsPanel;