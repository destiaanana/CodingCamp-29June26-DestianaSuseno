# 🌟 To-Do Life Dashboard — iOS Glassmorphism Style

A clean, ultra-modern, and highly interactive productivity dashboard built with a premium **iOS Glassmorphism** aesthetic, featuring a dynamic aurora mesh background and interactive card spotlight effects.

This project was developed by **@destiaanana** as part of the RevoU Coding Camp assignment.

## 🚀 Live Demo
🔗 [Explore My Dashboard](https://destiaanana.github.io/CodingCamp-29June26-DestianaSuseno/)

## ✨ Core Features (MVP + Premium Challenges)
- 🕒 **Real-Time Clock & Date:** Synchronized 1-second interval display with a beautiful typography shadow glows.
- 👋 **Dynamic Greetings with Custom Name:** Greets you based on the time of day. Includes a pencil icon toggle to dynamically update and save your name using `LocalStorage`.
- 🍅 **Focus Timer (Pomodoro):** Fully functional countdown timer with quick 15/25/50 mins preset pills and manual custom minutes input (1-120 mins).
- ⏰ **Synthesized Web Audio Alarm:** Features an advanced, built-in electronic chime synthesized directly via the browser's *Web Audio API* (zero external audio file latency).
- 🎴 **Immersive Completion Modal:** Triggers a heavy backdrop blurred full-screen alert overlay with shake-and-scale card animations when the session ends.
- ✅ **Advanced To-Do List:** 
  - Save, toggle completion, and delete tasks seamlessly with persistent `LocalStorage` backup.
  - ✏️ **Inline Task Editing:** Modify tasks directly within the list item with interactive Enter-to-Save or Escape-to-Cancel logic.
  - 🛡️ **Duplicate Guard:** Built-in case-insensitive validation to block duplicate task entries.
- 🔗 **Persistent Quick Links:** Add and manage custom shortcut chips with custom URLs that persist across page reloads.
- 🎆 **Interactive Mouse-Glow Effects:** Features a modern CSS radial-gradient spotlight overlay that dynamically tracks cursor coordinates across the cards via JS custom properties.
- 📱 **Fully Responsive:** Beautiful grid system tailored for desktops that flawlessly scales down to a single-column layout on mobile devices.

## 🛠️ Tech Stack
- **Structure:** Semantic HTML5
- **Styling:** CSS3 (Custom Glassmorphism, CSS Grid, Custom Properties, Blur Filters)
- **Logic:** Vanilla JavaScript (No frameworks, pure LocalStorage, Web Audio API)
- **AI Collaborator:** Developed inside the Kiro editor environment

## 📁 Project Structure
```text
├── css/
│   └── style.css      # Custom UI components & layout animations
├── js/
│   └── script.js       # Core dashboard mechanics & audio synthesizer
├── index.html          # Semantic HTML core structure
└── README.md           # Documentation
