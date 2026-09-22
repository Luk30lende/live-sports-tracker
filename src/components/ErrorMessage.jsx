function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <div className="error-icon" aria-hidden="true">
        !
      </div>

      <div className="error-content">
        <strong>Something went wrong</strong>

        <p>{message}</p>

        {onRetry && (
          <button type="button" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
