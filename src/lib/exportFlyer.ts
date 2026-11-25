export type ExportFormat = "png" | "jpg" | "pdf" | "webp" | "svg";

export interface ExportFormatOption {
  id: ExportFormat;
  label: string;
  description: string;
}

export const EXPORT_FORMATS: ExportFormatOption[] = [
  { id: "png", label: "PNG", description: "Lossless · 300 DPI" },
  { id: "jpg", label: "JPG", description: "Universal · High-Res" },
  { id: "pdf", label: "PDF", description: "Print-Ready Document" },
  { id: "webp", label: "WEBP", description: "Optimized Web" },
  { id: "svg", label: "SVG", description: "Vector Container" },
];

const triggerBlobDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const loadImageSafely = async (src: string): Promise<{ img: HTMLImageElement; cleanup: () => void }> => {
  let objectUrl: string | null = null;
  let targetSrc = src;

  if (!src.startsWith("data:")) {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to fetch image (${response.status})`);
    }
    const blob = await response.blob();
    objectUrl = window.URL.createObjectURL(blob);
    targetSrc = objectUrl;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      resolve({
        img,
        cleanup: () => {
          if (objectUrl) window.URL.revokeObjectURL(objectUrl);
        },
      });
    };
    img.onerror = () => {
      if (objectUrl) window.URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to decode image for export"));
    };
    img.src = targetSrc;
  });
};

const canvasToBlob = (canvas: HTMLCanvasElement, mimeType: string, quality?: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error(`Failed to encode ${mimeType}`));
      },
      mimeType,
      quality
    );
  });
};

/**
 * Exports a flyer image in the requested format (PNG, JPG, PDF, WEBP, or SVG)
 * at full natural resolution or specified custom dimensions.
 */
export const exportFlyerAs = async (
  imageUrl: string,
  format: ExportFormat,
  baseFilename = `pixio-flyer-${Date.now()}`,
  targetWidth?: number,
  targetHeight?: number
): Promise<void> => {
  const { img, cleanup } = await loadImageSafely(imageUrl);

  try {
    const naturalW = img.naturalWidth || 1200;
    const naturalH = img.naturalHeight || 1600;
    const width = targetWidth && targetWidth > 0 ? Math.round(targetWidth) : naturalW;
    const height = targetHeight && targetHeight > 0 ? Math.round(targetHeight) : naturalH;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D context unavailable");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Fill white background for formats without alpha transparency
    if (format === "jpg" || format === "pdf") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    // Draw image using cover-fit so custom dimensions never leave unwanted gaps
    const scale = Math.max(width / naturalW, height / naturalH);
    const drawW = naturalW * scale;
    const drawH = naturalH * scale;
    const offsetX = (width - drawW) / 2;
    const offsetY = (height - drawH) / 2;
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    if (format === "png") {
      const blob = await canvasToBlob(canvas, "image/png");
      triggerBlobDownload(blob, `${baseFilename}.png`);
      return;
    }

    if (format === "jpg") {
      const blob = await canvasToBlob(canvas, "image/jpeg", 0.95);
      triggerBlobDownload(blob, `${baseFilename}.jpg`);
      return;
    }

    if (format === "webp") {
      const blob = await canvasToBlob(canvas, "image/webp", 0.95);
      triggerBlobDownload(blob, `${baseFilename}.webp`);
      return;
    }

    if (format === "pdf") {
      const { jsPDF } = await import("jspdf");
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const orientation = width > height ? "landscape" : "portrait";
      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [width, height],
        hotfixes: ["px_scaling"],
      });
      pdf.addImage(dataUrl, "JPEG", 0, 0, width, height, undefined, "FAST");
      pdf.save(`${baseFilename}.pdf`);
      return;
    }

    if (format === "svg") {
      const pngDataUrl = canvas.toDataURL("image/png");
      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <image href="${pngDataUrl}" width="${width}" height="${height}" />
</svg>`;
      const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
      triggerBlobDownload(blob, `${baseFilename}.svg`);
      return;
    }
  } finally {
    cleanup();
  }
};
