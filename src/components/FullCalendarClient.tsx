// src/components/FullCalendarClient.tsx
'use client';
import { DateTime } from 'luxon';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState } from 'react';

export default function FullCalendarClient() {
    const today = DateTime.now().toISODate();

    const [events, setEvents] = useState([
        { title: 'John Doe - Present', start: today, end: today },
        { title: 'Jane Smith - Vacation', start: today, end: today },
    ]);

    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
        />
    );
}