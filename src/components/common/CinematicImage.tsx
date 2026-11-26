import React, { useState } from 'react';
import { Film } from 'lucide-react';

interface CinematicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export const CinematicImage: React.FC<CinematicImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  fallbackSubtitle,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full bg-[#121621] flex flex-col items-center justify-center p-3 text-center border border-white/10 select-none ${className}`}
      >
        <div className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 flex items-center justify-center mb-1.5">
          <Film size={16} aria-hidden="true" />
        </div>
        <span className="font-cinematic text-sm text-white uppercase tracking-wider line-clamp-2 leading-tight">
          {fallbackTitle || alt || 'Doomflix'}
        </span>
        {fallbackSubtitle && (
          <span className="text-[10px] text-slate-400 font-mono mt-0.5 tabular-nums">
            {fallbackSubtitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#121621]">
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent"
        />
      )}
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } outline outline-1 -outline-offset-1 outline-white/10 ${className}`}
        {...props}
      />
    </div>
  );
};
