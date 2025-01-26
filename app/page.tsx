"use client";

import * as React from "react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import "@radix-ui/themes/styles.css"
import axios from "axios";
import { main } from "../scripts/simpleMintAndRegister";
import { Theme } from  '@radix-ui/themes'


// Utility function for class names
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

// Button Variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-primary-foreground hover:bg-indigo-700",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// FileUpload Component
function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [videoSource, setVideoSource] = useState("");

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024, // Max file size 100MB
  });

  const handleRender = async () => {
    console.log("Render button clicked", file);
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`flex items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-gray-50"
            : "border-gray-300 bg-white hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Any file type</p>
        </div>
      </div>
      {file && (
        <p className="text-sm text-gray-600">Selected file: {file.name}</p>
      )}
      <Button
        onClick={handleRender}
        disabled={!file}
        className="w-full py-3 text-lg"
      >
        Render
      </Button>
      {videoSource && <source src={videoSource} type="video/mp4" />}
    </div>
  );
}

// Home Component
export default function Home() {
  const [downloadedFile, setDownloadedFile] = useState<string | null>(null);
  const [storyData, setStoryData] = useState<any>(null);

  const downloadFile = async () => {
    try {
      const { data } = await axios.get("http://127.0.0.1:5000/download", {
        responseType: "blob",
      });
      const blobUrl = URL.createObjectURL(data);
      setDownloadedFile(blobUrl);
      const response = await main(blobUrl);
      setStoryData(response);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Theme>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #ebf4ff, #ffffff)",
          padding: "1rem",
        }}
      >
        <div
          style={{
            maxWidth: "768px",
            width: "100%",
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              color: "#1f2937",
              lineHeight: "1.25",
            }}
          >
            Do more with your content.
            <span style={{ display: "block", color: "#4f46e5" }}>
              Make copywritten shorts with one click.
            </span>
          </h1>
        </div>
        <FileUpload />
        <button
          onClick={downloadFile}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Download
        </button>
        {downloadedFile && (
          <video
            controls
            src={downloadedFile}
            style={{
              marginTop: "1.5rem",
              maxWidth: "100%",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}
        {storyData && (
          <ul
            style={{
              marginTop: "1.5rem",
              listStyle: "none",
              padding: "0",
              lineHeight: "1.5",
            }}
          >
            <li>Transaction Hash: {storyData.txHash}</li>
            <li>Token ID: {storyData.tokenId}</li>
            <li>Encoded Tx Data: {storyData.encodedTxData}</li>
            <li>IP ID: {storyData.ipId}</li>
            <li>License Terms IDs: {storyData.licenseTermsIds}</li>
          </ul>
        )}
      </main>
    </Theme>
  )};
