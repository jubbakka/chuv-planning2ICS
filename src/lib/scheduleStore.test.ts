import { describe, it, expect, beforeEach } from 'vitest';
import type { Schedule, ScheduleEntry, Employee } from "@/types/schedule";
import {
    generateId,
    getSchedule,
    saveSchedule,
    getCurrentSchedule,
    setCurrentSchedule,
    deleteSchedule,
    listSchedules,
    addEntry,
    removeEntry,
    getEntriesForEmployee,
    addEmployee,
    updateEmployee,
    removeEmployee,
    getEntry
} from './scheduleStore';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('scheduleStore', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('generateId', () => {
        it('should generate unique IDs', () => {
            const id1 = generateId();
            const id2 = generateId();
            expect(id1).toBeTruthy();
            expect(id2).toBeTruthy();
            expect(id1).not.toBe(id2);
        });
    });

    describe('getSchedule and saveSchedule', () => {
        it('should save and retrieve a schedule', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);
            const retrieved = getSchedule('test-1');

            expect(retrieved).toEqual(schedule);
        });

        it('should return null if schedule does not exist', () => {
            const retrieved = getSchedule('non-existent');
            expect(retrieved).toBeNull();
        });

        it('should throw error for invalid schedule', () => {
            const invalidSchedule = {
                id: '',
                month: 12,
                year: 2025,
                employees: [],
                entries: []
            } as Schedule;

            expect(() => saveSchedule(invalidSchedule)).toThrow();
        });

        it('should throw error for invalid month', () => {
            const invalidSchedule: Schedule = {
                id: 'test-1',
                month: 13, // Invalid
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            expect(() => saveSchedule(invalidSchedule)).toThrow();
        });
    });

    describe('getCurrentSchedule and setCurrentSchedule', () => {
        it('should set and get current schedule', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);
            setCurrentSchedule('test-1');
            const current = getCurrentSchedule();

            expect(current).toEqual(schedule);
        });

        it('should return null if no current schedule', () => {
            const current = getCurrentSchedule();
            expect(current).toBeNull();
        });

        it('should throw error if setting non-existent schedule', () => {
            expect(() => setCurrentSchedule('non-existent')).toThrow();
        });
    });

    describe('deleteSchedule', () => {
        it('should delete a schedule', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);
            deleteSchedule('test-1');

            expect(getSchedule('test-1')).toBeNull();
        });

        it('should clear current schedule if deleting it', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);
            setCurrentSchedule('test-1');
            deleteSchedule('test-1');

            expect(getCurrentSchedule()).toBeNull();
        });
    });

    describe('listSchedules', () => {
        it('should list all schedules', () => {
            const schedule1: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };
            const schedule2: Schedule = {
                id: 'test-2',
                month: 1,
                year: 2026,
                employees: [{ id: 'emp-2', name: 'Jane' }],
                entries: []
            };

            saveSchedule(schedule1);
            saveSchedule(schedule2);
            const schedules = listSchedules();

            expect(schedules).toHaveLength(2);
            expect(schedules.map(s => s.id)).toContain('test-1');
            expect(schedules.map(s => s.id)).toContain('test-2');
        });

        it('should return empty array if no schedules', () => {
            expect(listSchedules()).toEqual([]);
        });
    });

    describe('addEntry', () => {
        it('should add an entry to schedule', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);
            const entry: ScheduleEntry = {
                employeeId: 'emp-1',
                date: 15,
                code: 'J'
            };

            addEntry('test-1', entry);
            const updated = getSchedule('test-1');

            expect(updated?.entries).toHaveLength(1);
            expect(updated?.entries[0]).toEqual(entry);
        });

        it('should update entry if it already exists', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: [{ employeeId: 'emp-1', date: 15, code: 'J' }]
            };

            saveSchedule(schedule);
            const newEntry: ScheduleEntry = {
                employeeId: 'emp-1',
                date: 15,
                code: 'N'
            };

            addEntry('test-1', newEntry);
            const updated = getSchedule('test-1');

            expect(updated?.entries).toHaveLength(1);
            expect(updated?.entries[0].code).toBe('N');
        });

        it('should throw error for invalid entry', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);
            const invalidEntry: ScheduleEntry = {
                employeeId: 'emp-1',
                date: 32, // Invalid
                code: 'J'
            };

            expect(() => addEntry('test-1', invalidEntry)).toThrow();
        });

        it('should throw error for non-existent employee', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);
            const entry: ScheduleEntry = {
                employeeId: 'non-existent',
                date: 15,
                code: 'J'
            };

            expect(() => addEntry('test-1', entry)).toThrow();
        });
    });

    describe('removeEntry', () => {
        it('should remove an entry', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: [{ employeeId: 'emp-1', date: 15, code: 'J' }]
            };

            saveSchedule(schedule);
            removeEntry('test-1', 'emp-1', 15);
            const updated = getSchedule('test-1');

            expect(updated?.entries).toHaveLength(0);
        });
    });

    describe('getEntriesForEmployee', () => {
        it('should return all entries for an employee', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [
                    { id: 'emp-1', name: 'John' },
                    { id: 'emp-2', name: 'Jane' }
                ],
                entries: [
                    { employeeId: 'emp-1', date: 15, code: 'J' },
                    { employeeId: 'emp-1', date: 16, code: 'N' },
                    { employeeId: 'emp-2', date: 15, code: 'J' }
                ]
            };

            saveSchedule(schedule);
            const entries = getEntriesForEmployee('test-1', 'emp-1');

            expect(entries).toHaveLength(2);
            expect(entries.every(e => e.employeeId === 'emp-1')).toBe(true);
        });
    });

    describe('getEntry', () => {
        it('should return a specific entry', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: [{ employeeId: 'emp-1', date: 15, code: 'J' }]
            };

            saveSchedule(schedule);
            const entry = getEntry('test-1', 'emp-1', 15);

            expect(entry).toEqual({ employeeId: 'emp-1', date: 15, code: 'J' });
        });

        it('should return null if entry does not exist', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);
            const entry = getEntry('test-1', 'emp-1', 15);

            expect(entry).toBeNull();
        });
    });

    describe('addEmployee', () => {
        it('should add an employee to schedule', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);
            const newEmployee: Employee = { id: 'emp-2', name: 'Jane' };

            addEmployee('test-1', newEmployee);
            const updated = getSchedule('test-1');

            expect(updated?.employees).toHaveLength(2);
            expect(updated?.employees[1]).toEqual(newEmployee);
        });

        it('should throw error if employee already exists', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);
            const duplicate: Employee = { id: 'emp-1', name: 'John' };

            expect(() => addEmployee('test-1', duplicate)).toThrow();
        });
    });

    describe('updateEmployee', () => {
        it('should update an employee', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);
            const updated: Employee = { id: 'emp-1', name: 'John Doe' };

            updateEmployee('test-1', updated);
            const scheduleUpdated = getSchedule('test-1');

            expect(scheduleUpdated?.employees[0].name).toBe('John Doe');
        });

        it('should throw error if employee does not exist', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);
            const nonExistent: Employee = { id: 'emp-2', name: 'Jane' };

            expect(() => updateEmployee('test-1', nonExistent)).toThrow();
        });
    });

    describe('removeEmployee', () => {
        it('should remove an employee and their entries', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [
                    { id: 'emp-1', name: 'John' },
                    { id: 'emp-2', name: 'Jane' }
                ],
                entries: [
                    { employeeId: 'emp-1', date: 15, code: 'J' },
                    { employeeId: 'emp-2', date: 15, code: 'N' }
                ]
            };

            saveSchedule(schedule);
            removeEmployee('test-1', 'emp-1');
            const updated = getSchedule('test-1');

            expect(updated?.employees).toHaveLength(1);
            expect(updated?.employees[0].id).toBe('emp-2');
            expect(updated?.entries).toHaveLength(1);
            expect(updated?.entries[0].employeeId).toBe('emp-2');
        });

        it('should throw error if trying to remove last employee', () => {
            const schedule: Schedule = {
                id: 'test-1',
                month: 12,
                year: 2025,
                employees: [{ id: 'emp-1', name: 'John' }],
                entries: []
            };

            saveSchedule(schedule);

            expect(() => removeEmployee('test-1', 'emp-1')).toThrow();
        });
    });
});

