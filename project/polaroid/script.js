document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const shutterBtn = document.getElementById('shutter-btn');
    const gallery = document.getElementById('gallery');
    
    // Create flash overlay
    const flashOverlay = document.createElement('div');
    flashOverlay.className = 'flash-overlay';
    document.body.appendChild(flashOverlay);

    // Camera constraints
    const constraints = {
        video: {
            width: { ideal: 720 },
            height: { ideal: 720 },
            facingMode: "user"
        }
    };

    // Initialize camera
    async function initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
        } catch (err) {
            console.error("Camera access error:", err);
            alert("无法访问摄像头，请确保允许摄像头权限。");
        }
    }

    // Take photo
    function takePhoto() {
        // Trigger flash animation
        flashOverlay.style.animation = 'none';
        flashOverlay.offsetHeight; /* trigger reflow */
        flashOverlay.style.animation = 'flashAnimation 0.5s ease-out';

        // Setup canvas
        const context = canvas.getContext('2d');
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;

        // Crop center square
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;

        // Draw video frame to canvas (mirrored)
        context.translate(size, 0);
        context.scale(-1, 1);
        context.drawImage(video, startX, startY, size, size, 0, 0, size, size);

        // Convert to image
        const imageUrl = canvas.toDataURL('image/png');
        createPolaroid(imageUrl);
    }

    // Create Polaroid element
    function createPolaroid(url) {
        const polaroid = document.createElement('div');
        polaroid.className = 'polaroid-photo';
        
        // Random rotation between -6 and 6 degrees
        const rotation = Math.random() * 12 - 6;
        polaroid.style.setProperty('--rotation', `${rotation}deg`);

        const content = document.createElement('div');
        content.className = 'photo-content';
        
        const img = document.createElement('img');
        img.src = url;
        
        const date = document.createElement('div');
        date.className = 'photo-date';
        date.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

        content.appendChild(img);
        polaroid.appendChild(content);
        polaroid.appendChild(date);
        
        // Prepend to gallery (newest first)
        gallery.insertBefore(polaroid, gallery.firstChild);
    }

    // Event listeners
    shutterBtn.addEventListener('click', takePhoto);
    
    // Start camera
    initCamera();
});
