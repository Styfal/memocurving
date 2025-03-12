// "use client"

// import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Eye, EyeOff, Moon, Sun, Upload, Github, Mail, Facebook } from "lucide-react";

// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// import { db, auth } from "@/lib/firebase";

// export function EnhancedSettingsPageComponent() {
//   // Use the authenticated user's UID.
//   const currentUser = auth.currentUser;
//   if (!currentUser) {
//     return <div>Please log in to access your settings.</div>;
//   }
//   const userId = currentUser.uid;

//   // Settings state variables
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isProfileVisible, setIsProfileVisible] = useState(true);
//   const [language, setLanguage] = useState("english");
//   const [profileImage, setProfileImage] = useState("/placeholder.svg?height=100&width=100");
//   const [username, setUsername] = useState("");
//   // New state for in‑app notifications
//   const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);

//   // Load pushNotificationsEnabled from localStorage on mount
//   useEffect(() => {
//     const stored = localStorage.getItem("pushNotificationsEnabled");
//     if (stored !== null) {
//       setPushNotificationsEnabled(JSON.parse(stored));
//     }
//   }, []);

//   // Load settings from Firestore when the component mounts
//   useEffect(() => {
//     const loadSettings = async () => {
//       const docRef = doc(db, "users", userId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         if (data.isDarkMode !== undefined) {
//           setIsDarkMode(data.isDarkMode);
//           // Apply dark mode class if enabled
//           if (data.isDarkMode) {
//             document.documentElement.classList.add("dark");
//           } else {
//             document.documentElement.classList.remove("dark");
//           }
//           localStorage.setItem("darkMode", JSON.stringify(data.isDarkMode));
//         }
//         if (data.isProfileVisible !== undefined) {
//           setIsProfileVisible(data.isProfileVisible);
//         }
//         if (data.language !== undefined) {
//           setLanguage(data.language);
//         }
//         if (data.profileImage !== undefined) {
//           setProfileImage(data.profileImage);
//         }
//         if (data.name !== undefined) {
//           setUsername(data.name);
//         }
//       } else {
//         // Initialize the settings document with defaults if it doesn't exist
//         await setDoc(doc(db, "users", userId), {
//           isDarkMode: false,
//           isProfileVisible: true,
//           language: "english",
//           profileImage: "/placeholder.svg?height=100&width=100",
//           name: "",
//         });
//       }
//     };

//     loadSettings();
//   }, [userId]);

//   // Toggle dark mode and update Firestore & localStorage
//   const toggleDarkMode = async () => {
//     const newValue = !isDarkMode;
//     setIsDarkMode(newValue);
//     document.documentElement.classList.toggle("dark");
//     localStorage.setItem("darkMode", JSON.stringify(newValue));
//     const docRef = doc(db, "users", userId);
//     await updateDoc(docRef, { isDarkMode: newValue });
//   };

//   // Handle profile image changes and update Firestore
//   const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e: ProgressEvent<FileReader>) => {
//         const result = e.target?.result;
//         if (typeof result === "string") {
//           setProfileImage(result);
//           // Update Firestore with the new profile image
//           (async () => {
//             const docRef = doc(db, "users", userId);
//             await updateDoc(docRef, { profileImage: result });
//           })();
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle language changes and update Firestore
//   const handleLanguageChange = async (newLanguage: string) => {
//     setLanguage(newLanguage);
//     const docRef = doc(db, "users", userId);
//     await updateDoc(docRef, { language: newLanguage });
//   };

//   // Handle profile visibility changes and update Firestore
//   const handleProfileVisibilityChange = async (visible: boolean) => {
//     setIsProfileVisible(visible);
//     const docRef = doc(db, "users", userId);
//     await updateDoc(docRef, { isProfileVisible: visible });
//   };

//   // Handle in‑app notification toggle change
//   const handlePushNotificationsChange = (checked: boolean) => {
//     setPushNotificationsEnabled(checked);
//     localStorage.setItem("pushNotificationsEnabled", JSON.stringify(checked));
//   };

//   // Handle account form submission (currently for username only)
//   const handleAccountSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     const docRef = doc(db, "users", userId);
//     await updateDoc(docRef, { name: username });
//     // Optionally, you could show a success message here.
//   };

//   return (
//     <div className={`min-h-screen p-8 ${isDarkMode ? "dark" : ""}`}>
//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle>Settings</CardTitle>
//           <CardDescription>Manage your account settings and preferences.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Tabs defaultValue="profile" className="w-full">
//             <TabsList className="grid w-full grid-cols-5">
//               <TabsTrigger value="profile">Profile</TabsTrigger>
//               <TabsTrigger value="account">Account</TabsTrigger>
//               <TabsTrigger value="privacy">Privacy</TabsTrigger>
//               <TabsTrigger value="notifications">Notifications</TabsTrigger>
//               <TabsTrigger value="connections">Connections</TabsTrigger>
//             </TabsList>
//             <TabsContent value="profile">
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-4">
//                   <Avatar className="w-20 h-20">
//                     <AvatarImage src={profileImage} alt="Profile picture" />
//                     <AvatarFallback>UN</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <Button variant="outline" size="sm" className="mt-2">
//                       <Label htmlFor="picture" className="cursor-pointer flex items-center">
//                         <Upload className="mr-2 h-4 w-4" />
//                         Change Picture
//                       </Label>
//                     </Button>
//                     <Input
//                       id="picture"
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={handleProfileImageChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="bio">Bio</Label>
//                   <Input id="bio" placeholder="Tell us about yourself" />
//                 </div>
//                 {/* Dark mode toggle now appears only in the Profile tab */}
//                 <div className="flex items-center space-x-2">
//                   <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
//                   <Label htmlFor="dark-mode">Dark Mode</Label>
//                   {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="account">
//               <form className="space-y-4" onSubmit={handleAccountSubmit}>
//                 <div className="space-y-2">
//                   <Label htmlFor="username">Username</Label>
//                   <Input
//                     id="username"
//                     placeholder="Your username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input id="email" type="email" placeholder="Your email" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="current-password">Current Password</Label>
//                   <Input id="current-password" type="password" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="new-password">New Password</Label>
//                   <Input id="new-password" type="password" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="language">Language</Label>
//                   <Select value={language} onValueChange={handleLanguageChange}>
//                     <SelectTrigger id="language">
//                       <SelectValue placeholder="Select Language" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="english">English</SelectItem>
//                       <SelectItem value="spanish">Spanish</SelectItem>
//                       <SelectItem value="french">French</SelectItem>
//                       <SelectItem value="german">German</SelectItem>
//                       <SelectItem value="japanese">Japanese</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <Button type="submit">Save Changes</Button>
//               </form>
//             </TabsContent>
//             <TabsContent value="privacy">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-0.5">
//                     <Label htmlFor="profile-visibility">Profile Visibility</Label>
//                     <p className="text-sm text-muted-foreground">
//                       {isProfileVisible ? "Your profile is visible to others" : "Your profile is hidden"}
//                     </p>
//                   </div>
//                   <Switch
//                     id="profile-visibility"
//                     checked={isProfileVisible}
//                     onCheckedChange={handleProfileVisibilityChange}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="study-history">Study History Privacy</Label>
//                   <Select defaultValue="friends">
//                     <SelectTrigger id="study-history">
//                       <SelectValue placeholder="Select who can see your study history" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="public">Public</SelectItem>
//                       <SelectItem value="friends">Friends Only</SelectItem>
//                       <SelectItem value="private">Private</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="notifications">
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-2">
//                   <Switch id="email-notifications" />
//                   <Label htmlFor="email-notifications">Email Notifications</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Switch 
//                     id="push-notifications" 
//                     checked={pushNotificationsEnabled} 
//                     onCheckedChange={handlePushNotificationsChange} 
//                   />
//                   <Label htmlFor="push-notifications">In‑App Notification</Label>
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="connections">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <Github className="h-5 w-5" />
//                     <span>GitHub</span>
//                   </div>
//                   <Button variant="outline" size="sm">Connect</Button>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <Mail className="h-5 w-5" />
//                     <span>Google</span>
//                   </div>
//                   <Button variant="outline" size="sm">Connect</Button>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <Facebook className="h-5 w-5" />
//                     <span>Facebook</span>
//                   </div>
//                   <Button variant="outline" size="sm">Connect</Button>
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//         <CardFooter className="flex justify-end">
//           {/* Only profile visibility toggle remains here */}
//           <div className="flex items-center space-x-2">
//             {isProfileVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
//             <span className="text-sm text-muted-foreground">
//               Profile {isProfileVisible ? "Visible" : "Hidden"}
//             </span>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }



"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Eye,
  EyeOff,
  Moon,
  Sun,
  Upload,
  Github,
  Mail,
  Facebook,
} from "lucide-react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export function EnhancedSettingsPageComponent() {
  // Unconditionally call all hooks
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const [language, setLanguage] = useState("english");
  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=100&width=100"
  );
  const [username, setUsername] = useState("");
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);

  // Get the current user (do not return early)
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : "";

  // Load pushNotificationsEnabled from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("pushNotificationsEnabled");
    if (stored !== null) {
      setPushNotificationsEnabled(JSON.parse(stored));
    }
  }, []);

  // Load settings from Firestore when the component mounts
  useEffect(() => {
    if (!userId) return;
    const loadSettings = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isDarkMode !== undefined) {
          setIsDarkMode(data.isDarkMode);
          if (data.isDarkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          localStorage.setItem("darkMode", JSON.stringify(data.isDarkMode));
        }
        if (data.isProfileVisible !== undefined) {
          setIsProfileVisible(data.isProfileVisible);
        }
        if (data.language !== undefined) {
          setLanguage(data.language);
        }
        if (data.profileImage !== undefined) {
          setProfileImage(data.profileImage);
        }
        if (data.name !== undefined) {
          setUsername(data.name);
        }
      } else {
        // Initialize the settings document with defaults if it doesn't exist
        await setDoc(doc(db, "users", userId), {
          isDarkMode: false,
          isProfileVisible: true,
          language: "english",
          profileImage: "/placeholder.svg?height=100&width=100",
          name: "",
        });
      }
    };

    loadSettings();
  }, [userId]);

  // Toggle dark mode and update Firestore & localStorage
  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", JSON.stringify(newValue));
    if (userId) {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, { isDarkMode: newValue });
    }
  };

  // Handle profile image changes and update Firestore
  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setProfileImage(result);
          if (userId) {
            (async () => {
              const docRef = doc(db, "users", userId);
              await updateDoc(docRef, { profileImage: result });
            })();
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle language changes and update Firestore
  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    if (userId) {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, { language: newLanguage });
    }
  };

  // Handle profile visibility changes and update Firestore
  const handleProfileVisibilityChange = async (visible: boolean) => {
    setIsProfileVisible(visible);
    if (userId) {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, { isProfileVisible: visible });
    }
  };

  // Handle in‑app notification toggle change
  const handlePushNotificationsChange = (checked: boolean) => {
    setPushNotificationsEnabled(checked);
    localStorage.setItem("pushNotificationsEnabled", JSON.stringify(checked));
  };

  // Handle account form submission (currently for username only)
  const handleAccountSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (userId) {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, { name: username });
      // Optionally, show a success message here.
    }
  };

  // If the user is not logged in, render a fallback message.
  if (!currentUser) {
    return <div>Please log in to access your settings.</div>;
  }

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? "dark" : ""}`}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your account settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileImage} alt="Profile picture" />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Label
                        htmlFor="picture"
                        className="cursor-pointer flex items-center"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Change Picture
                      </Label>
                    </Button>
                    <Input
                      id="picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" placeholder="Tell us about yourself" />
                </div>
                {/* Dark mode toggle now appears only in the Profile tab */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  {isDarkMode ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="account">
              <form className="space-y-4" onSubmit={handleAccountSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </TabsContent>
            <TabsContent value="privacy">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="profile-visibility">
                      Profile Visibility
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {isProfileVisible
                        ? "Your profile is visible to others"
                        : "Your profile is hidden"}
                    </p>
                  </div>
                  <Switch
                    id="profile-visibility"
                    checked={isProfileVisible}
                    onCheckedChange={handleProfileVisibilityChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="study-history">Study History Privacy</Label>
                  <Select defaultValue="friends">
                    <SelectTrigger id="study-history">
                      <SelectValue placeholder="Select who can see your study history" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="notifications">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="email-notifications" />
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="push-notifications"
                    checked={pushNotificationsEnabled}
                    onCheckedChange={handlePushNotificationsChange}
                  />
                  <Label htmlFor="push-notifications">
                    In‑App Notification
                  </Label>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="connections">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Github className="h-5 w-5" />
                    <span>GitHub</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Google</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Facebook className="h-5 w-5" />
                    <span>Facebook</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          {/* Only profile visibility toggle remains here */}
          <div className="flex items-center space-x-2">
            {isProfileVisible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
            <span className="text-sm text-muted-foreground">
              Profile {isProfileVisible ? "Visible" : "Hidden"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
