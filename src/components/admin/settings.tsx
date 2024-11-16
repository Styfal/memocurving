"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface SettingsProps {
  setNotification: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error'; message: string } | null>>;
}

export default function Settings({ 
  setNotification 
}: SettingsProps) {
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    userRegistration: true,
    maxCardSetsPerUser: 10
  });

  const handleSettingChange = (key: keyof typeof systemSettings, value: boolean | number) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    try {
      // Simulated save logic
      setNotification({
        type: 'success',
        message: 'Settings saved successfully'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to save settings'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span>Maintenance Mode</span>
        <Switch 
          checked={systemSettings.maintenanceMode}
          onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <span>User Registration</span>
        <Switch 
          checked={systemSettings.userRegistration}
          onCheckedChange={(checked) => handleSettingChange('userRegistration', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <span>Max Card Sets Per User</span>
        <Input 
          type="number"
          value={systemSettings.maxCardSetsPerUser}
          onChange={(e) => handleSettingChange('maxCardSetsPerUser', Number(e.target.value))}
          className="w-20"
        />
      </div>

      <Button onClick={saveSettings}>Save Settings</Button>
    </div>
  );
}