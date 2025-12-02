export function Badge({ children, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300',
    primary: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
    success: 'bg-green-500/10 text-green-400 border border-green-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
  };

  return (
    <span 
      className={`inline-block px-2 py-1 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
