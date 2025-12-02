export function Spinner({ size = 'md', className = '', center = false }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-2',
    xl: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div 
      className={`${sizes[size]} border-amber-400 border-t-transparent rounded-full animate-spin ${className}`}
    />
  );

  if (center) {
    return (
      <div className="flex items-center justify-center py-12">
        {spinner}
      </div>
    );
  }

  return spinner;
}
