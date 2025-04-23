import { createGlobalStyle, keyframes } from 'styled-components';

const gradientBackground = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #1E293B;
    background: linear-gradient(135deg, #f9fafb 0%, #eef2ff 50%, #e0f2fe 100%);
    background-size: 300% 300%;
    animation: ${gradientBackground} 20s ease infinite;
    line-height: 1.5;
    font-weight: 400;
    min-height: 100vh;
    position: relative;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
  }

  body::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
    z-index: -1;
    opacity: 0.4;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
    font-weight: 700;
    line-height: 1.2;
  }

  p {
    overflow-wrap: break-word;
  }

  #root {
    min-height: 100vh;
    isolation: isolate;
    width: 100%;
    max-width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
  }

  /* Yazı tipi özelleştirmeleri */
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    
    body, body::before {
      animation: none;
    }
  }

  /* Webkit tarayıcıları için scrollbar özelleştirme */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(241, 245, 249, 0.6);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #60A5FA, #3B82F6);
    border-radius: 10px;
    border: 2px solid rgba(241, 245, 249, 0.6);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #3B82F6, #2563EB);
  }
  
  ::selection {
    background-color: rgba(59, 130, 246, 0.2);
    color: #1E293B;
  }
`;

export default GlobalStyles; 