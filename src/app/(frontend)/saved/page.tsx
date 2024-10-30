"use client";
import React from "react";
import { useSavedCourses } from "@/hooks/useSavedCourses";
import CourseCard from "@/components/CourseCard";
import { Loader2 } from "lucide-react";
const Page = () => {
  const { savedCourses, isLoading } = useSavedCourses();
  return (
    <div className="mt-6 md:mt-0 mb-2 px-4 md:px-24">
      <h1 className="text-2xl font-bold py-2 ">
        My Saved Courses
      </h1>
      <div>
        {isLoading ? (
          <div className="w-full bgb h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : savedCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 lg:grid-cols-4">
            {savedCourses.map((savedCourse) => (
              <CourseCard key={savedCourse.id} course={savedCourse.course} />
            ))}
          </div>
        ) : (
          <div className="col-span-full mt-40 text-center">
            <h2 className="text-2xl font-semibold italic">
              No Courses Available!
            </h2>
            <p className="text-neutral-400 italic">
              Try saving courses from explore page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;