"use client";

import React, { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import { Course } from "@/types/courseType";
import { motion } from "framer-motion";
import DummyFooter from "@/components/ExplorePage/DummyFooter";
import { Search } from "lucide-react";
import { useBulkCoursesStore } from "@/store/courseStore/bulkCoursesStore";
import { useProfileStore } from "@/store/ProfileStore/profileStore";
import CategoryFilters from "@/components/ExplorePage/CategoryFilters";
import { Pagination } from "@mui/material";

const ITEMS_PER_PAGE = 3;

const CoursesPage = () => {
  const { setFilter, courses, fetchCourses, isLoading, isSearching, filter } =
    useBulkCoursesStore();
  const { fetchProfile } = useProfileStore();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchProfile();
    const timer = setTimeout(() => {
      fetchCourses();
    }, 500);

    return () => clearTimeout(timer);
  }, [filter, fetchCourses, fetchProfile]);

  const clearFilters = () => {
    setFilter("");
    setCurrentPage(1);
  };

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        if (event.key === "k") {
          event.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", keyDownHandler);
    return () => window.removeEventListener("keydown", keyDownHandler);
  });

  const paginatedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center md:mb-12 mb-6"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground mb-4">
            Transform Your Career
          </h1>
          <p className="md:text-xl text-base text-muted-foreground text-center">
            Join thousands of learners who have advanced their careers through
            our expert-led courses
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative">
            <Input
              ref={searchInputRef}
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
              placeholder="Ctrl + K to Search Courses"
              className="w-full p-6 pl-24 overflow-hidden relative text-lg rounded-full"
              aria-label="Search Courses"
            />
            <div className="bg-secondary w-20 rounded-l-full absolute top-0 left-0 flex items-center justify-center h-full">
              <Search className="text-neutral-500" />
            </div>
          </div>

          <CategoryFilters setFilter={setFilter} />

          {isSearching && (
            <div className="w-full mt-2">
              <BarLoader width={"100%"} color="hsl(var(--primary))" />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {isLoading ? (
            Array(6)
              .fill(null)
              .map((_, index) => <SkeletonCard key={index} />)
          ) : paginatedCourses.length > 0 ? (
            paginatedCourses.map((course: Course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <h2 className="text-3xl font-bold text-muted-foreground mb-4">
                No Courses Found
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                We couldn't find any courses matching your criteria. Try
                adjusting your filters or search terms.
              </p>
              <Button
                onClick={clearFilters}
                variant="default"
                className="rounded-full"
              >
                View All Courses
              </Button>
            </div>
          )}
        </motion.div>

        {totalPages > 0 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <Pagination
              className="flex justify-center mt-4"
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              size="small"
              siblingCount={1}
              showFirstButton
              showLastButton
            />
          </div>
        )}

        <DummyFooter />
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="space-y-4">
    <Skeleton className="h-48 w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4 rounded-full" />
    <Skeleton className="h-4 w-1/2 rounded-full" />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-1/4 rounded-full" />
      <Skeleton className="h-4 w-1/4 rounded-full" />
    </div>
  </div>
);

export default CoursesPage;
