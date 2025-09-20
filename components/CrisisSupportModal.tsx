import React, { useEffect, useRef } from 'react';

interface CrisisSupportModalProps {
  onClose: () => void;
}

const CrisisSupportModal: React.FC<CrisisSupportModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Effect for focus management and trapping
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Focus the close button on open
    setTimeout(() => closeButtonRef.current?.focus(), 100);

    const focusableElements = Array.from(
      modalElement.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      )
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      
      if (event.key !== 'Tab') return;

      if (event.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-title"
      aria-describedby="crisis-description"
    >
      <div className="fixed inset-0 animate-gentle-gradient" onClick={onClose} aria-hidden="true" />
      
      <div
        ref={modalRef}
        className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 text-center transform animate-fade-in-up"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
          aria-label="Close crisis support"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-5xl mb-4" role="img" aria-label="Heart with lifeline">❤️‍🩹</div>

        <h2 id="crisis-title" className="text-2xl font-bold text-gray-800 mb-2">You're Not Alone</h2>
        <p id="crisis-description" className="text-gray-600 mb-8">
            It's brave to reach out. If you're going through immense pain, please contact one of these India-based helplines immediately.
        </p>

        <div className="space-y-4">
          <a
            href="tel:18602662345"
            className="w-full block bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <div className="flex justify-between items-center">
                <span>Vandrevala Foundation</span>
                <span>📞 Call</span>
            </div>
            <div className="text-sm font-normal text-white/80 text-left mt-1">1860 266 2345</div>
          </a>
          <a
            href="tel:9820466726"
            className="w-full block bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <div className="flex justify-between items-center">
                <span>AASRA Helpline</span>
                <span>📞 Call</span>
            </div>
            <div className="text-sm font-normal text-gray-600 text-left mt-1">9820466726</div>
          </a>
          <a
            href="tel:02227726771"
            className="w-full block bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <div className="flex justify-between items-center">
                <span>Snehi Helpline</span>
                <span>📞 Call</span>
            </div>
            <div className="text-sm font-normal text-gray-600 text-left mt-1">022-27726771 / 27726772</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupportModal;