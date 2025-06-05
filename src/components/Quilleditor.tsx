import { useEffect, useRef, useState } from 'react';

export default function QuillEditor({
    value,
    onChange
}: {
    value: string;
    onChange: (val: string) => void;
}) {
    const quillRef = useRef<HTMLDivElement>(null);
    const quillInstance = useRef<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const initQuill = async () => {
            if (quillRef.current && !quillInstance.current) {
                const Quill = (await import('quill')).default;
                await import('quill/dist/quill.snow.css');

                quillInstance.current = new Quill(quillRef.current, {
                    theme: 'snow',
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline'],
                            [{ list: 'bullet' }],
                            ['clean']
                        ]
                    }
                });

                // Set initial content safely
                if (value) {
                    try {
                        // Ensure the value is treated as HTML content
                        const htmlContent = value.startsWith('<') ? value : `<p>${value}</p>`;
                        quillInstance.current.clipboard.dangerouslyPasteHTML(htmlContent);
                    } catch (error) {
                        console.error('Error setting initial content:', error);
                        quillInstance.current.clipboard.dangerouslyPasteHTML('<p></p>');
                    }
                }

                // On content change, pass HTML to parent
                quillInstance.current.on('text-change', () => {
                    const html = quillInstance.current.root.innerHTML;
                    if (html !== value) {
                        onChange(html);
                    }
                });
            }
        };

        initQuill();
    }, [isMounted, onChange, value]);

    // Sync external value changes into editor
    useEffect(() => {
        if (
            quillInstance.current &&
            quillInstance.current.root.innerHTML !== value
        ) {
            try {
                // Ensure the value is treated as HTML content
                const htmlContent = value.startsWith('<') ? value : `<p>${value}</p>`;
                quillInstance.current.clipboard.dangerouslyPasteHTML(htmlContent);
            } catch (error) {
                console.error('Error syncing content:', error);
            }
        }
    }, [value]);

    if (!isMounted) {
        return (
            <div
                className="border border-blue-100 rounded-lg border-2xl overflow-hidden"
                style={{ minHeight: '120px' }}
            />
        );
    }

    return (
        <div className="border border-blue-100 rounded-lg border-2xl overflow-hidden">
            <div
                ref={quillRef}
                style={{ minHeight: '120px', padding: '8px' }}
                className="text-gray-700 font-normal"
            />
        </div>
    );
}
