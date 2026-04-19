import NoteEditor from './components/NoteEditor';
import RecipientView from './components/RecipientView';

function App() {
  // Logic to determine if we are viewing a note or creating one
  const isViewPage = window.location.pathname.includes('/view/');

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2D2D] font-sans selection:bg-[#B2C2B9]/20">
      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 p-6 lg:p-12">

        {/* LEFT COLUMN: THE APP CORE */}
        <main className="flex flex-col gap-8">
          <header className="space-y-3">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-[#7C9082]">
              See<span className="text-[#2D2D2D] font-light italic">&</span>Gone
            </h1>
            <div className="max-w-xl">
              <p className="text-sm uppercase tracking-[0.2em] font-bold text-black/30 mb-1">
                Zero-Knowledge Tactical Messenger
              </p>
              <p className="text-md leading-relaxed text-black/60">
                Type your message below. Once sealed, the note is encrypted locally.
                The database record vanishes the moment it is revealed.
              </p>
            </div>
          </header>

          <div className="w-full">
            {isViewPage ? <RecipientView /> : <NoteEditor />}
          </div>

          <footer className="mt-auto pt-12 border-t border-black/5">
            <p className="text-[10px] uppercase tracking-widest font-medium text-black/20">
              © 2026 09 labs • all rights reserved
            </p>
          </footer>
        </main>

        {/* RIGHT COLUMN: SENSE AD SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="sticky top-12 flex flex-col gap-6">
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-black/20 text-center">Sponsored</p>
            <div className="w-full aspect-[3/4] bg-white border border-black/5 rounded-[2rem] shadow-sm flex flex-col items-center justify-center p-8 text-center transition-all hover:shadow-md">
              <span className="text-[10px] uppercase font-bold text-black/30 tracking-widest leading-loose">Sense Ad Space</span>
            </div>
            <div className="w-full h-48 bg-white border border-black/5 rounded-[2rem] shadow-sm flex items-center justify-center p-6 text-center transition-all hover:shadow-md">
              <span className="text-[9px] uppercase font-bold text-black/20 tracking-widest">Secondary Ad Logic</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;