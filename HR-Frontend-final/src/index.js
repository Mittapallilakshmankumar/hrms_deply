import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const API_ORIGIN = (process.env.REACT_APP_API_ORIGIN || "").trim();
const LOCAL_API_ORIGINS = ["http://127.0.0.1:8000", "http://localhost:8000"];

function getNormalizedApiOrigin() {
  if (API_ORIGIN) {
    return API_ORIGIN;
  }

  const { protocol, hostname, port, origin } = window.location;
  const isLocalFrontend =
    (hostname === "localhost" || hostname === "127.0.0.1") &&
    port === "3000";

  if (isLocalFrontend) {
    return `${protocol}//${hostname}:8000`;
  }

  return origin;
}

function normalizeApiUrl(url) {
  if (typeof url !== "string") {
    return url;
  }

  const matchedOrigin = LOCAL_API_ORIGINS.find((origin) => url.startsWith(`${origin}/`));
  if (!matchedOrigin) {
    return url;
  }

  const targetOrigin = getNormalizedApiOrigin();
  return `${targetOrigin}${url.slice(matchedOrigin.length)}`;
}

const nativeFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  if (typeof input === "string") {
    return nativeFetch(normalizeApiUrl(input), init);
  }

  if (input instanceof Request) {
    const nextUrl = normalizeApiUrl(input.url);
    if (nextUrl !== input.url) {
      return nativeFetch(new Request(nextUrl, input), init);
    }
  }

  return nativeFetch(input, init);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
