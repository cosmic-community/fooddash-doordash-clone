(function () {
  // Only run in iframe context (dashboard preview)
  if (window.self === window.top) return;

  const logs = [];
  const MAX_LOGS = 500;

  // Store original console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };

  function captureLog(level, args) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, (key, value) => {
            if (typeof value === 'function') return '[Function]';
            if (value instanceof Error) return value.toString();
            return value;
          }, 2);
        } catch (e) {
          return '[Object]';
        }
      }
      return String(arg);
    }).join(' ');

    const logEntry = {
      timestamp,
      level,
      message,
      url: window.location.href
    };

    logs.push(logEntry);
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }

    try {
      window.parent.postMessage({
        type: 'console-log',
        log: logEntry
      }, '*');
    } catch (e) {
      // Silent fail if parent messaging not available
    }
  }

  // Override console methods
  console.log = function(...args) {
    originalConsole.log.apply(console, args);
    captureLog('log', args);
  };

  console.warn = function(...args) {
    originalConsole.warn.apply(console, args);
    captureLog('warn', args);
  };

  console.error = function(...args) {
    originalConsole.error.apply(console, args);
    captureLog('error', args);
  };

  console.info = function(...args) {
    originalConsole.info.apply(console, args);
    captureLog('info', args);
  };

  console.debug = function(...args) {
    originalConsole.debug.apply(console, args);
    captureLog('debug', args);
  };

  // Capture unhandled errors
  window.addEventListener('error', function(e) {
    captureLog('error', [`Unhandled Error: ${e.message}`, `at ${e.filename}:${e.lineno}:${e.colno}`]);
  });

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', function(e) {
    captureLog('error', [`Unhandled Promise Rejection: ${e.reason}`]);
  });

  function sendReady() {
    try {
      window.parent.postMessage({
        type: 'console-capture-ready',
        url: window.location.href,
        timestamp: new Date().toISOString()
      }, '*');
    } catch (e) {
      // Silent fail if parent messaging not available
    }
  }

  function sendRouteChange() {
    try {
      window.parent.postMessage({
        type: 'route-change',
        route: {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          href: window.location.href
        },
        timestamp: new Date().toISOString()
      }, '*');
    } catch (e) {
      // Silent fail if parent messaging not available
    }
  }

  // Send ready message when page loads
  if (document.readyState === 'loading') {
    window.addEventListener('load', sendReady);
  } else {
    sendReady();
  }

  // Send initial route after ready
  setTimeout(() => {
    sendRouteChange();
  }, 100);

  // Monitor route changes for SPA navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    setTimeout(sendRouteChange, 50);
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    setTimeout(sendRouteChange, 50);
  };

  // Listen for popstate events (back/forward navigation)
  window.addEventListener('popstate', function() {
    setTimeout(sendRouteChange, 50);
  });

  // Listen for hash changes
  window.addEventListener('hashchange', function() {
    setTimeout(sendRouteChange, 50);
  });

  // Monitor Next.js route changes more specifically
  if (typeof window !== 'undefined') {
    // Listen for Next.js router events if available
    const checkForNextRouter = () => {
      if (window.next && window.next.router) {
        window.next.router.events.on('routeChangeComplete', sendRouteChange);
      }
    };
    
    // Check periodically for Next.js router availability
    const routerCheckInterval = setInterval(() => {
      checkForNextRouter();
      if (window.next && window.next.router) {
        clearInterval(routerCheckInterval);
      }
    }, 500);

    // Clear interval after 10 seconds to avoid infinite checking
    setTimeout(() => {
      clearInterval(routerCheckInterval);
    }, 10000);
  }

  // Additional fallback: monitor URL changes with polling
  let lastUrl = window.location.href;
  setInterval(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      sendRouteChange();
    }
  }, 1000);

})();