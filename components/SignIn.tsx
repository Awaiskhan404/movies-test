// components/SignIn.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { useTranslation } from "react-i18next";
// import LanguageSelector from "./LanguageSelector";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ""
);

const SignIn = () => {
  // const { i18n } = useTranslation();
  // const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // const changeLanguage = (lang: string) => {
  //   i18n.changeLanguage(lang);
  // };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log({error});


    if (error) {
      toast.error(error.message);
      setLoading(false)
      throw new Error(error.message);
    }

    toast.success("Login successful");
    setTimeout(() => {
      setLoading(false);
      router.push("/home");
    }, 1000);
  };

  return (
    <motion.div
      className="w-full max-w-sm px-6 py-10 text-center relative top-[-50px]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* <LanguageSelector /> */}

      <motion.h1
        className="font-montserrat font-semibold text-center text-4xl md:text-[64px] md:text-6xl leading-[56px] md:leading-[80px] mb-12"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* {t("signin")} */}
        Sign In
      </motion.h1>
      <motion.form
        className="mt-8 space-y-6 flex flex-col items-center"
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[300px] h-[45px] px-4 rounded-lg bg-[#224957] text-sm text-white border border-[#224957] focus:outline-none focus:ring-2 focus:ring-[#2BD17E] focus:border-transparent placeholder-[#FFFFFF] placeholder-opacity-80"
          />
        </div>
        <div>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[300px] h-[45px] px-4 rounded-lg bg-[#224957] text-sm text-white border border-[#224957] focus:outline-none focus:ring-2 focus:ring-[#2BD17E] focus:border-transparent placeholder-[#FFFFFF] placeholder-opacity-80"
          />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <label htmlFor="remember" className="flex items-center space-x-2">
            <input
              id="remember"
              type="checkbox"
              className="appearance-none w-[18px] h-[17px] rounded-[5px_0_0_0] bg-[#224957] border-[#224957] text-[#2BD17E] checked:bg-[#2BD17E] focus:ring-2 focus:ring-[#2BD17E]"
            />
            <span className="text-sm text-white">Remember me</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-[300px] py-3 rounded-lg flex items-center justify-center ${
            loading ? "bg-gray-400" : "bg-[#2BD17E]"
          } text-white font-semibold text-lg hover:bg-green-600 transition duration-200`}
        >
          {loading ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />{" "}
              Loading...
            </>
          ) : (
            "Login"
          )}
        </button>
      </motion.form>
    </motion.div>
  );
};

export default SignIn;
