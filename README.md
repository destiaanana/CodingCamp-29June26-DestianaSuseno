# 🌟 To-Do Life Dashboard — iOS Glassmorphism Style

A clean, ultra-modern, and highly interactive productivity dashboard built with a premium **iOS Glassmorphism** aesthetic, featuring a dynamic aurora mesh background and interactive card spotlight effects.

This project was developed by **@destiaanana** as part of the Coding Camp final assignment.

## 🚀 Live Demo
🔗 [Explore My Dashboard](www)

## ✨ Core Features (MVP + Premium Challenges)
- 🕒 **Real-Time Clock & Date:** Synchronized 1-second interval display with a beautiful typography shadow glows[cite: 1, 2].
- 👋 **Dynamic Greetings with Custom Name:** Greets you based on the time of day[cite: 2]. Includes a pencil icon toggle to dynamically update and save your name using `LocalStorage`[cite: 2, 3].
- 🍅 **Focus Timer (Pomodoro):** Fully functional countdown timer with quick 15/25/50 mins preset pills and manual custom minutes input (1-120 mins)[cite: 2, 3].
- ⏰ **Synthesized Web Audio Alarm:** Features an advanced, built-in electronic chime synthesized directly via the browser's *Web Audio API* (zero external audio file latency)[cite: 2].
- 🎴 **Immersive Completion Modal:** Triggers a heavy backdrop blurred full-screen alert overlay with shake-and-scale card animations when the session ends[cite: 1, 3].
- ✅ **Advanced To-Do List:** 
  - Save, toggle completion, and delete tasks seamlessly with persistent `LocalStorage` backup[cite: 2].
  - ✏️ **Inline Task Editing:** Modify tasks directly within the list item with interactive Enter-to-Save or Escape-to-Cancel logic[cite: 2].
  - 🛡️ **Duplicate Guard:** Built-in case-insensitive validation to block duplicate task entries[cite: 2].
- 🔗 **Persistent Quick Links:** Add and manage custom shortcut chips with custom URLs that persist across page reloads[cite: 2, 3].
- 🎆 **Interactive Mouse-Glow Effects:** Features a modern CSS radial-gradient spotlight overlay that dynamically tracks cursor coordinates across the cards via JS custom properties[cite: 1, 2].
- 📱 **Fully Responsive:** Beautiful grid system tailored for desktops that flawlessly scales down to a single-column layout on mobile devices[cite: 1].

## 🛠️ Tech Stack
- **Structure:** Semantic HTML5[cite: 3]
- **Styling:** CSS3 (Custom Glassmorphism, CSS Grid, Custom Properties, Blur Filters)[cite: 1]
- **Logic:** Vanilla JavaScript (No frameworks, pure LocalStorage, Web Audio API)[cite: 2]
- **AI Collaborator:** Developed inside the Kiro editor environment

## 📁 Project Structure
```text
├── css/
│   └── style.css      # Custom UI components & layout animations
├── js/
│   └── script.js       # Core dashboard mechanics & audio synthesizer
├── index.html          # Semantic HTML core structure
└── README.md           # Documentation