export async function addEventToGoogleCalendar(taskText, date, accessToken) {
  const start = new Date(date);
  const end = new Date(date.getTime() + 60 * 60 * 1000); // +1h

  const event = {
    summary: taskText,
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error('Failed to add event to Google Calendar');
  }

  return await response.json();
}
