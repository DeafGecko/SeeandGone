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
      const [isCopied, setIsCopied] = useState(false);

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
            setTimeout(() => setIsCopied(false), 3000);
      };

      return (
            <div className="flex flex-col items-center justify-center relative">
                  <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full bg-white p-10 rounded-3xl shadow-md border border-black/10"
                  >
                        {!shareLink ? (
                              <>
                                    <textarea
                                          disabled={isSaving}
                                          className="w-full h-84 bg-transparent p-4 focus:ring-0 text-[#2D2D2D] text-xl placeholder:text-black/10 resize-none rounded-2xl transition-colors"
                                          placeholder="Write your private message..."
                                          value={content}
                                          onChange={(e) => setContent(e.target.value)}
                                    />
                                    <div className="mt-8 flex justify-center">
                                          <motion.button
                                                onPointerDown={() => !isSaving && setIsSealing(true)}
                                                onPointerUp={() => setIsSealing(false)}
                                                className="group relative px-12 py-5 rounded-2xl overflow-hidden bg-[#7C9082]/10 border border-[#7C9082]/20 disabled:opacity-50"
                                          >
                                                <div className="relative z-10 flex items-center gap-3 text-[#7C9082] font-black uppercase tracking-widest text-xs">
                                                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                                                      {isSaving ? "Securing..." : isSealing ? "Encrypting..." : "Hold to Seal Note"}
                                                </div>
                                                {isSealing && !isSaving && (
                                                      <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "100%" }}
                                                            transition={{ duration: 1.5, ease: "linear" }}
                                                            onAnimationComplete={handleComplete}
                                                            className="absolute inset-0 bg-[#7C9082]/20"
                                                      />
                                                )}
                                          </motion.button>
                                    </div>
                              </>
                        ) : (
                              <div className="text-center">
                                    <div className="mb-6 inline-flex p-4 bg-[#7C9082]/20 rounded-full text-[#7C9082]">
                                          <Send size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2D2D2D] mb-2 uppercase tracking-tighter">Link Ready</h3>
                                    <div
                                          onClick={copyToClipboard}
                                          className="w-full p-4 bg-[#FDFBF7] rounded-xl text-xs font-mono border border-black/5 text-[#2D2D2D] cursor-pointer flex items-center justify-between"
                                    >
                                          <span className="truncate mr-4">{shareLink}</span>
                                          <Clipboard size={14} className="text-[#7C9082]" />
                                    </div>
                              </div>
                        )}
                  </motion.div>

                  <AnimatePresence>
                        {isCopied && (
                              <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="fixed bottom-10 px-6 py-3 bg-[#2D2D2D] text-white rounded-full flex items-center gap-3 shadow-2xl z-50"
                              >
                                    <CheckCircle size={16} className="text-[#7C9082]" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Copied</span>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </div>
      );
}