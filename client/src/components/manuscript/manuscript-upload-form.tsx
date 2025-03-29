import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BOOK_GENRES } from "@/lib/constants";
import { Loader2, Upload, BookIcon, CheckCircle2 } from "lucide-react";
import { insertManuscriptSchema } from "@shared/schema";

// Extend the schema with additional fields for the form
const manuscriptSchema = insertManuscriptSchema.extend({
  file: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "Please upload a manuscript file.",
  }),
  coverImage: z.instanceof(FileList).optional(),
});

type ManuscriptFormValues = z.infer<typeof manuscriptSchema>;

export const ManuscriptUploadForm = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ManuscriptFormValues>({
    resolver: zodResolver(manuscriptSchema),
    defaultValues: {
      title: "",
      content: "",
      description: "",
      genre: "",
      status: "draft",
      wordCount: 0,
      targetAudience: "",
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/manuscripts", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/manuscripts"] });
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Your manuscript has been uploaded successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: ManuscriptFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content || "");
    formData.append("description", values.description || "");
    formData.append("genre", values.genre || "");
    formData.append("status", values.status || "draft");
    formData.append("wordCount", values.wordCount?.toString() || "0");
    formData.append("targetAudience", values.targetAudience || "");

    // Append the manuscript file
    const file = values.file[0];
    formData.append("file", file);

    // Append cover image if provided
    if (values.coverImage?.[0]) {
      formData.append("coverImage", values.coverImage[0]);
    }

    uploadMutation.mutate(formData);
  };

  if (isSubmitted) {
    return (
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Manuscript Uploaded Successfully!</CardTitle>
          <CardDescription>
            Our editorial team will review your manuscript and get back to you
            soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            You can track the status of your manuscript in your author
            dashboard.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>
            Submit Another Manuscript
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Manuscript</CardTitle>
        <CardDescription>
          Complete the form below to submit your manuscript for review and
          publication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the title of your book"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the published title of your book.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a compelling description of your book"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    This will appear on your book's page and help readers
                    discover your work.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BOOK_GENRES.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category that best describes your book.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Manuscript File</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Input
                        type="file"
                        accept=".doc,.docx,.pdf,.rtf,.txt"
                        className="hidden"
                        id="manuscript-file"
                        onChange={(e) => onChange(e.target.files)}
                        {...rest}
                      />
                      <label
                        htmlFor="manuscript-file"
                        className="cursor-pointer block"
                      >
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium">
                          {value && value[0]
                            ? value[0].name
                            : "Click to upload your manuscript"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          DOC, DOCX, PDF, RTF or TXT (max 50MB)
                        </p>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="wordCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Word Count</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter approximate word count"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Approximate number of words in your manuscript.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Young Adult, Business Professionals"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The primary audience for your book.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Cover Image (Optional)</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="cover-image"
                        onChange={(e) => onChange(e.target.files)}
                        {...rest}
                      />
                      <label
                        htmlFor="cover-image"
                        className="cursor-pointer block"
                      >
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <BookIcon className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium">
                          {value && value[0]
                            ? value[0].name
                            : "Click to upload a cover image"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          JPG, PNG, or GIF (max 5MB)
                        </p>
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription>
                    If you don't have a cover image, our design team can create
                    one for you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Submit Manuscript"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-gray-500 flex justify-center">
        <p>Need help? Contact our editorial team at support@Yashaswin.com</p>
      </CardFooter>
    </Card>
  );
};
