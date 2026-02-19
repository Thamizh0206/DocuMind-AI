import { useState, useRef } from "react";
import robotMascot from "@/assets/robot-mascot.png";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfSidebarProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onProcess: () => void;
  isProcessing: boolean;
  isProcessed: boolean;
}

const PdfSidebar = ({ files, onFilesChange, onProcess, isProcessing, isProcessed }: PdfSidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <aside className="w-80 bg-card border-r border-border flex flex-col h-screen">
      {/* Logo area */}
      <div className="p-6 flex flex-col items-center border-b border-border">
        <img src={robotMascot} alt="DocuMind AI Robot" className="w-28 h-28 object-contain mb-3" />
        <h2 className="font-display text-lg font-bold text-foreground">DocuMind AI</h2>
        <p className="text-xs text-muted-foreground mt-1">Upload & ask anything</p>
      </div>

      {/* Upload section */}
      <div className="p-5 flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          PDF Files
        </h3>

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 mb-4"
        >
          <Upload className="w-8 h-8 text-primary/50 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Click to upload PDFs
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">Multiple files supported</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2 mb-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-secondary/60 rounded-lg px-3 py-2 group"
              >
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground truncate flex-1">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Process button */}
        {files.length > 0 && (
          <Button
            onClick={onProcess}
            disabled={isProcessing}
            className="w-full gradient-coral text-primary-foreground border-0 font-medium shadow-md hover:shadow-lg transition-shadow"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : isProcessed ? (
              "✓ Processed"
            ) : (
              "Submit & Process"
            )}
          </Button>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          AI App created by <span className="font-semibold text-primary">@ Thamizhvendhan</span>
        </p>
      </div>
    </aside>
  );
};

export default PdfSidebar;
