import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function MainLayout({ children, showFooter = true }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 pt-20 px-6 pb-12">
        <div className="container mx-auto max-w-6xl">
          {children}
        </div>
      </main>
      {showFooter && <Footer />}
    </>
  );
}
