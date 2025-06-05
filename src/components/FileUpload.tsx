'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'; // Assuming you have a Progress component

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  acceptedFileTypes?: { [key: string]: string[] }; // e.g., { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
  maxSize?: number; // in bytes
}

export function FileUpload({
  onFileAccepted,
  acceptedFileTypes = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls'],
    'text/csv': ['.csv'],
  },
  maxSize = 5 * 1024 * 1024, // 5MB default
}: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      setError(null);
      setUploadedFile(null);
      setUploadProgress(0);

      if (fileRejections.length > 0) {
        const firstRejection = fileRejections[0];
        if (firstRejection.errors[0].code === 'file-too-large') {
          setError(`File is too large. Max size is ${maxSize / (1024 * 1024)}MB.`);
        } else if (firstRejection.errors[0].code === 'file-invalid-type') {
          setError('Invalid file type. Please upload an Excel or CSV file.');
        } else {
          setError(firstRejection.errors[0].message);
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress <= 100) {
            setUploadProgress(progress);
          } else {
            clearInterval(interval);
            onFileAccepted(file); // Callback after "upload"
          }
        }, 100);
      }
    },
    [onFileAccepted, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize,
    multiple: false,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}
          ${error ? 'border-destructive bg-destructive/10' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`w-12 h-12 mb-3 ${isDragActive || error ? '' : 'text-muted-foreground'}`} />
        {isDragActive ? (
          <p className="text-lg font-semibold">Drop the file here ...</p>
        ) : (
          <>
            <p className="text-lg font-semibold">Drag & drop your Excel/CSV file here, or click to select</p>
            <p className="text-sm text-muted-foreground">Supported formats: XLSX, XLS, CSV (Max {maxSize / (1024 * 1024)}MB)</p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          <XCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {uploadedFile && !error && (
        <div className="p-4 border rounded-lg bg-secondary/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile}>
              <XCircle className="w-5 h-5 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
          {uploadProgress > 0 && uploadProgress <= 100 && (
             <div className="mt-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-right mt-1">{uploadProgress}% uploaded</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
