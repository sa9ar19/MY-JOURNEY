import { useEffect } from "react";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "autorelaxed";
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  style,
  className = ""
}: AdUnitProps) {
  useEffect(() => {
    // Check if adsbygoogle script is loaded
    if (typeof window !== "undefined") {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, [slot]); // Re-run when slot changes

  return (
    <div className={`ad-container my-8 ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          ...style
        }}
        data-ad-client="ca-pub-1718972165989515"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}