export function Input({ 
  label, 
  error, 
  helperText,
  className = '', 
  containerClassName = '',
  ...props 
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-zinc-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition-colors ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-zinc-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
