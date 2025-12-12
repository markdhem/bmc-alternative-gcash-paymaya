/**
 * GCash/PayMaya Payment Plugin (Plugin Name: GCPayPlugin)
 * * This plugin dynamically creates a floating button and a modal 
 * to display a QR code for donations/tips via local payment methods.
 */
const GCPayPlugin = (function() {

    // Default configuration (can be overwritten by init)
    let config = {
        containerId: 'payment-widget-container',
        buttonText: 'Buy Me a Coffee',
        qrCodeImage: 'default_qr_code.png', // Placeholder
        title: 'Support the Creator',
        message: 'Scan the QR code to send your support!',
        accountName: 'Account Name Here',
        buttonColor: '#1D4ED8', // Primary blue
        buttonHoverColor: '#1E40AF',
    };

    /**
     * Injects the required CSS styles directly into the document head.
     * This makes the plugin completely self-contained.
     */
    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Modal Backdrop */
            .gcpay-modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
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

            /* Modal Content */
            .gcpay-modal-content {
                background: #fff;
                padding: 30px;
                border-radius: 8px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                text-align: center;
                transform: translateY(-50px);
                transition: transform 0.3s ease-out;
            }
            .gcpay-modal-backdrop.open .gcpay-modal-content {
                transform: translateY(0);
            }

            /* Header and Text */
            .gcpay-modal-content h3 {
                color: #333;
                margin-top: 0;
                font-size: 1.5em;
                font-family: inherit;
            }
            .gcpay-account-name {
                font-weight: bold;
                color: #1D4ED8;
                margin-top: 10px;
                display: block;
            }

            /* QR Code Image */
            .gcpay-qr-wrapper {
                margin: 20px auto;
                width: 250px;
                height: 250px;
                border: 1px solid #ddd;
                padding: 5px;
            }
            .gcpay-qr-wrapper img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            /* Close Button */
            .gcpay-close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 1.5em;
                cursor: pointer;
                color: #999;
            }
            .gcpay-close-btn:hover {
                color: #333;
            }
            
            /* Main Button (Configurable Color) */
            .gcpay-main-button {
                padding: 12px 20px;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1em;
                font-weight: bold;
                transition: background-color 0.2s;
                background-color: ${config.buttonColor};
            }
            .gcpay-main-button:hover {
                background-color: ${config.buttonHoverColor};
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Creates and initializes the main button and modal structure.
     */
    function createWidget() {
        const container = document.getElementById(config.containerId);
        if (!container) {
            console.error(`GCPayPlugin Error: Container ID '${config.containerId}' not found.`);
            return;
        }

        // --- 1. Create Main Button ---
        const button = document.createElement('button');
        button.className = 'gcpay-main-button';
        button.textContent = config.buttonText;
        container.appendChild(button);

        // --- 2. Create Modal Structure ---
        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'gcpay-modal-backdrop';
        modalBackdrop.id = 'gcpay-modal';
        
        modalBackdrop.innerHTML = `
            <div class="gcpay-modal-content">
                <button class="gcpay-close-btn" aria-label="Close Modal">&times;</button>
                <h3>${config.title}</h3>
                <p>${config.message}</p>
                <div class="gcpay-qr-wrapper">
                    <img src="${config.qrCodeImage}" alt="QR Code for GCash/PayMaya Payment">
                </div>
                <span class="gcpay-account-name">${config.accountName}</span>
                <small style="display: block; color: #666; margin-top: 10px;">Thank you for your support!</small>
            </div>
        `;
        document.body.appendChild(modalBackdrop);

        // --- 3. Setup Event Listeners ---
        
        // Open Modal
        button.addEventListener('click', () => {
            modalBackdrop.classList.add('open');
            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden'; 
        });

        // Close Modal function
        function closeModal() {
            modalBackdrop.classList.remove('open');
            document.body.style.overflow = ''; 
        }

        // Close when X button is clicked (find it within the modal content)
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