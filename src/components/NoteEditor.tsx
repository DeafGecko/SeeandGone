import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { sealNote } from '../utils/crypto';
import { Shield, Send, Loader2, CheckCircle, Clipboard } from 'lucide-react';

export default function NoteEditor() {
      const [content, setContent] = useState('');
      const [isSealing, setIsSealing] = useState(false);
      const [isSaving, setIsSaving] = useState(false);
      const [shareLink, setShareLink] = useState('');
      const [isCopied, setIsCopied] = useState(false); //

      const handleComplete = async () => {
            setIsSaving(true);
            try {
                  const { encrypted, key } = sealNote(content);
                  const docRef = await addDoc(collection(db, "notes"), {
                        content: encrypted,
                        createdAt: Date.now()
                  });

                  const link = `${window.location.origin}/view/${docRef.id}#${key}`;
                  setShareLink(link);
            } catch (error) {
                  console.error("Error saving note:", error);
            } finally {
                  setIsSaving(false);
                  setIsSealing(false);
            }
      };

      const copyToClipboard = () => {
            navigator.clipboard.writeText(shareLink);
            setIsCopied(true);
            // Hide the toast after 3 seconds
            setTimeout(() => setIsCopied(false), 3000);
      };

      return (
            <div className="flex flex-col items-center justify-center p-6 relative">
                  <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl bg-vanish-surface p-10 rounded-[2.5rem] shadow-soft border border-black/5"
                  >
                        {!shareLink ? (
                              <>
                                    <textarea
                                          disabled={isSaving}
                                          className="w-full h-64 bg-transparent border-none focus:ring-0 text-vanish-charcoal text-xl placeholder:text-black/10 resize-none"
                                          placeholder="Write your private message..."
                                          value={content}
                                          onChange={(e) => setContent(e.target.value)}
                                    />

                                    <div className="mt-8 flex justify-center">
                                          <motion.button
                                                onPointerDown={() => !isSaving && setIsSealing(true)}
                                                onPointerUp={() => setIsSealing(false)}
                                                className="group relative px-12 py-5 rounded-2xl overflow-hidden bg-vanish-sage/10 border border-vanish-sage/20 disabled:opacity-50"
                                          >
                                                <div className="relative z-10 flex items-center gap-3 text-vanish-sage font-black uppercase tracking-widest text-xs">
                                                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                                                      {isSaving ? "Securing..." : isSealing ? "Encrypting..." : "Hold to Seal Note"}
                                                </div>

                                                {isSealing && !isSaving && (
                                                      <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "100%" }}
                                                            transition={{ duration: 1.5, ease: "linear" }}
                                                            onAnimationComplete={handleComplete}
                                                            className="absolute inset-0 bg-vanish-sage/20"
                                                      />
                                                )}
                                          </motion.button>
                                    </div>
                              </>
                        ) : (
                              <div className="text-center animate-in fade-in zoom-in duration-500">
                                    <div className="mb-6 inline-flex p-4 bg-vanish-sage/20 rounded-full text-vanish-sage">
                                          <Send size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-vanish-charcoal mb-2 uppercase tracking-tighter">SeeandGone Link Ready</h3>
                                    <p className="text-[10px] text-black/40 mb-6 uppercase tracking-widest font-bold">The key is safely in the link hash (#).</p>

                                    <div
                                          onClick={copyToClipboard}
                                          className="group w-full p-4 bg-vanish-bg rounded-xl text-xs font-mono border border-black/5 text-vanish-charcoal cursor-pointer flex items-center justify-between hover:bg-black/[0.02] transition-colors"
                                    >
                                          <span className="truncate mr-4">{shareLink}</span>
                                          <Clipboard size={14} className="text-vanish-sage opacity-40 group-hover:opacity-100" />
                                    </div>
                                    <p className="mt-4 text-[9px] text-vanish-sage font-bold uppercase tracking-[0.2em]">Click link to copy</p>
                              </div>
                        )}
                  </motion.div>

                  {/* SUCCESS TOAST */}
                  <AnimatePresence>
                        {isCopied && (
                              <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="fixed bottom-10 px-6 py-3 bg-vanish-charcoal text-white rounded-full flex items-center gap-3 shadow-2xl z-50"
                              >
                                    <CheckCircle size={16} className="text-vanish-sage" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Link Copied to Clipboard</span>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </div>
      );
}