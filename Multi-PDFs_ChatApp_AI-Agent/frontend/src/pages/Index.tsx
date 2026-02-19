import { useState } from "react";
import PdfSidebar from "@/components/PdfSidebar";
import ChatArea from "@/components/ChatArea";
import { toast } from "sonner";
import { processPdfs } from "@/lib/api";

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one PDF file.");
      return;
    }

    setIsProcessing(true);
    try {
      await processPdfs(files);
      setIsProcessed(true);
      toast.success("PDFs processed successfully! You can now ask questions.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to process PDFs");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <PdfSidebar
        files={files}
        onFilesChange={setFiles}
        onProcess={handleProcess}
        isProcessing={isProcessing}
        isProcessed={isProcessed}
      />
      <ChatArea isReady={isProcessed} />
    </div>
  );
};

export default Index;
