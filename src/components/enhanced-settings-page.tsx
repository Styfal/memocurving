"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useAuthContext } from "@/lib/AuthContext";
import {
    collection,
    doc,
    Firestore,
    getDoc,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";

const userSchema = z.object({
    name: z.string().min(1, "Display name is required"),
    //language: z.string(),
    //isdarkMode: z.boolean(),
});

type formUser = z.infer<typeof userSchema>;

type user = {
    id: string;
    name: string;
    email: string;
    language: string;
    isDarkMode: boolean;
};

export function EnhancedSettingsPageComponent() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isProfileVisible, setIsProfileVisible] = useState(true);
    const [language, setLanguage] = useState("english");
    const [profileImage, setProfileImage] = useState(
        "/placeholder.svg?height=100&width=100"
    );

    const [userInfo, setUserInfo] = useState<user>();
    const { user, userId, displayName } = useAuthContext();

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
        document.documentElement.classList.toggle("dark");
    };

    const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const result = e.target?.result;
                if (typeof result === "string") {
                    setProfileImage(result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Account Deitails Settings

    const { register, handleSubmit } = useForm<formUser>();

    const onSubmit: SubmitHandler<formUser> = (data) => {
        console.log(data);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const userDocRef = doc(db as Firestore, "users", userId as string); // Assuming userId is the document ID
            // const userSnapshot = await getDoc(userDocRef);

            const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
                if (snapshot.exists()) {
                    const userData = {
                        id: snapshot.id,
                        name: snapshot.data().name || "",
                        email: snapshot.data().email || "",
                        isDarkMode: snapshot.data().isDarkMode || false,
                        ...snapshot.data(),
                    } as user;
                    setUserInfo(userData);
                    console.log(userData);
                } else {
                    console.log("No such document!");
                }
            });
            return () => {
                unsubscribe();
            };
        };
        fetchUserData();
    }, [userId]);

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
                            <TabsTrigger value="notifications">
                                Notifications
                            </TabsTrigger>
                            <TabsTrigger value="connections">
                                Connections
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="w-20 h-20">
                                        <AvatarImage
                                            src={profileImage}
                                            alt="Profile picture"
                                        />
                                        <AvatarFallback>UN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                        >
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
                                    <Input
                                        id="bio"
                                        placeholder="Tell us about yourself"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="account">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <p>Email</p>
                                    <p>{userInfo?.email}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        {...register("name")}
                                        id="username"
                                        placeholder="Your username"
                                    />
                                </div>
                                {/* <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Your email"
                                    />
                                </div> */}
                                {/* <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div> */}
                                {/* <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select
                                        {...register("language")}
                                        value={language}
                                        onValueChange={setLanguage}
                                    >
                                        <SelectTrigger id="language">
                                            <SelectValue placeholder="Select Language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="english">
                                                English
                                            </SelectItem>
                                            <SelectItem value="spanish">
                                                Spanish
                                            </SelectItem>
                                            <SelectItem value="french">
                                                French
                                            </SelectItem>
                                            <SelectItem value="german">
                                                German
                                            </SelectItem>
                                            <SelectItem value="japanese">
                                                Japanese
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center space-x-2">
                                        <Switch {...register("isdarkMode")}
                                            id="dark-mode"
                                            checked={isDarkMode}
                                            onCheckedChange={toggleDarkMode}
                                        />
                                        <Label htmlFor="dark-mode">
                                            Dark Mode
                                        </Label>
                                        {isDarkMode ? (
                                            <Moon className="h-4 w-4" />
                                        ) : (
                                            <Sun className="h-4 w-4" />
                                        )}
                                    </div>
                                </div> */}
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
                                        onCheckedChange={setIsProfileVisible}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="study-history">
                                        Study History Privacy
                                    </Label>
                                    <Select defaultValue="friends">
                                        <SelectTrigger id="study-history">
                                            <SelectValue placeholder="Select who can see your study history" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">
                                                Public
                                            </SelectItem>
                                            <SelectItem value="friends">
                                                Friends Only
                                            </SelectItem>
                                            <SelectItem value="private">
                                                Private
                                            </SelectItem>
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
                                    <Switch id="push-notifications" />
                                    <Label htmlFor="push-notifications">
                                        Push Notifications
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
                {/* <CardFooter className="flex justify-between">
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
                </CardFooter> */}
            </Card>
        </div>
    );
}
