# Dynamic Widget Integration Guide

## Quick Start

To embed our widget on your website, you only need to add **two things**:

### 1. Add the Script Tag
```html
<script src="https://your-domain.com/widget.js"></script>
```

### 2. Add Widget Container(s)
```html
<div data-project-id="your-project-id"></div>
```

That's it! The widget will automatically initialize when the page loads.

## Basic Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>My Website Content</h1>
    
    <!-- Widget Container -->
    <div data-project-id="my-survey-123"></div>
    
    <!-- Widget Script (add before closing body tag) -->
    <script src="https://your-domain.com/widget.js"></script>
</body>
</html>
```

## Configuration Options

### Custom API URL
If you're using a custom backend:
```html
<div data-project-id="my-project" data-api-url="https://my-api.com/api"></div>
```

### Multiple Widgets
You can have multiple widgets on the same page:
```html
<div data-project-id="survey-1"></div>
<div data-project-id="survey-2"></div>
<div data-project-id="feedback-form"></div>
```

## Manual Initialization
If you need to initialize the widget programmatically:
```javascript
// Initialize all widgets on the page
window.DynamicWidget.init();

// Or render a specific widget
const container = document.getElementById('my-widget');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(window.DynamicWidget.Widget, {
    projectId: 'my-project-id',
    apiUrl: 'https://my-api.com/api' // optional
}));
```

## Widget Features

- **Responsive Design**: Works on all devices
- **Customizable Themes**: Colors and styles can be configured per project
- **Multiple Question Types**: 
  - Multiple choice
  - Text input
  - Rating (1-5 scale)
  - Yes/No questions
- **Progress Bar**: Shows completion status
- **Navigation**: Back/Next buttons (configurable)
- **Auto-Submit**: Handles form submission automatically

## Styling

The widget uses CSS custom properties for theming. You can override them:

```css
.widget-container {
    --primary-color: #your-brand-color;
    --secondary-color: #your-secondary-color;
    --background-color: #ffffff;
    --text-color: #333333;
    --border-radius: 8px;
}
```

## No Dependencies Required

The widget bundle includes everything needed:
- React and ReactDOM are bundled
- All styles are included
- No external dependencies required on your site

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile browsers

## File Size

- Production bundle: ~25KB gzipped
- Loads asynchronously (won't block your page)

## Support

For questions or issues, contact our support team or check the documentation.
