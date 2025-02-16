"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function SoalDetail({ params }: { params: { id: string } }) {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [exam, setExam] = useState<any>(null);
  const { id } = params; // Ambil ID dari params

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const user = decoded.user;
        setName(user.name);
        setPhotoProfile(user.photo_profile);

        fetchExamDetail(token);
      } catch (error) {
        console.error("Invalid token:", error);
        setName("");
        setPhotoProfile("");
      }
    }
  }, [id]);

  const fetchExamDetail = async (token: string) => {
    try {
      const response = await axios.get(`http://localhost:3500/api/soal/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setExam(response.data); // Mengatur state exam dengan data yang diterima
    } catch (error) {
      console.error("Error fetching exam:", error);
    }
  };

  // Cek apakah exam sudah di-set
  if (!exam) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
          <h1 className="ml-4 my-2">Detail Ujian</h1>
        </div>
      </div>

      {/* Main item start */}
      <div className="flex flex-col items-center my-8">
        <div className="w-full max-w-[1000px] bg-blue-700 rounded-[20px] p-8">
          {/* Title Section */}
          <h2 className="text-white text-[24px] font-semibold mb-6">
            {exam.title}
          </h2>

          {/* Details Section */}
          <div className="grid grid-cols-3 gap-4 text-white">
            <div className="flex flex-col">
              <span className="text-[18px] font-normal">Kategori</span>
              <span className="text-[18px] font-semibold">
                {exam.category?.name || "N/A"}{" "}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-normal">Kategori Ujian</span>
              <span className="text-[18px] font-semibold">
                {exam.exam_category?.name || "N/A"}{" "}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-normal">Harga</span>
              <span className="text-[18px] font-semibold">
                {exam.is_free ? "Gratis" : "Berbayar"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-normal">Jumlah Soal</span>
              <span className="text-[18px] font-semibold">
                {exam.total_question} Soal
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-normal">Durasi</span>
              <span className="text-[18px] font-semibold">
                {exam.duration} Menit
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-normal">Publikasi</span>
              <span className="text-[18px] font-semibold">
                {exam.is_public ? "Publik" : "Privat"}
              </span>
            </div>
          </div>

          {/* Button Section */}
          <div className="flex justify-center mt-10">
            <Link href={`/soal/detail_soal/${id}`}>
              <div className="w-[300px] h-[52px] bg-white text-blue-700 text-xl font-semibold rounded-[20px] flex items-center justify-center">
                Dapatkan Soal
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main item finish */}
    </div>
  );
}
