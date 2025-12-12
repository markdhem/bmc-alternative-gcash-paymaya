/**
 * GCash/PayMaya Payment Plugin (Plugin Name: GCPayTipJar)
 * * This plugin creates a fixed, "bubble" style button in the bottom-right
 * * corner of the screen, which opens a modal for QR code payments.
 */
const GCPayPlugin = (function() {

    // Default configuration (can be overwritten by init)
    let config = {
        buttonText: 'Buy Me a Coffee',
        qrCodeImage: 'default_qr_code.png', // Placeholder
        title: 'Support the Creator',
        message: 'Scan the QR code to send your support!',
        accountName: 'Account Name Here',
        buttonColor: '#1D4ED8', // Primary blue
        buttonHoverColor: '#1E40AF',
        bubblePosition: 'bottom-right' // Can be 'bottom-left'
    };

    /**
     * Injects the required CSS styles directly into the document head,
     * including styles for the fixed bubble button.
     */
    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* --- BUBBLE BUTTON STYLING (Fixed Position) --- */
            .gcpay-bubble-container {
                position: fixed;
                padding: 10px;
                z-index: 9998; /* Below the modal backdrop */
            }

            /* Positioning based on config */
            .gcpay-bubble-container.bottom-right {
                bottom: 20px;
                right: 20px;
            }
            .gcpay-bubble-container.bottom-left {
                bottom: 20px;
                left: 20px;
            }

            /* Main Button Styling */
            .gcpay-main-button {
                padding: 12px 20px;
                color: #fff;
                border: none;
                border-radius: 9999px; /* Pill shape */
                cursor: pointer;
                font-size: 1em;
                font-weight: bold;
                transition: background-color 0.2s, transform 0.1s;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
                background-color: ${config.buttonColor};
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .gcpay-main-button:hover {
                background-color: ${config.buttonHoverColor};
                transform: translateY(-2px);
            }
            
            /* Icon Styling (Coffee Icon Placeholder) */
            .gcpay-main-button::before {
                content: '☕'; /* Unicode coffee emoji */
                font-size: 1.2em;
                line-height: 1;
            }


            /* --- MODAL STYLING (Full Screen Backdrop) --- */
            .gcpay-modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s, visibility 0.3s;
            }
            .gcpay-modal-backdrop.open {
                opacity: 1;
                visibility: visible;
            }

            /* Modal Content Card */
            .gcpay-modal-content {
                background: #fff;
                padding: 30px;
                border-radius: 8px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
                text-align: center;
                position: relative;
                transform: scale(0.9);
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Spring effect */
            }
            .gcpay-modal-backdrop.open .gcpay-modal-content {
                transform: scale(1);
            }

            /* Content Typography and Layout */
            .gcpay-modal-content h3 {
                color: #333;
                margin-top: 0;
                font-size: 1.6em;
                font-weight: 700;
                border-bottom: 2px solid #eee;
                padding-bottom: 10px;
            }
            .gcpay-message {
                color: #666;
                margin-bottom: 15px;
            }
            .gcpay-account-name {
                font-weight: 700;
                color: ${config.buttonColor};
                margin-top: 15px;
                display: block;
                font-size: 1.1em;
            }

            /* QR Code Image */
            .gcpay-qr-wrapper {
                margin: 20px auto 10px;
                width: 200px;
                height: 200px;
            }
            .gcpay-qr-wrapper img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border: 4px solid #f0f0f0;
                border-radius: 4px;
            }

            /* Close Button */
            .gcpay-close-btn {
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                font-size: 2em;
                cursor: pointer;
                color: #aaa;
                line-height: 1;
                transition: color 0.1s;
            }
            .gcpay-close-btn:hover {
                color: #333;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Creates and initializes the main button (bubble) and modal structure.
     */
    function createWidget() {
        // --- 1. Create Fixed Bubble Container ---
        const bubbleContainer = document.createElement('div');
        bubbleContainer.className = `gcpay-bubble-container ${config.bubblePosition}`;
        document.body.appendChild(bubbleContainer);

        // --- 2. Create Main Button ---
        const button = document.createElement('button');
        button.className = 'gcpay-main-button';
        button.textContent = config.buttonText;
        bubbleContainer.appendChild(button);

        // --- 3. Create Modal Structure ---
        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'gcpay-modal-backdrop';
        modalBackdrop.id = 'gcpay-modal';
        
        modalBackdrop.innerHTML = `
            <div class="gcpay-modal-content">
                <button class="gcpay-close-btn" aria-label="Close Modal">&times;</button>
                <h3>${config.title}</h3>
                <p class="gcpay-message">${config.message}</p>
                <div class="gcpay-qr-wrapper">
                    <img src="${config.qrCodeImage}" alt="QR Code for GCash/PayMaya Payment">
                </div>
                <span class="gcpay-account-name">${config.accountName}</span>
                <small style="display: block; color: #999; margin-top: 15px;">Thank you for your generosity!</small>
            </div>
        `;
        document.body.appendChild(modalBackdrop);

        // --- 4. Setup Event Listeners ---
        
        // Open Modal
        button.addEventListener('click', () => {
            modalBackdrop.classList.add('open');
            document.body.style.overflow = 'hidden'; 
        });

        // Close Modal function
        function closeModal() {
            modalBackdrop.classList.remove('open');
            document.body.style.overflow = ''; 
        }

        // Close when X button is clicked
        const closeButton = modalBackdrop.querySelector('.gcpay-close-btn');
        closeButton.addEventListener('click', closeModal);

        // Close when clicking outside the modal content
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });

        // Close with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
                closeModal();
            }
        });
    }

    /**
     * Initializes the plugin with user configurations.
     * @param {object} userConfig - Configuration object from the host page.
     */
    function init(userConfig) {
        // Merge user configuration with defaults
        config = { ...config, ...userConfig }; 
        
        // Inject styles first (needs to happen before createWidget)
        injectStyles();

        // Create the UI components
        createWidget();
    }

    // Public API
    return {
        init: init
    };

})();