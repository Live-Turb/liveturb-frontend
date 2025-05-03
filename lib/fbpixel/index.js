// lib/fbpixel/index.js
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1089192597935409';

export const pageview = () => {
  window.fbq('track', 'PageView');
};

// Eventos específicos para o fluxo da LiveTurb
export const startTrial = () => {
  window.fbq('track', 'StartTrial');
};

export const initiateCheckout = (data = {}) => {
  window.fbq('track', 'InitiateCheckout', data);
};

export const completeRegistration = (data = {}) => {
  window.fbq('track', 'CompleteRegistration', data);
};

export const purchase = (data = {}) => {
  window.fbq('track', 'Purchase', data);
};

// Evento padrão para outros rastreamentos personalizados
export const event = (name, data = {}) => {
  window.fbq('track', name, data);
};
