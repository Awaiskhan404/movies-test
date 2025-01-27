import React from "react";
import { motion } from "framer-motion";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";

type MovieProps = {
  movie: {
    id: string;
    title: string;
    year: number;
    poster: string;
  };
};

const MovieCard = ({ movie }: MovieProps) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/edit/${movie.id}`);
  };

  return (
    <motion.div
      className="relative bg-[#092C39] w-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 p-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* eslint-disable @next/next/no-img-element */}
      {/* <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-[400px] object-cover rounded-[12px]"
      /> */}

      <div className="w-full h-[400px] relative">
        <Image
          src={movie.poster}
          alt={movie.title}
          className="rounded-[12px] object-cover"
          layout="fill" // Makes the image fill the parent container
          objectFit="cover" // Ensures the image is cropped to fit like `object-cover`
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white">{movie.title}</h3>
        <p className="text-sm text-gray-400">{movie.year}</p>
      </div>
      <motion.div>
        <div
          className="hidden sm:block absolute top-4 right-4 bg-[#2BD17E] text-black p-2 rounded-full cursor-pointer shadow-md hover:shadow-lg"
          onClick={handleEdit}
        >
          <FiEdit className="text-lg" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MovieCard;
