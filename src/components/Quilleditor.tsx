import { useEffect, useRef, useState } from 'react';

export default function QuillEditor({
    value,
    onChange,
    className = ''
}: {
    value: string;
    onChange: (val: string) => void;
    className?: string;
}) {
    const quillRef = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<any>(null);

    useEffect(() => {
        const loadQuill = async () => {
            if (!quillRef.current) return;

            const Quill = (await import('quill')).default;
            await import('quill/dist/quill.snow.css');

            const quill = new Quill(quillRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ list: 'bullet' }]
                    ]
                }
            });

            // Set initial value
            if (value) {
                quill.root.innerHTML = value;
            }

            // Handle changes
            quill.on('text-change', () => {
                const html = quill.root.innerHTML;
                onChange(html);
            });

            setEditor(quill);
        };

        loadQuill();

        return () => {
            if (editor) {
                editor.off('text-change');
            }
        };
    }, []);

    // Update content when value prop changes
    useEffect(() => {
        if (editor && value !== editor.root.innerHTML) {
            editor.root.innerHTML = value;
        }
    }, [value, editor]);

    return (
        <div className={`border border-blue-100 rounded-lg overflow-hidden ${className}`}>
            <style jsx global>{`
                .ql-editor {
                    min-height: 120px;
                    max-height: 300px;
                    overflow-y: auto;
                    padding: 12px;
                    font-size: 16px;
                    line-height: 24px;
                    color: #374151;
                }
                .ql-toolbar {
                    border-bottom: 1px solid #E5E7EB;
                    background-color: #F9FAFB;
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    padding: 8px;
                }
                .ql-container {
                    border: none;
                }
            `}</style>
            <div ref={quillRef} />
        </div>
    );
}
