function LoadingMessage({ message = "Loading..." }) {
  return (
    <div className="loading-message" role="status" aria-live="polite">
      <div className="loading-spinner"></div>

      <span>{message}</span>
    </div>
  );
}

export default LoadingMessage;
