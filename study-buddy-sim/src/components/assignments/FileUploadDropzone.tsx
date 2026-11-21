import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Image,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import {
  FilePayload,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_EXTENSIONS,
  useAssignmentStore,
} from "../../stores/useAssignmentStore";

export interface FileUploadDropzoneProps {
  onFileSelected: (file: FilePayload | null) => void;
  selectedFile: FilePayload | null;
  disabled?: boolean;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFileSelected,
  selectedFile,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(
    selectedFile ? 100 : 0
  );
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const validateFile = useAssignmentStore((s) => s.validateFile);

  const processFile = (file: File) => {
    setErrorMessage(null);

    const payload: FilePayload = {
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    };

    const validation = validateFile(payload);
    if (!validation.valid) {
      setErrorMessage(validation.error || "الملف المختار غير صالح.");
      onFileSelected(null);
      return;
    }

    // Simulate upload progress
    setIsSimulatingUpload(true);
    setUploadProgress(25);

    const t1 = setTimeout(() => setUploadProgress(65), 200);
    const t2 = setTimeout(() => {
      setUploadProgress(100);
      setIsSimulatingUpload(false);
      onFileSelected(payload);
    }, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const pickedFile = e.target.files[0];
      processFile(pickedFile);
    }
  };

  const handleRemoveFile = () => {
    setErrorMessage(null);
    setUploadProgress(0);
    onFileSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} ميجابايت`;
    }
    return `${Math.round(bytes / 1024)} كيلوبايت`;
  };

  return (
    <div className="space-y-3" style={{ direction: "rtl" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(",")}
        className="hidden"
        onChange={handleFileInputChange}
        disabled={disabled}
      />

      {/* Selected File Card */}
      {selectedFile && !isSimulatingUpload ? (
        <div className="p-4 rounded-16 bg-[#161926] border border-emerald-500/30 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-10 bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              {selectedFile.name.toLowerCase().endsWith(".pdf") ? (
                <FileText className="w-5 h-5" />
              ) : (
                <Image className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                {selectedFile.name}
              </h4>
              <p className="text-[11px] text-white/50">
                {formatFileSize(selectedFile.size)} •{" "}
                <span className="text-emerald-400 font-bold">
                  جاهز للتسليم
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemoveFile}
            disabled={disabled}
            className="p-1.5 rounded-8 text-white/50 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
            title="حذف الملف واختيار غيره"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : isSimulatingUpload ? (
        /* Uploading progress card */
        <div className="p-6 rounded-16 bg-[#161926] border border-[#fe6257]/30 text-center space-y-3 animate-in fade-in">
          <Loader2 className="w-8 h-8 text-[#fe6257] animate-spin mx-auto" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-white">
              جارِ فحص الملف ورفعه... ({uploadProgress}%)
            </span>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#fe6257] transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Empty Dropzone Target */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`p-6 sm:p-8 rounded-20 border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
            isDragging
              ? "border-[#fe6257] bg-[#753b47]/20 scale-[1.01]"
              : "border-white/15 bg-white/5 hover:bg-white/8 hover:border-white/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="w-12 h-12 rounded-16 bg-[#753b47]/20 text-[#fe6257] border border-[#fe6257]/30 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-xs sm:text-sm text-white">
              اضغط لاختيار ملف الواجب أو اسحبه وأفلته هنا
            </h4>
            <p className="text-[11px] text-white/50">
              صيغ الملفات المدعومة: PDF أو Word أو صور (JPG, PNG) • الحد الأقصى: 10 ميجابايت
            </p>
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="p-3 rounded-12 bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
