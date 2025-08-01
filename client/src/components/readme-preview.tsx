import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateReadmeContent } from "@/lib/readme-generator";
import type { Profile } from "@shared/schema";

interface ReadmePreviewProps {
  profile: Profile;
}

export default function ReadmePreview({ profile }: ReadmePreviewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const readmeContent = generateReadmeContent(profile);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(readmeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to Clipboard",
        description: "README content has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generated README.md</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Preview of your enhanced GitHub profile README
              </p>
            </div>
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Raw Markdown Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Raw Markdown Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border font-mono text-sm overflow-auto max-h-96"
            data-readme-content
          >
            <pre className="whitespace-pre-wrap">{readmeContent}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Rendered Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rendered Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            This is how your README will appear on GitHub
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">
                  Hi 👋, I'm {profile.name}
                </h1>
                <h3 className="text-xl text-muted-foreground">
                  {profile.title}
                </h3>
              </div>
              
              {/* Animated GIF placeholder */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">
                  🚀 Animated Typing Effect Here
                </span>
              </div>

              {/* Visitor Counter */}
              <Badge variant="secondary">
                Profile Views: Dynamic Counter
              </Badge>
            </div>

            <Separator />

            {/* About Me Section */}
            {profile.bio && (
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">💫 About Me</h2>
                <div className="space-y-2 text-sm">
                  <p>{profile.bio}</p>
                  {profile.currentFocus && (
                    <p>🔭 <strong>Currently working on:</strong> {profile.currentFocus}</p>
                  )}
                  {profile.email && (
                    <p>📧 <strong>Reach me at:</strong> {profile.email}</p>
                  )}
                  {profile.location && (
                    <p>📍 <strong>Location:</strong> {profile.location}</p>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Social Links */}
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">🌐 Connect with me</h2>
              <div className="flex flex-wrap gap-2">
                {profile.linkedinUrl && (
                  <Badge variant="outline">LinkedIn</Badge>
                )}
                {profile.twitterUrl && (
                  <Badge variant="outline">Twitter</Badge>
                )}
                {profile.kaggleUrl && (
                  <Badge variant="outline">Kaggle</Badge>
                )}
                {profile.socialLinks?.map((link, index) => (
                  <Badge key={index} variant="outline">
                    {link.platform}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Tech Stack */}
            {profile.technologies && profile.technologies.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">💻 Tech Stack</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["language", "framework", "database", "tool", "cloud", "other"].map((category) => {
                    const techs = profile.technologies?.filter(t => t.category === category);
                    if (!techs?.length) return null;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <h4 className="font-semibold capitalize text-sm">
                          {category === "language" ? "Languages" : 
                           category === "framework" ? "Frameworks" :
                           category === "database" ? "Databases" :
                           category === "tool" ? "Tools" :
                           category === "cloud" ? "Cloud" : "Other"}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {techs.map((tech, index) => (
                            <Badge 
                              key={index} 
                              variant={
                                tech.level === "expert" ? "default" :
                                tech.level === "advanced" ? "secondary" :
                                "outline"
                              }
                              className="text-xs"
                            >
                              {tech.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator />

            {/* GitHub Stats */}
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">📊 GitHub Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                  <h4 className="font-semibold">GitHub Stats</h4>
                  <p className="text-sm opacity-90">Dynamic stats will appear here</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                  <h4 className="font-semibold">Streak Stats</h4>
                  <p className="text-sm opacity-90">Contribution streak</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                  <h4 className="font-semibold">Top Languages</h4>
                  <p className="text-sm opacity-90">Most used languages</p>
                </div>
              </div>
            </div>

            {/* Custom Sections */}
            {profile.customSections && profile.customSections.length > 0 && (
              <>
                <Separator />
                <div className="space-y-6">
                  {profile.customSections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <div key={index} className="space-y-3">
                        <h2 className="text-2xl font-semibold">{section.title}</h2>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm">
                            {section.content}
                          </pre>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {/* Footer */}
            <Separator />
            <div className="text-center py-4">
              <Badge variant="outline">
                ✨ Generated with GitHub Profile README Generator
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
