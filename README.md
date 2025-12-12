# ☕ GCPayTipJar Plugin (GCash/PayMaya Tip Widget)

A simple, pure JavaScript widget designed to easily embed a "Buy Me a Coffee" style button on any website, displaying a local Philippine payment QR code (GCash, PayMaya, etc.) upon click.

This plugin requires no external dependencies (no jQuery, no Tailwind), making it extremely lightweight and portable.

## ✨ Features

- **Zero Dependencies**: Built purely with HTML, Vanilla JavaScript, and embedded CSS
- **Easy Integration**: Embed with two lines of HTML and a simple initialization script
- **Responsive Modal**: Works perfectly on both desktop and mobile devices
- **Customizable**: Easily change the button text, colors, title, and message

## 🚀 Installation and Setup

### 1. File Structure

Ensure you have the following files in your website's directory:

```
/your-website-root/
├── index.html                    <-- Your main website file
└── assets/
    ├── gcash_paymaya_plugin.js   <-- The main plugin script
    └── qr_code.png               <-- YOUR actual QR code image
```

### 2. Get Your QR Code

Save your consolidated GCash/PayMaya QR code as an image (e.g., `qr_code.png`) and update the path in the initialization step below.

### 3. Embed the Widget (HTML)

Place the following code snippet inside the `<body>` tag of any HTML page where you want the button to appear.

The plugin requires two parts: a placeholder container (`#payment-widget-container`) and the initialization script.

```html
<div id="payment-widget-container"></div>

<script src="gcash_paymaya_plugin.js"></script>

<script>
    window.onload = function() {
        GCPayPlugin.init({
            // REQUIRED CONFIGURATION
            containerId: 'payment-widget-container', // Must match the div ID above
            qrCodeImage: './assets/qr_code.png',     // <-- IMPORTANT: Set your image path here

            // OPTIONAL CONFIGURATION
            buttonText: 'Send Support (GCash/PayMaya)',
            title: 'Salamat sa Suporta!',
            message: 'Scan the combined QR code below to send a tip. Every peso helps!',
            accountName: 'Juan Dela Cruz (09xxxxxxxxx)',

            // OPTIONAL: Custom Colors (must be valid CSS color strings)
            // buttonColor: '#1D4ED8', 
            // buttonHoverColor: '#1E40AF',
        });
    };
</script>
```

## ⚙️ Configuration Options

The `GCPayPlugin.init()` function accepts a single object with the following properties:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `containerId` | string | `'payment-widget-container'` | Required. The ID of the HTML element where the button will be inserted. |
| `qrCodeImage` | string | `'default_qr_code.png'` | Required. The path to your actual QR code image file (e.g., `qr/my_gcash_paymaya.png`). |
| `buttonText` | string | `'Buy Me a Coffee'` | The text displayed on the main button. |
| `title` | string | `'Support the Creator'` | The title displayed at the top of the modal window. |
| `message` | string | `'Scan the QR code to send your support!'` | A short message/instruction displayed under the title. |
| `accountName` | string | `'Account Name Here'` | The name/number associated with the account displayed prominently under the QR code. |
| `buttonColor` | string | `'#1D4ED8'` | The background color of the main button. |
| `buttonHoverColor` | string | `'#1E40AF'` | The background color when hovering over the button. |