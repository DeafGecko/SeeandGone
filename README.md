### SeeandGone

## Tactile UX Highlights
"Hold to Seal" Interaction: Rather than a standard click, users must physically hold the seal button for 1.5 seconds. This creates a "weighted" sense of security, using Framer Motion to visualize the encryption progress as the button fills with color.

Digital Smoke Dissolve: When a note is destroyed, the text doesn't simply disappear; it utilizes a high-performance blur and Y-axis offset to simulate the message evaporating upward like smoke.

Micro-Interactions: Features a custom "Typewriter" landing effect and glassmorphic UI components that react to user hovering and focus.

## Security Deep-Dive
Zero-Knowledge Architecture: The application is designed so that the server (Firebase) is "blind" to the data it hosts.

Client-Side Only: Encryption (AES-256) happens entirely in the browser before the data is transmitted.

The URL Hash Strategy: The decryption key is stored in the URL window.location.hash (the part after the #). Since browsers do not send hashes to servers, the key never touches the Firebase database or Vercel logs.

Burn-on-Read Logic: Security rules and frontend logic coordinate to trigger a deleteDoc command the moment a note is successfully decrypted, ensuring the vault is emptied immediately.

## Tech Stack
Frontend Library: React 18 with Vite for lightning-fast Hot Module Replacement (HMR).

Language: TypeScript to ensure type safety across the encryption and database interfaces.

Styling: Tailwind CSS v4, utilizing a modern minimalist "Coffee Mode" color palette.

Database & Backend: Firebase Firestore for real-time NoSQL data handling and secure backend-as-a-service.

Animations: Framer Motion for orchestrating complex, physics-based UI transitions.

## Haptic Branding
Mechanical Release Pulse: To bridge the gap between digital and physical, SeeandGone utilizes the Web Vibration API.

Custom Waveform: On mobile devices, the "Destroy" action triggers a specialized [10, 30, 100] vibration pattern—a light "click" followed by a heavy "thump"—to simulate the feeling of a physical seal breaking or a document being shredded.
