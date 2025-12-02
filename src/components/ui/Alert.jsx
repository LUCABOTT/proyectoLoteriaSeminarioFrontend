export function Alert({ children, variant = 'info', className = '', ...props }) {
  const variants = {
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
  };

  return (
    <div 
      className={`px-4 py-3 text-sm border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
