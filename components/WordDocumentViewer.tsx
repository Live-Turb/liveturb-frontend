import React from 'react';

interface WordDocumentViewerProps {
    url: string;
    title?: string;
}

const WordDocumentViewer: React.FC<WordDocumentViewerProps> = ({ url, title }) => {
    // Converte URLs do OneDrive para o formato do Office Online Viewer
    const getViewerUrl = (documentUrl: string) => {
        if (documentUrl.includes('1drv.ms') || documentUrl.includes('onedrive.live.com')) {
            // Remove parâmetros de query e adiciona parâmetros do viewer
            const baseUrl = documentUrl.split('?')[0];
            return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(baseUrl)}`;
        }
        return documentUrl;
    };

    return (
        <div className="word-document-viewer">
            <iframe
                src={getViewerUrl(url)}
                width="100%"
                height="600"
                frameBorder="0"
                title={title || 'Documento Word'}
                allowFullScreen
            />
        </div>
    );
};

export default WordDocumentViewer; 