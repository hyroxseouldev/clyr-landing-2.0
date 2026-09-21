import { generateReactHelpers } from "@uploadthing/react";
import { useState, useRef, useEffect } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const { useUploadThing } = generateReactHelpers({ url: "/api/uploadthing" });
export default function UploadField({ value, onChange, enabled, onBusy }) {
  const [error, setError] = useState("");
  const input = useRef(null);
  const { startUpload, isUploading } = useUploadThing("portfolioImage", {
    onClientUploadComplete: (files) => {
      const file = files[0];
      if (file) onChange(file.serverData?.url || file.ufsUrl);
    },
    onUploadError: () =>
      setError("이미지를 올리지 못했습니다. 연결과 파일 크기를 확인해주세요."),
  });
  useEffect(() => {
    onBusy(isUploading);
    return () => onBusy(false);
  }, [isUploading, onBusy]);
  async function upload(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setError("");
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      setError("PNG, JPG, WebP 파일을 8MB 이하로 올려주세요.");
      return;
    }
    try {
      await startUpload([file]);
    } catch {
      setError("업로드에 실패했습니다. 다시 시도해주세요.");
    }
  }
  return (
    <div className="admin-upload">
      <div className="admin-image-preview">
        {value ? (
          <img src={value} alt="선택한 이미지 미리보기" />
        ) : (
          <ImageIcon size={28} />
        )}
      </div>
      <div className="admin-upload-controls">
        <label>
          이미지 경로
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/assets/... 또는 https://..."
          />
        </label>
        <input
          ref={input}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={upload}
          hidden
        />
        <Button
          type="button"
          className="admin-secondary"
          disabled={!enabled || isUploading}
          onClick={() => input.current.click()}
        >
          <Upload size={15} />
          {isUploading ? "업로드 중…" : "이미지 업로드"}
        </Button>
        <small>
          {enabled
            ? "PNG · JPG · WebP / 최대 8MB"
            : "UploadThing 연결 후 업로드할 수 있습니다. 이미지 URL은 지금 입력할 수 있어요."}
        </small>
        {error && (
          <p role="alert" className="admin-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
