import React from 'react';
import { createRoot } from 'react-dom/client';
import Widget from './components/Widget';

// Widget initialization function
const initWidget = () => {
  // Find all containers with data-project-id attribute
  const containers = document.querySelectorAll('[data-project-id]');
  
  containers.forEach((container) => {
    if (container instanceof HTMLElement) {
      const projectId = container.getAttribute('data-project-id');
      const apiUrl = container.getAttribute('data-api-url') || undefined;
      
      if (projectId) {
        // Create React root and render widget
        const root = createRoot(container);
        root.render(
          <Widget 
            projectId={projectId} 
            apiUrl={apiUrl}
          />
        );
      }
    }
  });
};

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidget);
} else {
  initWidget();
}

// Export for manual initialization
const DynamicWidget = {
  init: initWidget,
  Widget: Widget
};

// Make available globally for script tag usage
declare global {
  interface Window {
    DynamicWidget: typeof DynamicWidget;
  }
}

if (typeof window !== 'undefined') {
  window.DynamicWidget = DynamicWidget;
}

export default DynamicWidget;
