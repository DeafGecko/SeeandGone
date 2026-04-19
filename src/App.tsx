import NoteEditor from './components/NoteEditor';
import RecipientView from './components/RecipientView';

function App() {
  // Check the URL path. If it contains "/view/", show the RecipientView
  const isViewPage = window.location.pathname.includes('/view/');

  return (
    <main className="min-h-screen bg-vanish-bg flex items-center justify-center p-4">
      {isViewPage ? <RecipientView /> : <NoteEditor />}
    </main>
  );
}

export default App;