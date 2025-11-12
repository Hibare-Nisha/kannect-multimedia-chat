// JS file 
const socket = io('http://localhost:10000');

const form = document.getElementById('send-container');
const messageinput = document.getElementById('messageInp')
const messagecontainer = document.querySelector(".container")
const audioToggle = document.getElementById('audioToggle');
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const recordingStatus = document.getElementById('recordingStatus');
const imageBtn = document.getElementById('imageBtn');
const videoBtn = document.getElementById('videoBtn');
const imageInput = document.getElementById('imageInput');
const videoInput = document.getElementById('videoInput');
const uploadingStatus = document.getElementById('uploadingStatus');
const uploadProgress = document.getElementById('uploadProgress');

var audio = new Audio('/ting.mp3');
let audioEnabled = true;

// Audio recording variables
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

// Max file sizes (in bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

// Audio toggle functionality
audioToggle.addEventListener('change', (e) => {
    audioEnabled = e.target.checked;
    const label = e.target.parentElement.querySelector('span');
    label.textContent = audioEnabled ? '🔊 Sound' : '🔇 Sound Off';
    console.log('Audio ' + (audioEnabled ? 'enabled' : 'disabled'));
});

// Append a plain text message with a sender name (shows sender in bold)
const appendTextMessage = (messageText, senderName, position) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message', position);

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const sender = document.createElement('div');
    sender.classList.add('sender');
    sender.innerText = senderName;

    const text = document.createElement('p');
    text.classList.add('text');
    text.innerText = messageText;

    const meta = document.createElement('div');
    meta.classList.add('meta');
    const time = document.createElement('small');
    time.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    meta.appendChild(time);

    bubble.appendChild(sender);
    bubble.appendChild(text);
    bubble.appendChild(meta);
    wrapper.appendChild(bubble);
    messagecontainer.appendChild(wrapper);
    messagecontainer.scrollTop = messagecontainer.scrollHeight;

    if(position == 'left' && audioEnabled){
        audio.play();
    }
}

// Append a small system message (e.g., "X joined the chat", "Y left")
const appendSystemMessage = (messageText) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message', 'system-message');

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.classList.add('system');

    const text = document.createElement('p');
    text.classList.add('text');
    text.innerText = messageText;
    text.style.textAlign = 'center';
    text.style.fontStyle = 'italic';
    text.style.fontSize = '13px';
    text.style.margin = '6px 0';

    bubble.appendChild(text);
    wrapper.appendChild(bubble);
    messagecontainer.appendChild(wrapper);
    messagecontainer.scrollTop = messagecontainer.scrollHeight;
}

// Function to append audio message
const appendAudioMessage = (audioDataUrl, senderName, position) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message', position);

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const sender = document.createElement('div');
    sender.classList.add('sender');
    sender.innerText = position === 'right' ? 'You (Voice)' : `${senderName} (Voice)`;

    const audioPlayer = document.createElement('audio');
    audioPlayer.controls = true;
    audioPlayer.src = audioDataUrl;
    // make control compact; width will be controlled by CSS for audio-bubble
    audioPlayer.style.width = '180px';

    const meta = document.createElement('div');
    meta.classList.add('meta');
    const time = document.createElement('small');
    time.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    meta.appendChild(time);

    // For audio bubbles, layout inline: sender | audio player | timestamp
    bubble.appendChild(sender);
    bubble.appendChild(audioPlayer);
    bubble.appendChild(meta);
    wrapper.appendChild(bubble);
    messagecontainer.appendChild(wrapper);
    messagecontainer.scrollTop = messagecontainer.scrollHeight;

    if(position == 'left' && audioEnabled){
        audio.play();
    }
}

// Function to append image message
const appendImageMessage = (imageDataUrl, senderName, position) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message', position);
    wrapper.classList.add('media-message');

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const sender = document.createElement('div');
    sender.classList.add('sender');
    sender.innerText = position === 'right' ? 'You sent 🖼️ Image' : `${senderName} sent 🖼️ Image`;

    const img = document.createElement('img');
    img.src = imageDataUrl;
    img.alt = 'Shared image';
    img.onclick = () => { window.open(imageDataUrl, '_blank'); };

    const meta = document.createElement('div');
    meta.classList.add('meta');
    const time = document.createElement('small');
    time.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    meta.appendChild(time);

    bubble.appendChild(sender);
    bubble.appendChild(img);
    bubble.appendChild(meta);
    wrapper.appendChild(bubble);
    messagecontainer.appendChild(wrapper);
    messagecontainer.scrollTop = messagecontainer.scrollHeight;

    if(position == 'left' && audioEnabled) audio.play();
}

// Function to append video message
const appendVideoMessage = (videoDataUrl, senderName, position) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message', position);
    wrapper.classList.add('media-message');

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const sender = document.createElement('div');
    sender.classList.add('sender');
    sender.innerText = position === 'right' ? 'You sent 🎥 Video' : `${senderName} sent 🎥 Video`;

    const video = document.createElement('video');
    video.src = videoDataUrl;
    video.controls = true;
    video.style.width = '100%';

    const meta = document.createElement('div');
    meta.classList.add('meta');
    const time = document.createElement('small');
    time.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    meta.appendChild(time);

    bubble.appendChild(sender);
    bubble.appendChild(video);
    bubble.appendChild(meta);
    wrapper.appendChild(bubble);
    messagecontainer.appendChild(wrapper);
    messagecontainer.scrollTop = messagecontainer.scrollHeight;

    if(position == 'left' && audioEnabled) audio.play();
}

// Handle image upload
imageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    imageInput.click();
});

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
        if(file.size > MAX_IMAGE_SIZE) {
            alert('Image size exceeds 5MB limit!');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageDataUrl = event.target.result;
            appendImageMessage(imageDataUrl, name, 'right');
            socket.emit('send-image', imageDataUrl);
            imageInput.value = '';
        };
        reader.readAsDataURL(file);
    }
});

// Handle video upload
videoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    videoInput.click();
});

videoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
        if(file.size > MAX_VIDEO_SIZE) {
            alert('Video size exceeds 50MB limit!');
            return;
        }
        
        uploadingStatus.style.display = 'flex';
        const reader = new FileReader();
        
        reader.onprogress = (event) => {
            if(event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                uploadProgress.value = percentComplete;
            }
        };
        
        reader.onload = (event) => {
            const videoDataUrl = event.target.result;
            appendVideoMessage(videoDataUrl, name, 'right');
            socket.emit('send-video', videoDataUrl);
            uploadingStatus.style.display = 'none';
            uploadProgress.value = 0;
            videoInput.value = '';
        };
        
        reader.readAsDataURL(file);
    }
});

// Start recording
recordBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if(!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioDataUrl = URL.createObjectURL(audioBlob);
                
                // Convert to base64 for socket transmission
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Audio = reader.result;
                    appendAudioMessage(audioDataUrl, name, 'right');
                    socket.emit('send-audio', base64Audio);
                    messageinput.value = '';
                };
                reader.readAsDataURL(audioBlob);
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            isRecording = true;
            recordBtn.style.display = 'none';
            recordingStatus.style.display = 'flex';
            
        } catch(err) {
            console.error('Error accessing microphone:', err);
            alert('Microphone access denied! Please allow microphone access to record audio.');
        }
    }
});

// Stop recording
stopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if(isRecording && mediaRecorder) {
        mediaRecorder.stop();
        isRecording = false;
        recordBtn.style.display = 'inline-block';
        recordingStatus.style.display = 'none';
    }
});

// Send text message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageinput.value;
    if(message.trim()) {
        appendTextMessage(message, name, 'right');
        socket.emit('send', message);
        messageinput.value = '';
    }
})
  
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name)

socket.on('user-joined', name => {
    appendSystemMessage(`${name} joined the chat`);
})

socket.on('left', name => {
    appendSystemMessage(`${name} left the chat`);
})

socket.on('receive', data=>{
    appendTextMessage(data.message, data.name, 'left');
})
socket.on('receive-audio', data => {
    console.log('📻 Received audio from:', data.name);
    appendAudioMessage(data.audioData, data.name, 'left');
})

socket.on('receive-image', data => {
    console.log('🖼️ Received image from:', data.name);
    appendImageMessage(data.imageData, data.name, 'left');
})

socket.on('receive-video', data => {
    console.log('🎥 Received video from:', data.name);
    appendVideoMessage(data.videoData, data.name, 'left');
})
