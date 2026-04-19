import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, deleteDoc } from 'firebase/firestore'; // Firebase logic
import { db } from '../firebase'; // Your firebase config
import { openNote } from '../utils/crypto';
import { Eye, Trash2, CheckCircle, Loader2 } from 'lucide-react';

export default function RecipientView() {
      const [decryptedText, setDecryptedText] = useState<string | null>(null);
      const [isBurned, setIsBurned] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      // Enhanced Haptic helper for the "Mechanical Release" feel
      const triggerHaptic = () => {
            if (window.navigator.vibrate) {
                  // 10ms tap, 30ms pause, 100ms heavy thump
                  window.navigator.vibrate([10, 30, 100]);
            }
      };

      const handleReveal = async () => {
            setIsLoading(true);
            try {
                  const pathParts = window.location.pathname.split('/');
                  const noteId = pathParts[pathParts.length - 1];
                  const key = window.location.hash.replace('#', '');

                  const docRef = doc(db, "notes", noteId);
                  const docSnap = await getDoc(docRef);

                  if (docSnap.exists()) {
                        const encryptedData = docSnap.data().content;
                        const result = openNote(encryptedData, key);

                        if (result) {
                              setDecryptedText(result);
                              // BURN ON READ: Immediate database destruction
                              await deleteDoc(docRef);
                        } else {
                              setDecryptedText("Error: Decryption failed. The key may be wrong.");
                        }
                  } else {
                        setDecryptedText("Error: This note has already vanished or never existed.");
                  }
            } catch (error) {
                  console.error("Firebase Error:", error);
                  setDecryptedText("Error: Could not connect to the secure vault.");
            } finally {
                  setIsLoading(false);
            }
      };

      const handleBurn = () => {
            triggerHaptic(); // Physical confirmation pulse
            setIsBurned(true);

            // Clear sensitive data from React memory entirely
            setTimeout(() => {
                  setDecryptedText(null);
            }, 1500);
      };

      return (
            <div className="flex flex-col items-center justify-center p-6 min-h-[400px]">
                  <AnimatePresence mode="wait">
                        {!isBurned ? (
                              <motion.div
                                    key="view-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    // The "Digital Smoke" dissolve effect
                                    exit={{
                                          opacity: 0,
                                          filter: 'blur(40px)',
                                          y: -100,
                                          scale: 1.1,
                                          transition: { duration: 1.2, ease: "easeOut" }
                                    }}
                                    className="w-full max-w-2xl bg-vanish-surface p-10 rounded-[2.5rem] shadow-soft border border-black/5"
                              >
                                    {!decryptedText ? (
                                          <div className="text-center">
                                                <div className="mb-6 inline-flex p-4 bg-vanish-sage/10 rounded-full text-vanish-sage">
                                                      {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Eye size={24} />}
                                                </div>
                                                <h3 className="text-xl font-bold text-vanish-charcoal mb-2 uppercase tracking-tighter">Secure Link Detected</h3>
                                                <p className="text-xs text-black/40 mb-8 uppercase tracking-widest leading-relaxed">
                                                      Opening this will destroy the <br /> database record immediately.
                                                </p>
                                                <button
                                                      onClick={handleReveal}
                                                      disabled={isLoading}
                                                      className="w-full py-5 bg-vanish-sage text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-vanish-sage/20 hover:brightness-110 transition-all disabled:opacity-50"
                                                >
                                                      {isLoading ? "Fetching Vault..." : "Reveal & Destroy"}
                                                </button>
                                          </div>
                                    ) : (
                                          <div className="space-y-6">
                                                <div className="p-6 bg-vanish-bg rounded-2xl text-vanish-charcoal leading-relaxed whitespace-pre-wrap font-medium border border-black/5">
                                                      {decryptedText}
                                                </div>
                                                <button
                                                      onClick={handleBurn}
                                                      className="w-full py-4 border-2 border-dashed border-vanish-sage/30 text-vanish-sage font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-vanish-sage/5 transition-all flex items-center justify-center gap-2"
                                                >
                                                      <Trash2 size={14} /> Close Session - Wipe Screen
                                                </button>
                                          </div>
                                    )}
                              </motion.div>
                        ) : (
                              <motion.div
                                    key="success-message"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                              >
                                    <div className="mb-4 inline-flex p-4 bg-vanish-sage/20 rounded-full text-vanish-sage">
                                          <CheckCircle size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-vanish-charcoal uppercase tracking-tighter">See and Gone</h2>
                                    <p className="text-sm text-black/30 mt-2">Data purged from Database and Client.</p>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </div>
      );
}