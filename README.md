# React Chat App with Firebase & Gemini AI

A real-time developer chat room built with React, TypeScript, Vite, Tailwind CSS v4, Firebase Firestore/Auth, and Google Gemini AI integration.

## Features

- ⚡ **Vite + React 19 + TypeScript**: Modern, ultra-fast development and build pipeline.
- 🎨 **Tailwind CSS v4**: Beautiful dark developer-first theme with zero custom CSS clutter.
- 🔥 **Firebase Auth & Firestore**: Google Sign-In and real-time message sync across clients.
- 🤖 **Gemini AI Integration**:
  - Ask AI directly in the chat with `@bot`, `@gemini`, or `gemini:`.
  - Multiple model support (`gemini-3.8-flash`, `gemini-1.5-pro`, `gemini-1.5-flash`, etc.).
  - Markdown formatting support with code block syntax highlighting and copy button.
  - Interactive "Thinking" shimmer text animation (`ShineFx`).
  - Suggested prompts and in-app API key configuration modal.
- 🔔 **Audio Alerts**: Web Audio API chime synthesis on new incoming messages.

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/RaziUlH/chat-for-react.git
cd chat-for-react
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your Firebase and Gemini credentials:

```bash
cp .env.example .env
```

### 3. Run Dev Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```
