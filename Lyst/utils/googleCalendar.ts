
export async function getUserCalendars(accessToken: string) {
    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return res.json();
}
  
export async function addEventToCalendar(
  // inputs
  accessToken: string,
  calendarId: string,
  event: {
    summary: string;
    start:  { dateTime: string };
    end:    { dateTime: string };
  }
) {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events`,
    {
      method:  'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );
  return res.json();
}
