"use client";

interface MediaFrameProps {
  src?: string;
  alt?: string;
  type?: "image" | "video" | "gif";
  className?: string;
  overlay?: boolean;
  overlayContent?: React.ReactNode;
  rounded?: boolean;
}

export default function MediaFrame({
  src,
  alt = "",
  type = "image",
  className = "",
  overlay = false,
  overlayContent,
  rounded = true,
}: MediaFrameProps) {
  const roundedClass = rounded ? "rounded-[20px]" : "";

  return (
    <div className={`relative overflow-hidden ${roundedClass} ${className}`}>
      {type === "video" && src ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className={`w-full h-full object-cover ${roundedClass}`}
        />
      ) : src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${roundedClass}`}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 ${roundedClass}`} />
      )}

      {overlay && (
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent from-[70%] to-black ${roundedClass}`} />
      )}

      {overlayContent && (
        <div className="absolute inset-0 flex items-end p-6 z-10">
          {overlayContent}
        </div>
      )}
    </div>
  );
}
