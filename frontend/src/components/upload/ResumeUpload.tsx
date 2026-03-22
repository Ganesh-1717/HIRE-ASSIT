"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ResumeUploadProps {
  onUpload: (file: File) => void;
}

export default function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileName(file.name);
        onUpload(file);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024,
    });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group
          ${
            isDragActive && !isDragReject
              ? "border-brand-400 bg-brand-50 scale-[1.02] shadow-glow"
              : isDragReject
                ? "border-red-300 bg-red-50"
                : "border-zinc-200 bg-white hover:border-brand-300 hover:bg-brand-50/30 hover:shadow-glass"
          }
        `}
      >
        <input {...getInputProps()} />

        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-brand-100/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative">
          {/* Upload Icon */}
          <div
            className={`
              w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center
              transition-all duration-300 
              ${isDragActive
                ? "bg-brand-100 scale-110 shadow-glow"
                : "bg-gradient-to-br from-zinc-50 to-zinc-100 group-hover:from-brand-50 group-hover:to-brand-100 group-hover:shadow-lg group-hover:shadow-brand-200/30"
              }
            `}
          >
            {isDragActive ? (
              <svg className="w-9 h-9 text-brand-600 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : (
              <svg className="w-9 h-9 text-zinc-400 group-hover:text-brand-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>

          {isDragActive && !isDragReject ? (
            <div className="animate-fade-in">
              <p className="text-xl font-bold text-brand-700">Drop to analyze</p>
              <p className="text-sm text-brand-500 mt-2 font-medium">Release to start AI analysis</p>
            </div>
          ) : isDragReject ? (
            <div className="animate-fade-in">
              <p className="text-xl font-bold text-red-600">Invalid file</p>
              <p className="text-sm text-red-400 mt-2">Only PDF resumes are supported</p>
            </div>
          ) : (
            <div>
              <p className="text-xl font-semibold text-zinc-800">
                Drop your resume here
              </p>
              <p className="text-sm text-zinc-400 mt-2">
                or <span className="text-brand-600 font-semibold hover:text-brand-700 underline underline-offset-2 decoration-brand-300">browse files</span>
              </p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  PDF format
                </div>
                <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Up to 10MB
                </div>
                <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure
                </div>
              </div>
            </div>
          )}

          {fileName && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-xl border border-brand-100">
              <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-brand-700">{fileName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
