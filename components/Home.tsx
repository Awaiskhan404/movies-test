"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import EmptyState from "./EmptyState";
import MovieCard from "./MovieCard";
import { FiLogOut } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ""
);

type Movie = {
  id: string;
  title: string;
  year: number;
  poster: string;
};

const Home = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const moviesPerPage = 8;

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const getMovies = async () => {
    const { data: movies } = await supabase.from("movies").select("*");
    setMovies(movies || []);
    setLoading(false);
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    setDisplayedMovies(movies.slice(startIndex, endIndex));
  }, [currentPage, movies]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const logout = () => {
    router.push(`/`);
  };

  return (
    <div className="container mx-auto p-8 mb-48">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 pl-32 pr-32">
          {Array.from({ length: moviesPerPage }, (_, index) => (
            <div key={index} className="w-full">
              <Skeleton
                height={300}
                baseColor="#224957"
                highlightColor="#093545"
              />
              <Skeleton
                width={`60%`}
                className="mt-2"
                baseColor="#224957"
                highlightColor="#093545"
              />
              <Skeleton
                width={`40%`}
                className="mt-2"
                baseColor="#224957"
                highlightColor="#093545"
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          {displayedMovies.length > 0 ? (
            <div className="flex justify-between items-center px-4 sm:ml-32 sm:mr-32 mb-16">
              <h1 className="text-2xl sm:text-4xl font-bold flex items-center space-x-2">
                <span>My Movies</span>
                <Link href="/create" legacyBehavior>
                  <AiOutlinePlusCircle className="text-[#fff] text-xl sm:text-2xl cursor-pointer" />
                </Link>
              </h1>
              <button
                className="flex items-center space-x-2 text-white hover:underline"
                onClick={logout}
              >
                <span>Logout</span>
                <FiLogOut className="text-lg" />
              </button>
            </div>
          ) : null}

          {displayedMovies.length === 0 && !loading ? (
            <EmptyState />
          ) : (
            <div className="container mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 px-2 sm:px-4 md:px-0 lg:px-0 xl:px-32">
                {displayedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}

          {movies.length > moviesPerPage && (
            <div className="flex justify-center items-center mt-32 space-x-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-[#224957] text-white hover:bg-[#2BD17E] disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === index + 1
                      ? "bg-[#2BD17E] text-black"
                      : "bg-[#224957] text-white"
                  } hover:bg-[#2BD17E]`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-[#224957] text-white hover:bg-[#2BD17E] disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
