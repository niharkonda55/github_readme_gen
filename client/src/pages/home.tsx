import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Github, Download, Eye, Sparkles } from "lucide-react";
import ProfileForm from "@/components/profile-form";
import ReadmePreview from "@/components/readme-preview";
import { Button } from "@/components/ui/button";
import type { Profile } from "@shared/schema";

export default function Home() {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState("form");

  const handleProfileGenerated = (profile: Profile) => {
    setCurrentProfile(profile);
    setActiveTab("preview");
  };

  const downloadReadme = (content: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Github className="h-8 w-8 text-primary" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  GitHub Profile README Generator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create an enhanced, interactive GitHub profile README
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              Enhanced • Interactive • Professional
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="form" className="flex items-center space-x-2">
              <span>Profile Form</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Github className="h-5 w-5" />
                  <span>Create Your Enhanced GitHub Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm onProfileGenerated={handleProfileGenerated} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {currentProfile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">README Preview</h2>
                  <Button
                    onClick={() => {
                      const readmeContent = document.querySelector('[data-readme-content]')?.textContent || '';
                      downloadReadme(readmeContent);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download README.md</span>
                  </Button>
                </div>
                <ReadmePreview profile={currentProfile} />
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Github className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Profile Generated Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Fill out the profile form to generate your enhanced GitHub README
                    </p>
                    <Button 
                      onClick={() => setActiveTab("form")}
                      variant="outline"
                    >
                      Go to Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
