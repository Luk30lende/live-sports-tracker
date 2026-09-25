function GameTimeline({ events = [] }) {
  if (events.length === 0) {
    return (
      <div className="status-message">
        <h3>No match events</h3>

        <p>No timeline events are available for this game.</p>
      </div>
    );
  }

  const getEventIcon = (event) => {
    if (event.detail === "Yellow Card") {
      return "🟨";
    }

    if (event.detail === "Red Card") {
      return "🟥";
    }

    if (event.type === "Goal" || event.detail === "Goal") {
      return "⚽";
    }

    if (event.type === "Substitution") {
      return "🔄";
    }

    return "•";
  };

  const sortedEvents = [...events].sort(
    (a, b) => (a.minute ?? 999) - (b.minute ?? 999),
  );

  return (
    <div className="game-timeline">
      {sortedEvents.map((event) => (
        <div className="game-timeline-event" key={event.id}>
          <div className="game-timeline-minute">
            {event.minute !== null ? `${event.minute}'` : "—"}
          </div>

          <div className="game-timeline-icon">{getEventIcon(event)}</div>

          <div className="game-timeline-content">
            <strong>{event.detail}</strong>

            {event.player && <span>{event.player}</span>}

            {event.team && <small>{event.team}</small>}

            {event.assist && <small>Assist: {event.assist}</small>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GameTimeline;
