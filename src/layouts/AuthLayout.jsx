import { Ticket } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthLayout({ children, side = 'left', title, subtitle, sideContent }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {side === 'left' && (
        <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 items-center justify-center p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-amber-400/5 to-transparent" />
          {sideContent}
          <div className="absolute top-20 right-20 w-2 h-2 bg-amber-400/30" />
          <div className="absolute bottom-32 left-20 w-3 h-3 bg-amber-400/20" />
          <div className="absolute top-1/3 left-12 w-1 h-1 bg-amber-400/40" />
        </div>
      )}

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-amber-400 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="text-zinc-100 font-semibold text-xl">Lotería</span>
          </Link>

          {(title || subtitle) && (
            <div className="mb-8">
              {title && <h1 className="text-2xl font-semibold text-zinc-100 mb-2">{title}</h1>}
              {subtitle && <p className="text-zinc-400 text-sm">{subtitle}</p>}
            </div>
          )}

          {children}
        </div>
      </div>

      {side === 'right' && (
        <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 items-center justify-center p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-amber-400/5 to-transparent" />
          {sideContent}
          <div className="absolute top-20 left-20 w-2 h-2 bg-amber-400/30" />
          <div className="absolute bottom-32 right-20 w-3 h-3 bg-amber-400/20" />
          <div className="absolute top-1/3 right-12 w-1 h-1 bg-amber-400/40" />
        </div>
      )}
    </div>
  );
}

export function AuthSideContent({ icon: Icon, title, description, stats }) {
  return (
    <div className="relative z-10 text-center">
      {Icon && (
        <div className="w-32 h-32 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-8">
          <Icon className="w-16 h-16 text-amber-400" />
        </div>
      )}
      {title && <h2 className="text-3xl font-semibold text-zinc-100 mb-4">{title}</h2>}
      {description && <p className="text-zinc-400 text-base max-w-sm">{description}</p>}
      
      {stats && stats.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-8">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-2xl font-semibold text-amber-400 mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
