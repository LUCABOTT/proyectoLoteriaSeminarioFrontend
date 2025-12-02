import { X } from 'lucide-react';

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  size = 'md',
  className = '' 
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className={`bg-zinc-900 border border-zinc-800 w-full ${sizes[size]} max-h-[90vh] overflow-y-auto ${className}`}>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children, onClose, className = '' }) {
  return (
    <div className={`sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between ${className}`}>
      <div className="flex-1">
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export function ModalBody({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`p-6 border-t border-zinc-800 ${className}`}>
      {children}
    </div>
  );
}
