import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  width,
  height,
  count = 1,
}) => {
  const baseClass = 'skeleton-shimmer bg-slate-800/60 rounded';
  const variantClass =
    variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'rounded h-3' : 'rounded-lg';

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClass} ${variantClass} ${className}`}
          style={{
            width: width ?? '100%',
            height: height ?? (variant === 'text' ? 12 : 40),
          }}
        />
      ))}
    </>
  );
};

/** Full card skeleton matching RallyThumbnailCard dimensions */
export const RallyCardSkeleton: React.FC = () => (
  <div className="rounded-2xl bg-slate-900/60 border border-slate-800/60 p-3 space-y-3">
    <Skeleton variant="rect" height={140} className="rounded-xl" />
    <div className="space-y-2 px-1">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton variant="circle" width={20} height={20} />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  </div>
);

/** Grid of skeleton cards for loading states */
export const RallyGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <RallyCardSkeleton key={i} />
    ))}
  </div>
);

/** Video player skeleton */
export const VideoPlayerSkeleton: React.FC = () => (
  <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
    <Skeleton variant="rect" height={360} className="rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton variant="rect" height={6} className="rounded-full" />
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={80} />
      </div>
    </div>
  </div>
);
