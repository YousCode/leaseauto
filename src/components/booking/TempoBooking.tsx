import { useEffect } from 'react';

interface TempoBookingProps {
  tenantId?: string;
  calendar?: string;
  locale?: string;
}

const TempoBooking = ({ 
  tenantId = "YOUR_TENANT_ID", 
  calendar = "default", 
  locale = "fr" 
}: TempoBookingProps) => {
  
  useEffect(() => {
    // Créer et charger le script Tempo
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://widget.tempohq.io/embed.js';
    
    script.onload = () => {
      if (window.Tempo && typeof window.Tempo.mount === 'function') {
        window.Tempo.mount('#tempo-booking', {
          tenant: tenantId,
          calendar: calendar,
          locale: locale
        });
      }
    };
    
    document.body.appendChild(script);
    
    // Cleanup
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [tenantId, calendar, locale]);

  return (
    <>
      {/* Styles globaux pour plein écran optimisé */}
      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          background-color: #fff !important;
        }
        
        #root {
          width: 100% !important;
          height: 100% !important;
        }
        
        #tempo-booking {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          background: #fff !important;
          overflow: hidden !important;
          z-index: 10 !important;
        }
        
        #tempo-booking iframe {
          width: 100vw !important;
          height: 100vh !important;
          border: none !important;
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
      
      {/* Container principal Tempo */}
      <div 
        id="tempo-booking" 
        data-tenant={tenantId} 
        data-calendar={calendar}
      >
        {/* Loading spinner pendant le chargement */}
        <div className="flex items-center justify-center w-full h-full bg-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>

      {/* Fallback iframe si JavaScript est désactivé */}
      <noscript>
        <iframe
          src={`https://app.tempohq.io/booking?tenant=${tenantId}&calendar=${calendar}&lang=${locale}`}
          style={{
            width: '100vw',
            height: '100vh',
            border: '0',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '10',
            display: 'block'
          }}
          loading="lazy"
          allowFullScreen
          title="Réservation Tempo"
        />
      </noscript>
    </>
  );
};

// Déclaration TypeScript pour window.Tempo
declare global {
  interface Window {
    Tempo: {
      mount: (selector: string, options: {
        tenant: string;
        calendar: string;
        locale: string;
      }) => void;
    };
  }
}

export default TempoBooking;