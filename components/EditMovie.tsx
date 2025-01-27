"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  AiOutlineCloudUpload,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ""
);

const EditMovie = () => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [poster, setPoster] = useState<string | File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const movieId = params.id;

  const getMovie = async (movieId: string) => {
    const { data: movie } = await supabase
      .from("movies")
      .select("*")
      .eq("id", movieId);
    return movie;
  };

  useEffect(() => {
    if (movieId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getMovie(String(movieId)).then((movie: any) => {
        if (movie?.length > 0) {
          setTitle(movie[0]?.title);
          setYear(movie[0]?.year);
          setPoster(movie[0]?.poster);
        } else {
          toast.error("Movie not found");
          router.push("/home");
        }
      });
    }
  }, [movieId, router]);

  const uploadImage = async (file: File) => {
    const fileName = `movies/${Date.now()}-${file.name?.split(" ").join("-")}`;
    const { data, error } = await supabase.storage
      .from("movies")
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }

    return `https://hisedoayqdvpsebktekf.supabase.co/storage/v1/object/public/${data.fullPath}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      toast.error("Title is required");
      return;
    }
    if (!year || isNaN(Number(year))) {
      toast.error("Valid year is required");
      return;
    }
    setLoading(true);
    let imgPath = poster;

    if (poster instanceof File) {
      imgPath = await uploadImage(poster);
    }

    await supabase
      .from("movies")
      .update({ title, year, poster: imgPath })
      .eq("id", movieId);

    toast.success("Movie updated successfully!");
    setLoading(false);
    router.push("/home");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPoster(e.target.files[0]);
    }
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto p-8 flex flex-wrap items-center justify-between mb-48"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-[28px] md:text-[48px] font-semibold mb-8 w-full text-center md:text-left">
        Edit Movie
      </h1>
      <form
        className="flex flex-col space-y-8 md:flex-row md:space-y-0 lg:space-x-36 items-center md:items-start justify-center md:justify-start w-full"
        onSubmit={handleSubmit}
      >
        <div className="flex-1 border-dashed border-2 border-[#fff] bg-[#224957] rounded-[10px] flex flex-col items-center justify-center relative min-h-[380px] sm:h-[540px] w-full sm:w-full md:w-[473px] max-w-md mt-4 md:mt-0 px-4 order-2 sm:order-1">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          {poster ? (
            /* eslint-disable @next/next/no-img-element */
            // <img
            //   src={
            //     poster instanceof File
            //       ? URL.createObjectURL(poster)
            //       : (poster as string)
            //   }
            //   alt="Movie Poster"
            //   className="max-w-full max-h-full object-cover rounded-md"
            // />
            <Image
              src={String(poster) as string}
              alt="Movie Poster"
              className="rounded-md"
              width={500} // Replace with your actual width
              height={750} // Replace with your actual height
              layout="intrinsic" // Optional for maintaining aspect ratio
            />
          //   <Image
          //   src="https://hisedoayqdvpsebktekf.supabase.co/storage/v1/object/public/movies/movies/1737849326350-placeholder1.jpg"
          //   alt="Movie Poster"
          //   className="rounded-md"
          //   width={500}
          //   height={750}
          //   layout="intrinsic"
          // />
          ) : (
            <>
              <AiOutlineCloudUpload className="text-4xl text-[#fff] mb-4" />
              <span className="text-white text-sm">Upload an image here</span>
            </>
          )}
        </div>
        <div className="flex-1 flex flex-col space-y-6 w-3/4 max-w-md ml-0 sm:ml-32 mt-4 sm:mt-0 order-1 sm:order-2 text-center sm:text-left">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-[45px] px-4 rounded-lg bg-[#224957] text-white border border-[#224957] focus:outline-none focus:ring-2 focus:ring-[#2BD17E]"
          />
          <input
            type="text"
            placeholder="Publishing year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full sm:w-1/2 h-[45px] px-4 rounded-lg bg-[#224957] text-white border border-[#224957] focus:outline-none focus:ring-2 focus:ring-[#2BD17E]"
          />
          <div className="flex flex-row justify-between space-y-12 lg:space-x-4 mt-6 hidden sm:block w-full px-2">
            <button
              type="button"
              className="w-[48%] px-6 py-4 bg-[#093545] text-white rounded-lg hover:bg-[#2BD17E] border border-white font-semibold"
              onClick={() => router.push("/home")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-[48%] px-6 py-4 ${
                loading ? "bg-gray-400" : "bg-[#2BD17E]"
              }  text-white rounded-lg hover:bg-green-600 font-semibold`}
            >
              {loading ? (
                <div className="flex items-center">
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-row justify-between space-x-4 mt-6 block sm:hidden w-full px-2 order-3">
          <button
            type="button"
            className="w-[50%] px-6 py-4 bg-[#093545] text-white rounded-lg hover:bg-[#2BD17E] border border-white font-semibold"
            onClick={() => router.push("/home")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`w-[50%] px-6 py-4 ${
              loading ? "bg-gray-400" : "bg-[#2BD17E]"
            }  text-white rounded-lg hover:bg-green-600 font-semibold`}
          >
            {loading ? (
              <div className="flex items-center">
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditMovie;
