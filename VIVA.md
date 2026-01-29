# 🎓 Viva & Interview Questions

## Common Questions & Answers

### 1. How does the Distraction Detection work?
**Answer**: We use a computer vision library called `face-api.js`. It loads a pre-trained Deep Learning model (Tiny Face Detector) into the browser. It analyzes the webcam video frame-by-frame (every 500ms) to check if a human face is present. If no face is found (confidence score too low), we assume the user has looked away or left, marking it as a "Distraction".

### 2. What is the "Motivation Layer"?
**Answer**: It is a newly added module that uses **Gamification Psychology** to improve user retention. Instead of just punishing distractions (negative reinforcement), we reward focus (positive reinforcement) with points and streaks. This creates a "Compulsion Loop" similar to apps like Duolingo.

### 3. How did you implement the "Glassmorphism" UI?
**Answer**: I used CSS properties like `backdrop-filter: blur(16px)` and semi-transparent backgrounds (`rgba(...)`) to create the frosted glass effect. This is a modern design trend that gives a premium feel.

### 4. How are the rewards stored?
**Answer**: To keep the system modular, I used a **Separate JSON Store** (`rewards.json`) on the backend. This ensures that session data (productivity logs) and gamification data (points/streaks) are loosely coupled, meaning we can modify one without breaking the other.

### 5. Why use a Custom Hook (`useGamification`)?
**Answer**: In React, custom hooks allow us to separate **Business Logic** from **UI Logic**. 
- `FocusCoach.jsx` handles Camera/AI logic.
- `useGamification.js` handles Math/Points logic.
- `App.jsx` just connects them.
This makes the code cleaner and easier to test.

### 6. What is the Architecture pattern used?
**Answer**: This is a **Client-Server Architecture** (specifically a RESTful architecture). 
- The **Client** (React) handles user interaction and AI processing.
- The **Server** (Node) handles data storage.
- They communicate via HTTP methods (GET/POST).

### 7. What are the limitations of this system?
**Answer**:
- **Face Visibility**: It only detects if a face is *present*. If you look at the phone while holding it in front of your face, it might still think you are focused.
- **Lighting**: Poor lighting can cause false "Distracted" alerts.
- **Single User**: It doesn't identify *who* is focused, just that *someone* is there.
