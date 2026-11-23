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
      <div className={`w-full h-full bg-gradient-to-br from-doom-900 via-doom-850 to-doom-950 flex flex-col items-center justify-center p-3 text-center border border-doom-border select-none ${className}`}>
        <div className="w-8 h-8 rounded-lg bg-doom-red/20 text-doom-red flex items-center justify-center mb-1.5">
          <Film size={16} />
        </div>
        <span className="font-cinematic text-sm text-white uppercase tracking-wider line-clamp-2 leading-tight">
          {fallbackTitle || alt || 'Marvel Studios'}
        </span>
        {fallbackSubtitle && (
          <span className="text-[10px] text-gray-500 font-mono mt-0.5">
            {fallbackSubtitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      onLoad={() => setIsLoaded(true)}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-80'} ${className}`}
      {...props}
    />
  );
};
