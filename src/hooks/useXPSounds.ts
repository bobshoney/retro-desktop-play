import { useCallback, useRef } from 'react';

// Windows XP sound URLs (public domain recreations)
const SOUNDS = {
  startup: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
  error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2JkpONhXxybGVhX2FkaW50foWLjoyGfnVsZWBdXWFmbHV9hIqNjYqEfHRsZWBdXV9ka3N7goiMjYuHgHhwamRfXV1fY2pye4KIjI2MiIF5cWpkX11dX2NqcnqBh4yNjImCenJrZWBeXmBkanJ6gYeLjY2Kg3tyamVgXl5gZGpyeoGHi42NioR8c2plYF5eYGRqcnqBh4uNjYqEfHNqZWBeXmBkanJ6gYeLjY2KhHxzamVgXl5gZGpyeoGHi42NioR8c2plYF5eYGRqcnqBh4uNjYqEfHNqZWBeXmBkanJ6gYeLjY2KhHxzamVgXl5gZGpyeoGHi42NioR8c2plYF5eYGRqcnp/houNjYmDe3JqZGBeXmBkanJ6f4aLjY2Jg3tyamRgXl5gZGpyen+Gi42NiYN7cmpkYF5eYGRqcnp/houNjYmDe3JqZGBeXmBkanJ6f4aLjY2Jg3tyamRgXl5gZGpyen+Gi42NiYN7cmpkYF5eYGRqcnp/houNjYmDe3JqZGBeXmBkanJ6f4aLjY2Jg3tyamRgXl5gZGpyen+Gi42NiYN7cmpkYF5eYGRqcnp/houNjYmDe3JqZGBeXmBkanJ6',
  click: 'data:audio/wav;base64,UklGRhQDAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YfACAABkZGRkZGRjY2NjYmJiYmFhYWFgYGBgX19fX15eXl5dXV1dXFxcXFtbW1taWlpaWVlZWVhYWFhXV1dXVlZWVlVVVVVUVFRUU1NTU1JSUlJRUVFRUFBQUE9PT09OTk5OTU1NTUxMTExLS0tLSkpKSkpKSkpJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUpKSkpKSkpKS0tLS0xMTExNTU1NTk5OTk9PT09QUFBQUVFRUVJSU1NTU1RUVVVVVVZWVldXV1dYWFhYWVlZWVpaWltbW1tcXFxcXV1dXV5eXl5fX19fYGBgYGFhYWFiYmJiY2NjY2RkZGRlZWVlZmZmZmdnZ2doaGhoaWlpaWpqampra2trbGxsbG1tbW1ubm5ub29vb3BwcHBxcXFxcnJycnNzc3N0dHR0dXV1dXZ2dnZ3d3d3eHh4eHl5eXl6enp6e3t7e3x8fHx9fX19fn5+fn9/f3+AgICAgYGBgYKCgoKDg4ODhISEhIWFhYWGhoaGh4eHh4iIiIiJiYmJioqKiouLi4uMjIyMjY2NjY6Ojo6Pj4+PkJCQkJGRkZGSkpKSk5OTk5SUlJSVlZWVlpaWlpeXl5eYmJiYmZmZmZqampqbm5ubnJycnJ2dnZ2enp6en5+fn6CgoKChoaGhoqKioqOjo6OkpKSkpaWlpaampqanp6enqKioqKmpqamqqqqq',
  notify: 'data:audio/wav;base64,UklGRkQEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSAEAABqa2xsbGtqaWhnZmVjYmBfXVtZV1VTUVBOTEpIRkRDQUA+PDs5ODY1MzIxMC4tLCopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==',
};

export const useXPSounds = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((sound: keyof typeof SOUNDS) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(SOUNDS[sound]);
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // Ignore autoplay restrictions
      });
    } catch (e) {
      // Silently fail if audio isn't supported
    }
  }, []);

  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playError = useCallback(() => playSound('error'), [playSound]);
  const playNotify = useCallback(() => playSound('notify'), [playSound]);
  const playStartup = useCallback(() => playSound('startup'), [playSound]);

  return {
    playClick,
    playError,
    playNotify,
    playStartup,
    playSound,
  };
};
