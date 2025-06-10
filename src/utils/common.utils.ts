/**
 * Converts HTML content to plain text by stripping HTML tags
 * @param htmlContent - The HTML string to convert
 * @returns The plain text version of the HTML content
 */
export const getPlainText = (htmlContent: string): string => {
    if (!htmlContent) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || '';
}; 