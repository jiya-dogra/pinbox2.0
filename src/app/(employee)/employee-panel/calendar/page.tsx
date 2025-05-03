'use client';
import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { getStoredUser } from '@/src/utils/auth';
import EmployeeHeader from '@/src/components/employeeheader';
import style from '@/src/styles/employee.module.css';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { Modal } from '@/src/components/Modal';
import TaskForm from '@/src/components/TaskForm';

export default function Calendar() {
    const calendarRef = useRef<FullCalendar>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentEvent, setCurrentEvent] = useState({
        id: '',
        title: '',
        description: '',
        start: '',
        end: '',
        type: 'event'
    });
    const user = getStoredUser();

    useEffect(() => {
        if (user?.userId) fetchEvents();
    }, [user?.userId]);

    const fetchEvents = async () => {
        try {
            // Fetch tasks
            const tasksRes = await fetch(`/api/tasks?userId=${user?.userId}`);
            const tasks = await tasksRes.json();

            // Fetch calendar events
            const eventsRes = await fetch(`/api/calendar-events?userId=${user?.userId}`);
            const calendarEvents = await eventsRes.json();

            // Transform tasks to calendar events
            const taskEvents = tasks.map((task: any) => ({
                id: `task_${task.id}`,
                title: task.title,
                start: task.dueDate,
                extendedProps: {
                    description: task.description,
                    type: 'task',
                    status: task.status,
                    assignedTo: task.assignedTo?.fullName,
                    isTask: true
                },
                backgroundColor: task.status === 'completed' ? '#dcfce7' : '#fef3c7',
                borderColor: task.status === 'completed' ? '#166534' : '#92400e',
                textColor: '#000000',
                editable: false,
                classNames: ['task-event']
            }));

            // Transform calendar events
            const formattedEvents = calendarEvents.map((event: any) => ({
                id: `event_${event.id}`,
                title: event.title,
                start: event.start,
                end: event.end,
                extendedProps: {
                    description: event.description,
                    type: event.type,
                    isTask: false
                },
                backgroundColor: '#e0e7ff',
                borderColor: '#4f46e5',
                textColor: '#000000',
                editable: true,
                classNames: ['calendar-event']
            }));

            setEvents([...taskEvents, ...formattedEvents]);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleDateClick = (arg: { date: Date }) => {
        setSelectedDate(arg.date);
        setCurrentEvent({
            id: '',
            title: '',
            description: '',
            start: arg.date.toISOString(),
            end: '',
            type: 'event'
        });
        setShowEventModal(true);
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const event = clickInfo.event;

        // Extract the real ID (remove 'event_' prefix if present)
        const eventId = event.id.startsWith('event_')
            ? event.id.replace('event_', '')
            : event.id;

        setCurrentEvent({
            id: eventId,
            title: event.title,
            description: event.extendedProps.description || '',
            start: event.start?.toISOString() || '',
            end: event.end?.toISOString() || '',
            type: event.extendedProps.type || 'event'
        });
        setShowEventModal(true);
    };

    const handleEventSubmit = async () => {
        try {
            const method = currentEvent.id ? 'PATCH' : 'POST';
            const url = currentEvent.id
                ? `/api/calendar-events/${currentEvent.id}`
                : '/api/calendar-events';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...currentEvent,
                    createdById: user?.userId
                })
            });

            if (response.ok) {
                fetchEvents();
                setShowEventModal(false);
            }
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    const handleTaskSubmit = async (taskData: any) => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...taskData,
                    assignedById: user?.userId
                })
            });

            if (response.ok) {
                fetchEvents();
                setShowTaskModal(false);
            }
        } catch (error) {
            console.error('Task creation failed:', error);
        }
    };

    const handleEventDelete = async () => {
        try {
            if (!currentEvent.id) return;

            const response = await fetch(`/api/calendar-events/${currentEvent.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                fetchEvents();
                setShowEventModal(false);
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <ProtectedRoute>
            <div>
                <EmployeeHeader />
                <div className={style.wrapper}>
                    <div className={style.content} style={{ marginBottom: '20px' }}>
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events={events}
                            dateClick={handleDateClick}
                            eventClick={handleEventClick}
                            editable={true}
                            eventContent={renderEventContent}
                            height="auto"
                            eventDisplay="block"
                            eventTextColor="#000000"
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            }}
                            dayHeaderClassNames={style.dayHeader}
                            dayCellClassNames={style.dayCell}
                            nowIndicator={true}
                        />
                    </div>
                </div>
                {showEventModal && (
                    <Modal onClose={() => setShowEventModal(false)}>
                        <div className={style.modalContent}>
                            <h2 className={style.modalTitle}>{currentEvent.id ? 'Edit Event' : 'Add New Event'}</h2>
                            <div className={style.formGroup}>
                                <label className={style.formLabel}>Title</label>
                                <input
                                    type="text"
                                    className={style.formInput}
                                    value={currentEvent.title}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label className={style.formLabel}>Description</label>
                                <textarea
                                    className={style.formTextarea}
                                    value={currentEvent.description}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                                />
                            </div>
                            <div className={style.formRow}>
                                <div className={style.formGroup}>
                                    <label className={style.formLabel}>Start</label>
                                    <input
                                        type="datetime-local"
                                        className={style.formInput}
                                        value={currentEvent.start}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, start: e.target.value })}
                                    />
                                </div>
                                <div className={style.formGroup}>
                                    <label className={style.formLabel}>End</label>
                                    <input
                                        type="datetime-local"
                                        className={style.formInput}
                                        value={currentEvent.end}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, end: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className={style.formActions}>
                                {currentEvent.id && (
                                    <button
                                        className={style.deleteButton}
                                        onClick={handleEventDelete}
                                    >
                                        Delete
                                    </button>
                                )}
                                <button
                                    className={style.cancelButton}
                                    onClick={() => setShowEventModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={style.saveButton}
                                    onClick={handleEventSubmit}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
                {showTaskModal && (
                    <TaskForm
                        employees={[]}
                        onSubmit={handleTaskSubmit}
                        currentUserPriority={1}
                        isOpen={showTaskModal}
                        onClose={() => setShowTaskModal(false)}
                    />
                )}
            </div>
        </ProtectedRoute>
    );
}
function renderEventContent(eventInfo: any) {
    return (
        <div className={style.eventContent}>
            <div className={style.eventTitle}>{eventInfo.event.title}</div>
            {eventInfo.event.extendedProps.isTask && (
                <div className={style.taskStatusBadge}>
                    {eventInfo.event.extendedProps.status}
                    {eventInfo.event.extendedProps.assignedTo && (
                        <span className={style.assignedTo}> • {eventInfo.event.extendedProps.assignedTo}</span>
                    )}
                </div>
            )}
        </div>
    );
}