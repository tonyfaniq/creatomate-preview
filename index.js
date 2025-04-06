import { Preview } from '@creatomate/preview';

const containerElement = document.getElementById('preview-container');
const preview = new Preview(containerElement, 'player', 'public-1jwfuxy434xre8m2q9nrt3iy');

// Store the initial configuration
let currentConfig = {
    "output_format": "mp4",
    "width": 1080,
    "height": 1920,
    "duration": 12,
    "fill_color": "#ffffff",
    "elements": [
      {
        "id": "e460d3dc-274f-461f-a6c5-bda69bde9e71",
        "type": "shape",
        "track": 1,
        "time": 0,
        "duration": 12.44,
        "x": "49.3827%",
        "y": "48.6979%",
        "width": "111.1111%",
        "height": "102.6042%",
        "x_anchor": "50%",
        "y_anchor": "50%",
        "path": "M 0 0 L 100 0 L 100 100 L 0 100 L 0 0 Z",
        "fill_color": "#000000"
      },
      {
        "id": "9615bffc-4aaf-467d-85c8-730708e2dfa6",
        "name": "Promo Image",
        "type": "image",
        "track": 2,
        "time": 0,
        "duration": 12.44,
        "y": "39.5158%",
        "width": "92.9606%",
        "height": "47.4573%",
        "source": "https://www.shutterstock.com/image-photo/same-man-different-style-clothes-260nw-357764558.jpg",
        "fit": "contain",
        "dynamic": true
      },
      {
        "id": "c0e84979-3def-4565-9795-6555fd9a03d6",
        "type": "text",
        "track": 5,
        "duration": 12.44,
        "y": "68.4255%",
        "width": "30.9829%",
        "height": "4.2068%",
        "x_alignment": "50%",
        "text": "Now Playing",
        "font_family": "DM Sans",
        "font_weight": "700",
        "font_size_minimum": "4 vmin",
        "font_size_maximum": "4 vmin",
        "fill_color": "#0a9900",
        "animations": [
          {
            "time": 0,
            "duration": 1,
            "easing": "quadratic-out",
            "type": "text-appear",
            "split": "line"
          }
        ]
      },
      {
        "id": "70590c1f-a033-4784-b98d-15806dadc9e0",
        "name": "Artist Name",
        "type": "text",
        "track": 6,
        "time": 0,
        "duration": 12.67,
        "x": "49.3827%",
        "y": "76.9772%",
        "width": "80.9829%",
        "height": "4.2068%",
        "x_alignment": "50%",
        "text": "Thomas Rhett",
        "font_family": "DM Sans",
        "font_size_minimum": "5 vmin",
        "fill_color": "#ffffff",
        "dynamic": true,
        "animations": [
          {
            "time": 0,
            "duration": 1,
            "easing": "quadratic-out",
            "type": "text-appear",
            "split": "line"
          }
        ]
      },
      {
        "id": "ce33c932-b6e1-4ebb-a48f-56204b3e7537",
        "name": "Song Title",
        "type": "text",
        "track": 7,
        "time": 0,
        "duration": 12.61,
        "y": "72.054%",
        "width": "80.9829%",
        "height": "4.2068%",
        "x_alignment": "50%",
        "text": "Die A Happy Man",
        "font_family": "DM Sans",
        "font_weight": "700",
        "font_size_minimum": "5 vmin",
        "fill_color": "#ffffff",
        "dynamic": true,
        "animations": [
          {
            "time": 0,
            "duration": 1,
            "easing": "quadratic-out",
            "type": "text-appear",
            "split": "line"
          }
        ]
      },
      {
        "id": "9cf1b745-1753-45d5-856e-ca2773a035b8",
        "name": "Song File",
        "type": "audio",
        "track": 8,
        "source": "https://samplelib.com/lib/preview/mp3/sample-12s.mp3",
        "trim_duration": 10,
        "dynamic": true
      },
      {
        "id": "601054c8-6388-4f9c-b708-8c17f7f2b160",
        "type": "image",
        "track": 9,
        "time": 0,
        "duration": 12.353,
        "x": "49.3827%",
        "y": "86.9983%",
        "width": "81.9456%",
        "height": "12.6244%",
        "source": "39f0ebe0-45bc-4fae-8da4-4d8613cf5417",
        "animations": [
          {
            "time": 0,
            "duration": 1,
            "easing": "quadratic-out",
            "type": "fade"
          }
        ]
      },
      {
        "id": "a3ca0e5a-1863-40cf-af71-924ec82564b9",
        "type": "video",
        "track": 10,
        "time": 0,
        "duration": 12.61,
        "y": "7.6818%",
        "width": "26.7402%",
        "height": "14.1967%",
        "source": "7e4d5f52-4d60-4895-be0b-01f4fd804f43",
        "speed": "60%"
      }
    ]
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
    document.getElementById('now-playing-color').value = nowPlaying?.fill_color || '#0a9900';
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
            return { ...element, fill_color: formData.get('now-playing-color') };
        }
        if (element.name === "Song File") {
            return { ...element, source: formData.get('audio-url') };
        }
        return element;
    });

    // Update the preview
    await preview.setSource(currentConfig);
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