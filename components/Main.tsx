import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Preview, Source, State } from '@creatomate/preview';
// Optional: Import the basic composition if not using a template
// import { getBasicComposition } from '../utility/getBasicComposition';
import styles from '../styles/Main.module.css'; // We'll create this next

export const MainEditor: React.FC = () => {
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<Preview | undefined>(undefined);

  const [isSdkLoading, setIsSdkLoading] = useState(true); // SDK library loading
  const [isContentLoading, setIsContentLoading] = useState(true); // Template/Source loading/buffering
  const [isReady, setIsReady] = useState(false); // SDK ready to accept commands
  const [currentState, setCurrentState] = useState<State | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number>(16 / 9); // Default aspect ratio
  const [titleText, setTitleText] = useState<string>(''); // Input field state
  const [renderStatus, setRenderStatus] = useState<string>(''); // To show render progress/result

  // --- SDK Initialization ---
  const setupPreview = useCallback((htmlElement: HTMLDivElement) => {
    // Clean up previous instance
    if (previewRef.current) {
      previewRef.current.dispose();
      previewRef.current = undefined;
    }

    setIsSdkLoading(true);
    setIsContentLoading(true);
    setIsReady(false);
    setRenderStatus('');

    const publicToken = process.env.NEXT_PUBLIC_CREATOMATE_PUBLIC_TOKEN;
    if (!publicToken) {
      console.error('Error: NEXT_PUBLIC_CREATOMATE_PUBLIC_TOKEN is not set in .env.local');
      setRenderStatus('Error: Missing Public Token configuration.');
      setIsSdkLoading(false);
      setIsContentLoading(false);
      return;
    }

    // Initialize the Preview SDK
    const preview = new Preview(htmlElement, 'player', publicToken);
    previewRef.current = preview;

    preview.onReady = async () => {
      console.log('Preview SDK Ready');
      setIsSdkLoading(false);
      setIsReady(true);

      try {
        const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID;
        if (templateId) {
          console.log(`Loading template: ${templateId}`);
          await preview.loadTemplate(templateId);
        } else {
          console.log('Loading basic composition from source');
          // Uncomment the next line and comment out the loadTemplate line above
          // if you want to use the getBasicComposition utility function
          // await preview.setSource(getBasicComposition());
          setRenderStatus('Warning: No Template ID set, using default source (if configured).');
          // Or throw an error if a template is required:
          // throw new Error("NEXT_PUBLIC_TEMPLATE_ID is not set.");
        }
        console.log('Initial source loaded');
      } catch (error) {
        console.error('Error loading initial source:', error);
        setRenderStatus(`Error loading source: ${error instanceof Error ? error.message : String(error)}`);
        setIsContentLoading(false);
      }
    };

    preview.onLoad = () => {
      console.log('Preview loading content...');
      setIsContentLoading(true);
    };

    preview.onLoadComplete = () => {
      console.log('Preview content loaded.');
      setIsContentLoading(false);
    };

    preview.onError = (error) => {
      console.error('Preview SDK Error:', error.message);
      setRenderStatus(`SDK Error: ${error.message}`);
      setIsSdkLoading(false);
      setIsContentLoading(false);
      setIsReady(false);
    };

    preview.onStateChange = (state) => {
      console.log('Preview state changed');
      setCurrentState(state);
      if (state.width && state.height) {
        setVideoAspectRatio(state.width / state.height);
      }
      // Update input field if Title element exists
      const titleElement = preview.findElement(el => el.source.name === 'Title');
      if (titleElement) {
        setTitleText(titleElement.source.text ?? '');
      }
    };

    // Add other event listeners if needed (onTimeChange, etc.)

  }, []); // Empty dependency array ensures this runs once like componentDidMount

  // --- Effect for Initial Setup ---
  useEffect(() => {
    if (previewContainerRef.current) {
      setupPreview(previewContainerRef.current);
    }

    // Cleanup function
    return () => {
      previewRef.current?.dispose();
      previewRef.current = undefined;
      console.log('Preview disposed');
    };
  }, [setupPreview]); // Rerun setup if the setup function identity changes (it shouldn't here)

  // --- Control Handlers ---
  const handlePlay = async () => {
    if (!isReady) return;
    try {
      await previewRef.current?.play();
    } catch (error) {
      console.error('Error playing:', error);
    }
  };

  const handlePause = async () => {
    if (!isReady) return;
    try {
      await previewRef.current?.pause();
    } catch (error) {
      console.error('Error pausing:', error);
    }
  };

  const handleUndo = async () => {
    if (!isReady) return;
    try {
      await previewRef.current?.undo();
    } catch (error) {
      console.error('Error undoing:', error);
    }
  };

  const handleRedo = async () => {
    if (!isReady) return;
    try {
      await previewRef.current?.redo();
    } catch (error) {
      console.error('Error redoing:', error);
    }
  };

  const handleTitleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setTitleText(newText); // Update local state immediately for responsiveness
    if (!isReady) return;
    try {
      // Apply modification to the element named 'Title'
      await previewRef.current?.setModifications({
        Title: newText,
      });
    } catch (error) {
      console.error('Error setting title modification:', error);
    }
  };

  const handleRender = async () => {
    if (!isReady || !previewRef.current) {
      setRenderStatus('Editor not ready.');
      return;
    }

    setRenderStatus('Requesting render...');
    setIsContentLoading(true); // Show loading indicator during render request

    try {
      const source = previewRef.current.getSource();

      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source }), // Send the current source to the backend
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Render request failed: ${response.status} ${errorText || response.statusText}`);
      }

      const result = await response.json();
      console.log('Render result:', result);

      if (result.url) {
        setRenderStatus(`Render started! Video URL (when ready): ${result.url}`);
        // Optionally, you could start polling the status URL provided in the result
        // or use webhooks for a more robust solution.
      } else {
         setRenderStatus(`Render submitted (ID: ${result.id}). Check Creatomate dashboard for status.`);
      }

    } catch (error) {
      console.error('Error rendering video:', error);
      setRenderStatus(`Render Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsContentLoading(false); // Hide loading indicator
    }
  };

  // --- Dynamic Styling for Aspect Ratio ---
  const previewStyle = {
    // Maintain aspect ratio using padding-top trick
    paddingTop: `${(1 / videoAspectRatio) * 100}%`,
  };

  return (
    <div className={styles.editorContainer}>
      <h1>Creatomate Video Editor</h1>

      <div className={styles.previewWrapper}>
        <div className={styles.previewSizer} style={previewStyle}>
          <div ref={previewContainerRef} className={styles.previewEmbed}>
            {/* The Preview SDK will attach here */}
            {(isSdkLoading || isContentLoading) && (
              <div className={styles.loadingOverlay}>
                Loading {isSdkLoading ? 'Editor...' : 'Video...'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <h2>Controls</h2>
        <div className={styles.controlGroup}>
          <label htmlFor="titleInput">Title Text:</label>
          <input
            id="titleInput"
            type="text"
            placeholder="Enter title..."
            value={titleText}
            onChange={handleTitleChange}
            disabled={!isReady || isContentLoading}
          />
        </div>

        <div className={styles.controlGroup}>
          <button onClick={handlePlay} disabled={!isReady || isContentLoading}>Play</button>
          <button onClick={handlePause} disabled={!isReady || isContentLoading}>Pause</button>
          <button onClick={handleUndo} disabled={!isReady || isContentLoading || !currentState?.canUndo}>Undo</button>
          <button onClick={handleRedo} disabled={!isReady || isContentLoading || !currentState?.canRedo}>Redo</button>
        </div>

        <div className={styles.controlGroup}>
           <button onClick={handleRender} disabled={!isReady || isContentLoading}>
             Render Final Video (MP4)
           </button>
        </div>
         {renderStatus && <p className={styles.statusMessage}>{renderStatus}</p>}
      </div>
    </div>
  );
}; 