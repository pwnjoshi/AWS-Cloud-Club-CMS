import { useState } from 'react';
import { useInstallPrompt, usePushNotifications } from '../hooks/usePWA';
import { Download, Bell, X } from 'lucide-react';

export default function InstallBanner() {
  const { canInstall, install } = useInstallPrompt();
  const { permission, subscribed, subscribe } = usePushNotifications();
  const [dismissed, setDismissed] = useState(false);

  const showInstall = canInstall && !dismissed;
  const showNotif = permission === 'default' && !subscribed && !dismissed;

  if (!showInstall && !showNotif) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 z-50 animate-in">
      <div className="bg-[var(--color-surface)] border border-white/10 rounded-xl p-4 shadow-2xl shadow-black/50">
        <button onClick={() => setDismissed(true)} className="absolute top-2 right-2 text-gray-500 hover:text-white">
          <X className="w-4 h-4" />
        </button>

        {showInstall && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 shrink-0">
              <Download className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Install App</p>
              <p className="text-xs text-gray-400 mt-0.5 mb-2">Add to home screen for the best experience</p>
              <button onClick={install} className="text-xs font-semibold text-[var(--color-primary)] hover:underline">Install Now</button>
            </div>
          </div>
        )}

        {!showInstall && showNotif && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[var(--color-accent)]/10 shrink-0">
              <Bell className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Enable Notifications</p>
              <p className="text-xs text-gray-400 mt-0.5 mb-2">Get notified about events and announcements</p>
              <button onClick={subscribe} className="text-xs font-semibold text-[var(--color-accent)] hover:underline">Enable</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
