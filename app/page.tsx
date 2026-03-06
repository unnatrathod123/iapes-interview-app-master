'use client';

import { useState, FormEvent, useRef } from "react";
import Image from "next/image";

// Define Types
interface FormState {
  name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  last_exam_appeared: string;
  cgpa: string;
  domain: string;
  duration: string;
  duration_unit: string;
  skills: string;
  
}

export default function RegisterPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", college: "", degree: "",  last_exam_appeared: "",   cgpa: "",    domain: "",    duration: "",    duration_unit: "months",  skills: "",
  });

  const [resume_path, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("");


  // Form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      
      if (resume_path) {
        formData.append("resume_path", resume_path);
      }

      const res = await fetch("https://mansi.durvasaprakrutik.com/api/applicant/submit", { // Backednd api
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      setFeedback("Application submitted successfully!");
      setFeedbackType("success");

      setTimeout(() => {
        setFeedback("");
        setFeedbackType("");
      }, 3000);

      // Reset Form
      setForm({
        name: "", email: "", phone: "", college: "", degree: "",
        last_exam_appeared: "", cgpa: "", domain: "", duration: "",
        duration_unit: "months", skills: "",
      });
      setResume(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err: any) {
      setFeedback(err.message || "Application submission failed.");
      setFeedbackType("error");

      setTimeout(() => {
        setFeedback("");
        setFeedbackType("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#F8FAFC] via-[#E8F2FB] to-[#F8FAFC] text-[#1F2937] py-10 px-6 relative">
      
      {/* Feedback Message */}
      {feedback && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center p-4 w-full max-w-xs rounded-lg shadow-2xl border transition-all
          ${
            feedbackType === "success"
              ? "bg-green-50 border-green-400 text-green-700"
              : "bg-red-50 border-red-400 text-red-700"
          }`}
        >
          <span className="text-lg">
            {feedbackType === "success" ? "✅" : "❌"}
          </span>

          <div className="ml-3 text-sm font-semibold">
            {feedback}
          </div>

          <button
            onClick={() => {
              setFeedback("");
              setFeedbackType("");
            }}
            className="ml-auto rounded-lg px-2 py-1 hover:bg-black/10"
          >
            ✕
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#FFFFFF] p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-[#87BADD] mt-8">
        
        {/* HEADER */}
        <div className="text-center -mt-14 mb-8">
          <div className="flex justify-center mb-0 -mt-10"> 
            <div className="relative w-48 md:w-64 transition-transform duration-300 hover:scale-105">
              <Image 
                src="/TsLogo.png"  alt="TechStrota Logo"  width={600}   height={175} style={{ width: '100%', height: 'auto' }} priority 
              />
            </div>
          </div>
          <p className="font-bold -mt-12 underline decoration-blue-200 text-3xl" style={{ color: '#006BB7' }}>
            Internship Registration Form
          </p>
        </div>

        {/* INPUT FIELDS */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            placeholder="e.g. James Smith"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. admin@gmail.com"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="e.g. 9876543210"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />

          <Input
            label="University / College Name"
            placeholder="e.g. Gujarat University"
            value={form.college}
            onChange={(v) => setForm({ ...form, college: v })}
          />

          <Input
            label="Degree"
            placeholder="e.g. B.Tech, BCA, MSc IT"
            value={form.degree}
            onChange={(v) => setForm({ ...form, degree: v })}
          />

          {/* YEAR DROPDOWN */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-700">
              Year / Semester
            </label>
            <select
              className="w-full border border-[#87BADD] p-3 rounded-lg focus:ring-2 focus:ring-[#87BADD] outline-none bg-[#FFFFFF] text-[#1F2937]"
              value={form.last_exam_appeared}
              onChange={(e) =>
                setForm({ ...form, last_exam_appeared: e.target.value })
              }
            >
              <option value="">Select Year</option>
              <option value="Sem 1">Semester 1</option>
              <option value="Sem 2">Semester 2</option>
              <option value="Sem 3">Semester 3</option>
              <option value="Sem 4">Semester 4</option>
              <option value="Sem 5">Semester 5</option>
              <option value="Sem 6">Semester 6</option>
              <option value="Final Year">Final Year</option>
            </select>
          </div>

          <Input
            label="CGPA / Percentage"
            type="number"
            placeholder="e.g. 8.5 or 85"
            value={form.cgpa}
            onChange={(v) => setForm({ ...form, cgpa: v })}
          />

          <Input
            label="Preferred Domain"
            placeholder="e.g. Web Development, Data Science"
            value={form.domain}
            onChange={(v) => setForm({ ...form, domain: v })}
          />
          
          {/* DURATION FIELD */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-700">Duration</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Duration"
                value={form.duration}
                className="w-1/2 border border-[#87BADD] p-3 rounded-lg focus:ring-2 focus:ring-[#87BADD] outline-none bg-[#FFFFFF] text-[#1F2937]"
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
              <select
                value={form.duration_unit}
                className="w-1/2 border border-[#87BADD] p-3 rounded-lg focus:ring-2 focus:ring-[#87BADD] outline-none bg-[#FFFFFF] text-[#1F2937]"
                onChange={(e) => setForm({ ...form, duration_unit: e.target.value })}
              >
                <option value="months">Months</option>
                <option value="days">Days</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </div>
          
        </div>

        {/* SKILLS FIELD */}
        <div className="mt-6">
          <label className="block text-sm font-semibold mb-1 text-slate-700">Skills (comma separated)</label>
          <textarea 
            value={form.skills} 
            placeholder="e.g. React, Node.js, PHP, Tailwind" 
            className="w-full border border-[#87BADD] p-3 rounded-lg focus:ring-2 focus:ring-[#87BADD] outline-none h-24 bg-[#FFFFFF] text-[#1F2937]" 
            onChange={(e) => setForm({ ...form, skills: e.target.value })} 
          />
        </div>

        {/* RESUME UPLOAD */}
        <div className="mt-6">
          <label className="block text-sm font-semibold mb-1 text-slate-700">Upload Resume</label>
          <input 
            ref={fileInputRef}
            type="file" 
            className="w-full border border-[#87BADD] p-2 rounded-lg bg-[#FFFFFF] text-[#1F2937] cursor-pointer" 
            onChange={(e) => setResume(e.target.files?.[0] || null)} 
          />
        </div>

        <button 
          disabled={loading} 
          type="submit" 
          className={`mt-8 w-full py-4 rounded-lg font-bold text-white transition-all ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#FBAD48] hover:bg-[#F59E0B] shadow-lg'}`}
        >
          {loading ? "Submitting Application..." : "Apply Now"}
        </button>

      </form>
    </div>
  );
}

// Simplified Input Component
interface InputProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

function Input({ label, type = "text", placeholder, value, onChange }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1 text-slate-700">
        {label}
      </label>
      <input
        type={type}  value={value}  placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#87BADD] p-3 rounded-lg focus:ring-2 focus:ring-[#87BADD] outline-none bg-[#FFFFFF] text-[#1F2937]"
        
      />
    </div>
  );
}
