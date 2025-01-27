// components/CreateMovie.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Image from 'next/image';
import {
  AiOutlineCloudUpload,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ""
);

const CreateMovie = () => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function uploadImage(file: any) {
    const fileName = `movies/${Date.now()}-${file.name?.split(" ").join("-")}`;
    const { data, error } = await supabase.storage
      .from("movies")
      .upload(fileName, file);
    console.log({ data });
    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }

    console.log("Image uploaded successfully:", data.fullPath);
    return `https://hisedoayqdvpsebktekf.supabase.co/storage/v1/object/public/${data.fullPath}`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = { title: "", year: "", poster: "" };

    if (!title) {
      formErrors.title = "Title is required";
      toast.error("Title is required");
    }
    if (!year || isNaN(Number(year))) {
      formErrors.year = "Valid year is required";
      toast.error("Valid year is required");
    }
    if (!poster) {
      formErrors.poster = "Poster is required";
      toast.error("Poster is required");
    }

    if (formErrors.title || formErrors.year || formErrors.poster) {
      return;
    }
    setLoading(true);

    const imgPath = await uploadImage(poster);

    try {
      await supabase
        .from("movies")
        .insert([{ title, year, poster: imgPath }])
        .select();

      toast.success("Movie created successfully!");
      setLoading(false);
      router.push("/home");
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      toast.error("Failed to create movie.", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPoster(e.target.files[0]);
    }
  };
  console.log({ loading });
  return (
    <motion.div
      className="w-full max-w-7xl mx-auto p-8 flex flex-wrap items-center justify-between mb-48"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-[28px] md:text-[48px] font-semibold mb-8 w-full text-center md:text-left">
        Create a new movie
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
            <Image
              src={
                poster instanceof File
                  ? URL.createObjectURL(poster)
                  : (poster as string)
              }
              alt="Movie Poster"
              className="max-w-full max-h-full object-cover rounded-md"
              width={500}
              height={500}
              unoptimized={poster instanceof File}
            />
          ) : (
            <>
              <AiOutlineCloudUpload className="text-4xl text-[#fff] mb-4" />
              <span className="text-white text-sm">Upload an image here</span>
            </>
          )}
        </div>
        <div className="flex-1 flex flex-col space-y-6 w-3/4 max-w-md ml-0 sm:ml-32 mt-4 sm:mt-0 order-1 sm:order-2 text-center sm:text-left">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-[45px] px-4 rounded-lg bg-[#224957] text-white border border-[#224957] focus:outline-none focus:ring-2 focus:ring-[#2BD17E]"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Publishing year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full sm:w-1/2 h-[45px] px-4 rounded-lg bg-[#224957] text-white border border-[#224957] focus:outline-none focus:ring-2 focus:ring-[#2BD17E]"
            />
          </div>

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
              } text-white rounded-lg hover:bg-green-600 font-semibold`}
            >
              {loading ? (
                <div className="flex items-center">
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit"
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
              <>
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />{" "}
                Submiting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateMovie;
