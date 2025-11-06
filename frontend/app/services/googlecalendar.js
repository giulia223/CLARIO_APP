import { googleCalendarAPI } from './api';

export async function addEventToGoogleCalendar(taskText, date, accessToken) {
  const start = new Date(date);
  const end = new Date(date.getTime() + 60 * 60 * 1000); // +1h

  const eventData = {
    token: accessToken,
    summary: taskText,
    start: start.toISOString(),
    end: end.toISOString(),
  };

  return await googleCalendarAPI.addEvent(eventData);
}

export default function __NonRouteGoogleCalendar() { return null }