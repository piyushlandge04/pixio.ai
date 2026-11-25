import { useState } from "react";
import { Download, ChevronDown, Loader2, FileImage, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EXPORT_FORMATS, exportFlyerAs, type ExportFormat } from "@/lib/exportFlyer";
import { toast } from "sonner";

interface DownloadMenuProps {
  imageUrl: string;
  filename?: string;
  targetWidth?: number;
  targetHeight?: number;
  label?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export const DownloadMenu = ({
  imageUrl,
  filename,
  targetWidth,
  targetHeight,
  label = "Download",
  size = "lg",
  className = "",
}: DownloadMenuProps) => {
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (!imageUrl || exportingFormat) return;

    setExportingFormat(format);
    try {
      await exportFlyerAs(imageUrl, format, filename, targetWidth, targetHeight);
      toast.success(`Exported flyer as ${format.toUpperCase()}!`);
    } catch (err) {
      console.error(`Failed to export as ${format}:`, err);
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={size}
          disabled={!!exportingFormat}
          className={`bg-foreground text-background hover:bg-foreground/90 font-bold rounded-xl shadow-md transition-all gap-2 ${className}`}
        >
          {exportingFormat ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Exporting {exportingFormat.toUpperCase()}...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>{label}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75 ml-0.5" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 rounded-2xl border border-border bg-card p-1.5 shadow-xl z-50"
      >
        <DropdownMenuLabel className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2.5 py-1.5">
          <span>Export Format</span>
          {targetWidth && targetHeight && (
            <span className="font-mono text-[9px] text-foreground/70">
              {targetWidth}×{targetHeight}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        {EXPORT_FORMATS.map((fmt) => (
          <DropdownMenuItem
            key={fmt.id}
            onClick={() => handleExport(fmt.id)}
            className="flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer focus:bg-secondary"
          >
            <div className="flex items-center gap-2.5">
              {fmt.id === "pdf" ? (
                <FileText className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <FileImage className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <span className="text-xs font-bold text-foreground">{fmt.label}</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              {fmt.description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
