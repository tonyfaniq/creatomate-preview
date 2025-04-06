import { Preview } from '@creatomate/preview';

const containerElement = document.getElementById('preview-container');
const preview = new Preview(containerElement, 'player', 'public-1jwfuxy434xre8m2q9nrt3iy');

// Create source using Creatomate classes
const source = {
    outputFormat: 'mp4',
    width: 1080,
    height: 1920,
    duration: 12,
    fillColor: '#ffffff',
    elements: [
        {
            type: 'shape',
            track: 1,
            time: 0,
            duration: 12.44,
            x: '49.3827%',
            y: '48.6979%',
            width: '111.1111%',
            height: '102.6042%',
            xAnchor: '50%',
            yAnchor: '50%',
            path: 'M 0 0 L 100 0 L 100 100 L 0 100 L 0 0 Z',
            fillColor: '#000000'
        },
        {
            name: 'Promo Image',
            type: 'image',
            track: 2,
            time: 0,
            duration: 12.44,
            y: '39.5158%',
            width: '92.9606%',
            height: '47.4573%',
            source: 'https://www.shutterstock.com/image-photo/same-man-different-style-clothes-260nw-357764558.jpg',
            fit: 'contain',
            dynamic: true
        },
        {
            type: 'text',
            track: 5,
            duration: 12.44,
            y: '68.4255%',
            width: '30.9829%',
            height: '4.2068%',
            xAlignment: '50%',
            text: 'Now Playing',
            fontFamily: 'DM Sans',
            fontWeight: '700',
            fontSizeMinimum: '4 vmin',
            fontSizeMaximum: '4 vmin',
            fillColor: '#0a9900',
            animations: [
                {
                    time: 0,
                    duration: 1,
                    easing: 'quadratic-out',
                    type: 'text-appear',
                    split: 'line'
                }
            ]
        },
        {
            name: 'Artist Name',
            type: 'text',
            track: 6,
            time: 0,
            duration: 12.67,
            x: '49.3827%',
            y: '76.9772%',
            width: '80.9829%',
            height: '4.2068%',
            xAlignment: '50%',
            text: 'Thomas Rhett',
            fontFamily: 'DM Sans',
            fontSizeMinimum: '5 vmin',
            fillColor: '#ffffff',
            dynamic: true,
            animations: [
                {
                    time: 0,
                    duration: 1,
                    easing: 'quadratic-out',
                    type: 'text-appear',
                    split: 'line'
                }
            ]
        },
        {
            name: 'Song Title',
            type: 'text',
            track: 7,
            time: 0,
            duration: 12.61,
            y: '72.054%',
            width: '80.9829%',
            height: '4.2068%',
            xAlignment: '50%',
            text: 'Die A Happy Man',
            fontFamily: 'DM Sans',
            fontWeight: '700',
            fontSizeMinimum: '5 vmin',
            fillColor: '#ffffff',
            dynamic: true,
            animations: [
                {
                    time: 0,
                    duration: 1,
                    easing: 'quadratic-out',
                    type: 'text-appear',
                    split: 'line'
                }
            ]
        },
        {
            name: 'Song File',
            type: 'audio',
            track: 8,
            source: 'https://samplelib.com/lib/preview/mp3/sample-12s.mp3',
            trimDuration: 10,
            dynamic: true
        }
    ]
};

// Make source available globally
window.currentConfig = source;

// Function to update preview from JSON editor
window.updateFromJSON = async function() {
    try {
        const jsonValue = window.editor.getValue();
        const newConfig = JSON.parse(jsonValue);
        currentConfig = newConfig;
        await preview.setSource(currentConfig);
        initializeForm();
        console.log('Preview updated from JSON successfully');
    } catch (error) {
        console.error('Error updating from JSON:', error);
        alert('Invalid JSON format');
    }
};

// Function to format JSON
window.formatJSON = function() {
    try {
        const jsonValue = window.editor.getValue();
        const parsed = JSON.parse(jsonValue);
        const formatted = JSON.stringify(parsed, null, 2);
        window.editor.setValue(formatted);
    } catch (error) {
        console.error('Error formatting JSON:', error);
        alert('Invalid JSON format');
    }
};

// Initialize form with current values
function initializeForm() {
    const form = document.getElementById('control-form');
    const promoImage = currentConfig.elements.find(el => el.name === "Promo Image");
    const artistName = currentConfig.elements.find(el => el.name === "Artist Name");
    const songTitle = currentConfig.elements.find(el => el.name === "Song Title");
    const nowPlaying = currentConfig.elements.find(el => el.text === "Now Playing");
    const songFile = currentConfig.elements.find(el => el.name === "Song File");

    document.getElementById('promo-image').value = promoImage?.source || '';
    document.getElementById('artist-name').value = artistName?.text || '';
    document.getElementById('song-title').value = songTitle?.text || '';
    document.getElementById('now-playing-color').value = nowPlaying?.fillColor || '#0a9900';
    document.getElementById('audio-url').value = songFile?.source || '';
}

// Handle form submission
document.getElementById('control-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Update configuration with form values
    const formData = new FormData(e.target);
    
    // Update elements in the configuration
    currentConfig.elements = currentConfig.elements.map(element => {
        if (element.name === "Promo Image") {
            return { ...element, source: formData.get('promo-image') };
        }
        if (element.name === "Artist Name") {
            return { ...element, text: formData.get('artist-name') };
        }
        if (element.name === "Song Title") {
            return { ...element, text: formData.get('song-title') };
        }
        if (element.text === "Now Playing") {
            return { ...element, fillColor: formData.get('now-playing-color') };
        }
        if (element.name === "Song File") {
            return { ...element, source: formData.get('audio-url') };
        }
        return element;
    });

    // Update the preview
    await preview.setSource(currentConfig);

    // Update the JSON editor with new config
    if (window.editor) {
        window.editor.setValue(JSON.stringify(currentConfig, null, 2));
    }
});

// Update color input hex display
document.getElementById('now-playing-color').addEventListener('input', (e) => {
    document.getElementById('now-playing-color-hex').textContent = e.target.value;
});

// Initialize preview and form when ready
preview.onReady = async () => {
    await preview.setSource(currentConfig);
    initializeForm();
};

// Add this function to handle rendering
async function renderVideo() {
    try {
        // Make API call to your backend endpoint
        const response = await fetch('/api/render', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentConfig)
        });
        
        const result = await response.json();
        console.log('Video rendered:', result);
    } catch (error) {
        console.error('Render error:', error);
    }
}

// Add a render button to your HTML
<button onclick="renderVideo()" class="secondary-button">Render Video</button>