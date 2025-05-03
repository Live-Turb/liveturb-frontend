import { useEffect, useState } from 'react';

export const FB_PIXEL_ID = '1089192597935409';

export const pageview = () => {
  if (window.fbq) {
    window.fbq('track', 'PageView');
    console.log('Facebook Pixel: PageView');
  }
};

export const event = (name, options = {}) => {
  if (window.fbq) {
    window.fbq('track', name, options);
    console.log(`Facebook Pixel: ${name}`, options);
  }
};

// Eventos específicos
export const startTrial = (options = {}) => {
  event('StartTrial', options);
};

export const initiateCheckout = (options = {}) => {
  event('InitiateCheckout', options);
};

export const completeRegistration = (options = {}) => {
  event('CompleteRegistration', options);
};

export const purchase = (options = {}) => {
  event('Purchase', options);
};

// Hook para usar o Facebook Pixel
export const useFacebookPixel = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!window.fbq) {
      // Carrega o script do Facebook Pixel
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);

      window.fbq = function() {
        window.dataLayer = window.dataLayer || [];
        window._fbq.push(arguments);
      };
      window._fbq = window._fbq || [];
      window.fbq('init', FB_PIXEL_ID);
      window.fbq('track', 'PageView');
      
      setIsLoaded(true);
    } else {
      setIsLoaded(true);
    }

    return () => {
      // Nenhuma limpeza necessária
    };
  }, []);

  return {
    isLoaded,
    pageview,
    event,
    startTrial,
    initiateCheckout,
    completeRegistration,
    purchase
  };
};
