
# Kannect 💬

**Kannect** is a real-time multimedia chat application built with **Node.js** and **Socket.IO**, enabling instant messaging, voice notes, image and video sharing between users in a chat room environment.

---

## 🚀 Features

- ✅ **Real-time text messaging** with instant delivery
- 🎤 **Audio recording & sharing** — record and send voice messages
- 🖼️ **Image sharing** — send and view images in chat
- 🎥 **Video sharing** — share video clips with other users
- 👤 **Bold sender names** — clearly identify who sent each message
- 📢 **User join/leave notifications** — see when users connect or disconnect
- 🔔 **Sound alerts** — toggle notification sounds for incoming messages
- 💬 **WhatsApp-like UI** — clean message bubbles with timestamps
- 📱 **Responsive design** — works on desktop and mobile browsers

---

## 🛠️ Technologies Used

- **Backend:** Node.js, Express, Socket.IO
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Media:** MediaRecorder API (audio), FileReader API (images/videos)
- **Real-time:** WebSocket via Socket.IO with CORS enabled

---

## 📁 Project Structure

```
kannect-multimedia-chat/
│
├── nodeserver/
│   ├── server.js             # Node.js + Express + Socket.IO server
│   ├── package.json          # Server dependencies
│   └── package-lock.json
│
├── public/
│   ├── index.html            # Frontend chat interface
│   ├── script.js             # Client-side Socket.IO logic
│   ├── style.css             # Styling (WhatsApp-like bubbles)
│   ├── logo.png              # App logo
│   └── ting.mp3              # Notification sound
│
├── README.md                 # This file
├── package.json              # Root package config
└── .gitignore                # Git ignore rules
```

---

## 🚧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Hibare-Nisha/kannect-multimedia-chat.git
cd kannect-multimedia-chat
```

### 2. Install Server Dependencies

```bash
cd nodeserver
npm install
```

### 3. Start the Server

```bash
npm start
# or: node server.js
```

The server runs on **http://localhost:10000** (not 8000).

### 4. Open the App

Open your browser and navigate to:
```
http://localhost:10000
```

Enter your name when prompted, and start chatting!

**Tip:** Open multiple tabs/windows in the same browser (or different browsers) to test with multiple users.

## 💬 How to Use

### Send Text Messages
1. Type your message in the input field.
2. Press **Enter** or click the **Send** button.
3. Your message appears in the chat with your name in bold and a timestamp.

### Record & Send Audio
1. Click the **🎤 Record** button.
2. Speak into your microphone (allow access when prompted).
3. Click **Stop** when done.
4. Your audio bubble is sent instantly with your sender name and timestamp.

### Share Images
1. Click the **🖼️ Image** button.
2. Select an image file from your computer (max 5MB).
3. The image is sent as a resizable bubble in the chat.

### Share Videos
1. Click the **🎥 Video** button.
2. Select a video file (max 50MB).
3. A progress bar shows upload status.
4. The video plays inline in the chat with a player control.

### Toggle Sound Notifications
- Use the **🔊 Sound** toggle at the top to enable/disable alerts for incoming messages.

---

## 🔧 Technical Details

### Socket.IO Events

#### Client → Server
- **`new-user-joined`** — Emit when user joins (sends user name)
- **`send`** — Emit text message
- **`send-audio`** — Emit base64-encoded audio blob
- **`send-image`** — Emit base64-encoded image
- **`send-video`** — Emit base64-encoded video

#### Server → Clients
- **`user-joined`** — Broadcast when a new user joins
- **`receive`** — Broadcast incoming text messages
- **`receive-audio`** — Broadcast incoming audio
- **`receive-image`** — Broadcast incoming images
- **`receive-video`** — Broadcast incoming videos
- **`left`** — Broadcast when a user disconnects

### UI Features
- **WhatsApp-style bubbles:** Sent messages appear on the right (light blue), received on the left (light gray)
- **Sender names in bold:** Every message (text, audio, image, video) displays the sender's name prominently
- **Wide message bubbles:** Optimized for large screens (max-width 96%)
- **Responsive layout:** Adapts to mobile and tablet sizes
- **System messages:** Join/leave notifications appear centered and italicized

---

## 📝 Notes

- Media (audio, images, videos) are transmitted as **base64-encoded data URIs** over WebSocket. This works well for small files (~5-50MB).
- For production use with large media files, consider implementing:
  - Server-side file storage (AWS S3, Firebase, etc.)
  - File upload endpoints instead of base64 encoding
  - CDN for media delivery
- The app uses **Socket.IO broadcasting** to send messages to all clients except the sender (who appends locally).

---

## 📄 License

MIT License — Feel free to use, modify, and distribute this project.

---

## 👨‍💻 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

## 🙌 Acknowledgments

- **Socket.IO** for real-time communication
- **Express.js** for HTTP server
- **MediaRecorder API** for browser-based audio recording
- **HTML5 FileReader** for media encoding