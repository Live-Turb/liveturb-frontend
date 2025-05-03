import React, { useEffect, useMemo, useCallback } from 'react';

interface WordDocumentViewerProps {
  url: string;
  height?: number;
}

export const WordDocumentViewer: React.FC<WordDocumentViewerProps> = React.memo(({ url, height = 600 }) => {
  // Função para validar se a URL é de um serviço permitido
  const isValidUrl = useCallback((url: string): boolean => {
    const allowedDomains = [
      'onedrive.live.com',
      '1drv.ms',
      'docs.google.com',
      'drive.google.com',
      'view.officeapps.live.com',
      'view.office.com',
      'prod-minio.ja6ipr.easypanel.host'
    ];
    
    try {
      const urlObj = new URL(url);
      const isValid = allowedDomains.some(domain => urlObj.hostname.includes(domain));
      console.log('URL Validation:', { url, isValid, hostname: urlObj.hostname });
      return isValid;
    } catch (error) {
      console.error('URL Validation Error:', error);
      return false;
    }
  }, []);

  // Função para converter URL para formato de visualização
  const getViewUrl = useCallback((url: string): string => {
    try {
      const urlObj = new URL(url);
      console.log('Processing URL:', { original: url, hostname: urlObj.hostname });
      
      // Se for URL do MinIO
      if (urlObj.hostname.includes('prod-minio.ja6ipr.easypanel.host')) {
        const viewUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
        console.log('MinIO URL converted:', viewUrl);
        return viewUrl;
      }
      
      // Se for URL do OneDrive
      if (urlObj.hostname.includes('1drv.ms') || urlObj.hostname.includes('onedrive.live.com')) {
        const viewUrl = url.replace(/\/edit$/, '/view');
        console.log('OneDrive URL converted:', viewUrl);
        return viewUrl;
      }
      
      // Se for URL do Google Drive
      if (urlObj.hostname.includes('drive.google.com')) {
        const viewUrl = url.replace(/\/edit$/, '/preview');
        console.log('Google Drive URL converted:', viewUrl);
        return viewUrl;
      }
      
      console.log('URL not converted, using original:', url);
      return url;
    } catch (error) {
      console.error('URL Processing Error:', error);
      return url;
    }
  }, []);

  useEffect(() => {
    console.log('WordDocumentViewer mounted with URL:', url);
  }, [url]);

  // Memoize a validação da URL
  const isUrlValid = useMemo(() => isValidUrl(url), [url, isValidUrl]);

  // Memoize a URL de visualização
  const viewUrl = useMemo(() => getViewUrl(url), [url, getViewUrl]);

  // Memoize o estilo do iframe
  const iframeStyle = useMemo(() => ({
    border: 'none',
    width: '100%',
    height: '100%',
    minHeight: '500px',
    maxHeight: '80vh',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    colorScheme: 'dark',
  }), []);

  if (!url) {
    console.log('No URL provided');
    return (
      <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
        <p className="text-zinc-400">Link do documento não disponível.</p>
        <p className="text-sm text-zinc-500 mt-2">
          Use links do OneDrive, Google Drive, Office Online ou MinIO.
        </p>
      </div>
    );
  }

  if (!isUrlValid) {
    console.log('Invalid URL:', url);
    return (
      <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
        <p className="text-zinc-400">Link do documento inválido.</p>
        <p className="text-sm text-zinc-500 mt-2">
          Use links do OneDrive, Google Drive, Office Online ou MinIO.
        </p>
      </div>
    );
  }

  console.log('Final view URL:', viewUrl);

  return (
    <div className="w-full bg-zinc-800/50 rounded-lg overflow-hidden">
      <iframe
        src={viewUrl}
        width="100%"
        height={height}
        className="border-0"
        title="Documento Word"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={iframeStyle}
      />
    </div>
  );
});

WordDocumentViewer.displayName = 'WordDocumentViewer'; 