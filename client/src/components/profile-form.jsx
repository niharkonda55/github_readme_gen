import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, Github, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProfileSchema } from "@shared/schema";
import { fetchGitHubUserData } from "@/lib/github-api";

const techCategories = [
  "language",
  "framework",
  "database",
  "tool",
  "cloud",
  "other"
];

const skillLevels = [
  "beginner",
  "intermediate",
  "advanced",
  "expert"
];

export default function ProfileForm({ onProfileGenerated }) {
  const { toast } = useToast();
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: {
      githubUsername: "",
      name: "",
      title: "",
      bio: "",
      email: "",
      location: "",
      website: "",
      linkedinUrl: "",
      twitterUrl: "",
      kaggleUrl: "",
      currentFocus: "",
      technologies: [],
      socialLinks: [],
      customSections: [],
    },
  });

  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
    control: form.control,
    name: "technologies",
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: "customSections",
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/profiles", data);
      return response.json();
    },
    onSuccess: (profile) => {
      toast({
        title: "Profile Generated Successfully!",
        description: "Your enhanced GitHub README is ready for preview.",
      });
      onProfileGenerated(profile);
    },
    onError: (error) => {
      toast({
        title: "Error Generating Profile",
        description: error.message || "Failed to generate profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const loadGitHubData = async () => {
    const username = form.getValues("githubUsername");
    if (!username) {
      toast({
        title: "GitHub Username Required",
        description: "Please enter your GitHub username first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingGitHub(true);
    try {
      const userData = await fetchGitHubUserData(username);

      // Auto-fill form with GitHub data
      if (userData.name) form.setValue("name", userData.name);
      if (userData.bio) form.setValue("bio", userData.bio);
      if (userData.email) form.setValue("email", userData.email);
      if (userData.location) form.setValue("location", userData.location);
      if (userData.blog) form.setValue("website", userData.blog);

      toast({
        title: "GitHub Data Loaded",
        description: "Profile information has been populated from your GitHub account.",
      });
    } catch (error) {
      toast({
        title: "Failed to Load GitHub Data",
        description: "Could not fetch data from GitHub. Please fill the form manually.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGitHub(false);
    }
  };

  const onSubmit = (data) => {
    createProfileMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Github className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="githubUsername"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>GitHub Username *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Username" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadGitHubData}
                  disabled={isLoadingGitHub}
                  className="mb-2"
                >
                  {isLoadingGitHub ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Load GitHub Data"
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Full Name" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Android Developer | Programmer" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio / About Me</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself, your interests, and what you're working on..."
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@gmail.com" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Hyderabad, India" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="currentFocus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Focus / Learning</FormLabel>
                  <FormControl>
                    <Input placeholder="Working on xxxxx, Learning xxxxx..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Technologies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tech Stack</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendTech({ name: "", category: "language", level: "intermediate" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Technology
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {techFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2 items-end">
                <FormField
                  control={form.control}
                  name={`technologies.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Technology</FormLabel>
                      <FormControl>
                        <Input placeholder="JavaScript, Python, Kotlin..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`technologies.${index}.category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {techCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`technologies.${index}.level`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {skillLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeTech(index)}
                  className="mb-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Social Links</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendSocial({ platform: "", url: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Social Link
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitterUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/username" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="kaggleUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kaggle URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://kaggle.com/username" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {socialFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2 items-end">
                <FormField
                  control={form.control}
                  name={`socialLinks.${index}.platform`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Platform</FormLabel>
                      <FormControl>
                        <Input placeholder="YouTube, Instagram, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`socialLinks.${index}.url`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSocial(index)}
                  className="mb-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Custom Sections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Custom Sections</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendSection({ title: "", content: "", order: sectionFields.length + 1 })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {sectionFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Section {index + 1}</Badge>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSection(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`customSections.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Projects, Achievements, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`customSections.${index}.order`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Order</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`customSections.${index}.content`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content (Markdown Supported)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your content here. You can use markdown formatting..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Separator />

        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            disabled={createProfileMutation.isPending}
            className="min-w-[150px]"
          >
            {createProfileMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate README"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}