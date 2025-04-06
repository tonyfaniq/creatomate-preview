import { Source } from '@creatomate/preview';

// Basic composition similar to the tutorial example
export function getBasicComposition(): Source {
  return {
    output_format: 'mp4',
    width: 1280, // Adjusted for a more common preview size
    height: 720,
    elements: [
      {
        name: 'Background-Rect',
        type: 'rect',
        width: '100%',
        height: '100%',
        fill_color: '#f0f0f0',
      },
      {
        name: 'Main-Image',
        type: 'image',
        track: 1, // Ensure elements don't overlap time-wise initially if needed
        time: 0,
        duration: 5, // Give it a duration
        source: 'https://creatomate.com/files/assets/5bc5ed6f-26e6-4c3a-8d03-1b169dc7f983.jpg',
        // Simplified: No animations or color overlay for this basic example
      },
      {
        name: 'Title',
        type: 'text',
        track: 2,
        time: 0.5, // Start slightly after image appears
        duration: 4,
        x: '50%',
        y: '40%',
        width: '80%',
        text: 'Your Catchy Title',
        font_family: 'Poppins',
        font_weight: '700',
        font_size: 10, // Relative font size often works well
        text_alignment: 'center',
      },
      {
        name: 'Tagline',
        type: 'text',
        track: 2,
        time: 1, // Start after title
        duration: 3,
        x: '50%',
        y: '60%',
        width: '70%',
        text: 'Enter your tagline here',
        font_family: 'Oswald',
        font_weight: '400', // Adjusted weight
        font_size: 6,
        text_alignment: 'center',
      },
    ],
  };
} 