import { useState, useEffect } from 'react';

export const useTypingEffect = (phrases: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) => {
    const [text, setText] = useState('');
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (isPaused) {
            timeout = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, pauseTime);
            return () => clearTimeout(timeout);
        }

        const currentPhrase = phrases[currentPhraseIndex];
        const speed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && text === currentPhrase) {
            setIsPaused(true);
            return;
        }

        if (isDeleting && text === '') {
            setIsDeleting(false);
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
            return;
        }

        timeout = setTimeout(() => {
            setText((prev) => {
                if (isDeleting) {
                    return prev.slice(0, -1);
                }
                return currentPhrase.slice(0, prev.length + 1);
            });
        }, speed);

        return () => clearTimeout(timeout);
    }, [text, currentPhraseIndex, isDeleting, isPaused, phrases, typingSpeed, deletingSpeed, pauseTime]);

    return text;
}; 