'use client'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Bell, Shield, Download, Key } from 'lucide-react'
import ProfileSettings from './ProfileSettings'
import NotificationPreferences from './NotificationPreferences'
import AccountSettings from './AccountSettings'
import DataPrivacy from './DataPrivacy'

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Update your personal information and pilot credentials'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Configure email and in-app notification preferences'
    },
    {
      id: 'account',
      label: 'Account',
      icon: Key,
      description: 'Manage your email, password, and security settings'
    },
    {
      id: 'privacy',
      label: 'Data & Privacy',
      icon: Shield,
      description: 'Export your data and manage privacy settings'
    }
  ]

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          )
        })}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </CardTitle>
              <CardDescription>{tab.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {tab.id === 'profile' && <ProfileSettings />}
              {tab.id === 'notifications' && <NotificationPreferences />}
              {tab.id === 'account' && <AccountSettings />}
              {tab.id === 'privacy' && <DataPrivacy />}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}