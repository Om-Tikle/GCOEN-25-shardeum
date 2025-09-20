'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </header>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Account Management</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="jane.doe@campus.edu" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Security</CardTitle>
            <CardDescription>Change your password and manage security settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Change Password</h3>
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <Button>Update Password</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="2fa" className="font-semibold">Two-Factor Authentication (2FA)</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
              <Switch id="2fa" />
            </div>
             <Separator />
             <div>
                <h3 className="font-semibold">Recent Login Activity</h3>
                <p className="text-sm text-muted-foreground">Chrome on MacOS - <span className="text-primary">Current session</span></p>
                <p className="text-sm text-muted-foreground mt-1">Safari on iOS - 2 days ago</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">App Preferences</CardTitle>
            <CardDescription>Customize your app experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="font-semibold">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Reduce eye strain in low light.</p>
              </div>
              {mounted && (
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="font-semibold">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Get updates on your events and tickets.</p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
