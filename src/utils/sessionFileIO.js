export function triggerDownload(filename, jsonString) {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'positioning-session.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function pickJsonFile() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json,.json';
        input.style.position = 'fixed';
        input.style.top = '-1000px';
        input.style.left = '-1000px';

        const cleanup = () => {
            if (input && document.body.contains(input)) {
                document.body.removeChild(input);
            }
        };

        input.addEventListener('change', () => {
            if (!input.files || !input.files.length) {
                cleanup();
                reject(new Error('NO_FILE_SELECTED'));
                return;
            }

            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const json = JSON.parse(reader.result);
                    resolve({ json, fileName: file.name });
                } catch (error) {
                    reject(new Error('Selected file is not valid JSON.'));
                }
                cleanup();
            };
            reader.onerror = () => {
                cleanup();
                reject(new Error('Unable to read the selected file.'));
            };
            reader.readAsText(file);
        }, { once: true });

        document.body.appendChild(input);
        input.click();
    });
}
