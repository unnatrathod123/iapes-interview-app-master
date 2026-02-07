'use client';

import { useState, useEffect, FormEvent } from "react";
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
  skills: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  college?: string;
  degree?: string;
  last_exam_appeared?: string;
  cgpa?: string;
  domain?: string;
  skills?: string;
  resume?: string;
}

interface AlertState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function RegisterPage() {
  // Form State
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    college: "",
    degree: "",
    last_exam_appeared: "",
    cgpa: "",
    domain: "",
    skills: "",
  });

  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [alert, setAlert] = useState<AlertState>({ show: false, message: "", type: "success" });

  // Email Verification State
  const [emailStep, setEmailStep] = useState<"email" | "otp" | "verified">("email");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Alert auto-hide
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const showAlert = (message: string, type: 'success' | 'error' = "error") => {
    setAlert({ show: true, message, type });
  };

  // Phone input handler
  const handlePhoneChange = (v: string) => {
    const onlyNums = v.replace(/[^0-9]/g, "");
    if (onlyNums.length <= 10) {
      setForm({ ...form, phone: onlyNums });
      if (onlyNums.length === 10) setErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  // Resume upload
  const handleResumeChange = (file: File | undefined) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      showAlert("Only PDF or Word files allowed", "error");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      showAlert("File size must be less than 10MB", "error");
      return;
    }
    setResume(file);
    setErrors(prev => ({ ...prev, resume: "" }));
  };

  // Email OTP
  const sendOtp = async () => {
    if (!form.email) {
      showAlert("Enter your email first", "error");
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/email/send-otp", {
        method: "POST",
        body: JSON.stringify({ email: form.email }),
      });
      setEmailStep("otp");
      showAlert("OTP sent to your email", "success");
    } catch {
      showAlert("Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      showAlert("Enter OTP", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/email/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp}),
      });
      const data = await res.json();
      if (data.success) {
        setEmailStep("verified");
        showAlert("Email verified successfully!", "success");
      } else {
        showAlert("Invalid OTP", "error");
      }
    } catch {
      showAlert("Verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emailStep !== "verified") {
      showAlert("Please verify your email before submitting", "error");
      return;
    }

    let tempErrors: FormErrors = {};
    if (!form.name) tempErrors.name = "Required";
    if (!form.email) tempErrors.email = "Required";
    if (form.phone.length !== 10) tempErrors.phone = "Must be 10 digits";
    if (!form.college) tempErrors.college = "Required";
    if (!form.degree) tempErrors.degree = "Required";
    if (!form.domain) tempErrors.domain = "Required";
    if (!form.skills) tempErrors.skills = "Required";
    if (!resume) tempErrors.resume = "Required";
    if (!form.last_exam_appeared) tempErrors.last_exam_appeared = "Required";
    if (!form.cgpa) tempErrors.cgpa = "Required";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      showAlert("Please fill all required fields correctly", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (resume) formData.append("resume", resume);

      const response = await fetch("http://127.0.0.1:8000/api/intern", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      const data = await response.json();
      if (!response.ok) throw data;

      showAlert("Application submitted successfully!", "success");
      setForm({
        name: "", email: "", phone: "", college: "", degree: "",
        last_exam_appeared: "", cgpa: "", domain: "", skills: ""
      });
      setResume(null);
      setOtp("");
      setEmailStep("email");
    } catch (err: any) {
      showAlert(err?.message || "Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-900 py-10 px-4 relative">
      {/* ALERT */}
      {alert.show && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center p-4 mb-4 w-full max-w-xs rounded-lg shadow-2xl border ${alert.type === "success" ? "bg-green-600 border-green-700" : "bg-red-600 border-red-700"} text-white transition-all animate-bounce`}>
          <div className="ml-3 text-sm font-bold">{alert.message}</div>
          <button onClick={() => setAlert(prev => ({ ...prev, show: false }))} className="ml-auto bg-white/20 hover:bg-white/40 rounded-lg p-1">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200">
        {/* HEADER */}
        <div className="text-center -mt-12">
          <div className="flex justify-center mb-0 -mt-10"> 
            <div className="relative w-48 md:w-64 transition-transform duration-300 hover:scale-105">
              <Image src="/TsLogo.png" alt="TechStrota Logo" width={600} height={175} style={{ width: '100%', height: 'auto' }} priority />
            </div>
          </div>
          <p className="font-bold -mt-12 mb-15 underline decoration-blue-200 text-3xl" style={{ color: '#2379C0' }}>Internship Registration Form</p>
        </div>

        {/* EMAIL VERIFICATION */}
        <div className="mb-4">
          <Input label="Email Address" type="email" required placeholder="Enter your email" value={form.email} error={errors.email} onChange={(v) => { setForm({ ...form, email: v }); setEmailStep("email"); }} />
          {emailStep === "email" && <button type="button" onClick={sendOtp} disabled={loading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg">Send OTP</button>}
          {emailStep === "otp" && (
            <div className="mt-2 flex gap-2 items-center">
              <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} className="border p-2 rounded-lg w-32" />
              <button type="button" onClick={verifyOtp} className="px-4 py-2 bg-green-600 text-white rounded-lg">Verify OTP</button>
            </div>
          )}
          {emailStep === "verified" && <p className="text-green-600 font-semibold mt-1">✔ Email verified</p>}
        </div>

        {/* REST OF FORM */}
        <fieldset disabled={emailStep !== "verified"}>
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Full Name" required placeholder="Enter full name" value={form.name} error={errors.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="Phone Number" type="tel" required placeholder="Enter Phone Number" value={form.phone} error={errors.phone} onChange={handlePhoneChange} />
            <Input label="College Name" required placeholder="Enter college name" value={form.college} error={errors.college} onChange={(v) => setForm({ ...form, college: v })} />
            <Input label="Degree" required placeholder="Enter Degree e.g B.Tech, BCA" value={form.degree} error={errors.degree} onChange={(v) => setForm({ ...form, degree: v })} />
            <Input label="Last Exam Appeared" required placeholder="e.g. Sem 3, Sem 6, Final Year" value={form.last_exam_appeared} error={errors.last_exam_appeared} onChange={(v) => setForm({ ...form, last_exam_appeared: v })} />
            <Input label="CGPA / Percentage" type="number" required placeholder="e.g. 8.5, 85.5" value={form.cgpa} error={errors.cgpa} onChange={(v) => setForm({ ...form, cgpa: v })} />
            <Input label="Preferred Domain" required placeholder="Enter Your Domain" value={form.domain} error={errors.domain} onChange={(v) => setForm({ ...form, domain: v })} />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-1">Skills (comma separated)<span className="text-red-500">*</span></label>
            <textarea value={form.skills} placeholder="e.g. React, Node.js, PHP, Tailwind" className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 bg-white text-slate-900" onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-1">Upload Resume (Max 10 MB)<span className="text-red-500">*</span></label>
            <input type="file" accept=".pdf,.doc,.docx" className="w-full border p-2 rounded-lg bg-white text-slate-900" onChange={(e) => handleResumeChange(e.target.files?.[0])} />
            {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
          </div>

          <button disabled={loading} type="submit" className={`mt-8 w-full py-4 rounded-lg font-bold text-white transition-all ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'}`}>
            {loading ? "Submitting Application..." : "Apply Now"}
          </button>
        </fieldset>
      </form>
    </div>
  );
}

interface InputProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
}

function Input({ label, type = "text", placeholder, value, onChange, required, error }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1 text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={type === "tel" ? 10 : undefined}
        className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
