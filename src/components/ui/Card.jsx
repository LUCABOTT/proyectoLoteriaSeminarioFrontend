export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div 
      className={`bg-zinc-900 border border-zinc-800 ${hover ? 'hover:border-zinc-700 transition-colors' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-6 border-b border-zinc-800 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-6 border-t border-zinc-800 ${className}`}>
      {children}
    </div>
  );
}
