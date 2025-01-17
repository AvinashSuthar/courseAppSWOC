"use client";

import React, { useState } from "react";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AddClass({
  courseId,
  courseName,
}: {
  courseId: string;
  courseName: string;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({
    title: "",
    courseId: courseId,
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("video/")) {
        setError("Please upload a valid video file.");
        setFile(null);
        return;
      }

      const maxSize = 1024 * 1024 * 1024; // 1GB
      if (selectedFile.size > maxSize) {
        setError("File size must be less than 100MB.");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null); // Reset error if the file is valid
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a valid video file.");
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("courseId", values.courseId);
      formData.append("recordedClass", file);

      await axios.post("/api/add-class", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            progressEvent.total
              ? (progressEvent.loaded / progressEvent.total) * 100
              : 0
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (uploadProgress === 100) {
        toast({
          title: "Processing...",
          description:
            "Your file has been uploaded. Server is processing the data.",
          variant: "default",
        });
      }

      toast({
        title: "Created!",
        description: `Class added successfully!`,
        variant: "success",
      });

      setIsOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant={"default"} size={"sm"}>
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>
            Add Class to <span className="text-blue-500">"{courseName}"</span>
          </SheetTitle>
          <SheetDescription>
            Enter the details of your new class
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter the title of the class"
              value={values.title}
              onChange={(e) => setValues({ ...values, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Video</Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </span>
            ) : (
              "Add Class"
            )}
          </Button>
        </form>
        <div className="mt-10">
          {isLoading && (
            <div className="w-full flex flex-col gap-1">
              <p className="text-sm text-neutral-300">Uploading...</p>
              <Progress color="green" value={uploadProgress} />
              <p className="font-semibold text-neutral-300">
                {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
