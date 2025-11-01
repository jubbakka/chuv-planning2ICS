import { describe, it, expect } from 'vitest'
import { SCHEDULE_CODES, type ScheduleCode, type Employee, type ScheduleEntry, type Schedule } from './schedule'

describe('SCHEDULE_CODES', () => {
  const expectedCodes = ['J', 'JC', 'JB', 'N', 'NC', 'NA', 'M', 'CM', 'MM', 'R', 'V', 'X', 'F']

  it('should contain all expected codes', () => {
    expectedCodes.forEach(code => {
      expect(SCHEDULE_CODES).toHaveProperty(code)
    })
    expect(Object.keys(SCHEDULE_CODES).length).toBe(expectedCodes.length)
  })

  it('should have correct structure for each code', () => {
    Object.values(SCHEDULE_CODES).forEach(code => {
      expect(code).toHaveProperty('code')
      expect(code).toHaveProperty('startTime')
      expect(code).toHaveProperty('endTime')
      expect(code).toHaveProperty('description')
      expect(code).toHaveProperty('color')
      
      // Type checking
      expect(typeof code.code).toBe('string')
      expect(typeof code.startTime).toBe('string')
      expect(typeof code.endTime).toBe('string')
      expect(typeof code.description).toBe('string')
      expect(typeof code.color).toBe('string')
    })
  })

  it('should have code property matching the key', () => {
    Object.entries(SCHEDULE_CODES).forEach(([key, code]) => {
      expect(code.code).toBe(key)
    })
  })

  describe('time format validation', () => {
    it('should have valid time format (HH:mm) for startTime and endTime', () => {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
      
      Object.values(SCHEDULE_CODES).forEach(code => {
        expect(code.startTime).toMatch(timeRegex)
        expect(code.endTime).toMatch(timeRegex)
      })
    })

    it('should have startTime before or equal to endTime for same-day shifts', () => {
      Object.values(SCHEDULE_CODES).forEach(code => {
        // All-day codes (00:00-23:59) are always valid
        if (code.startTime === '00:00' && code.endTime === '23:59') {
          return
        }
        
        // Night shifts that span midnight (e.g., 19:00-07:30) are valid
        // Day shifts should have startTime < endTime
        const [startHours, startMinutes] = code.startTime.split(':').map(Number)
        const [endHours, endMinutes] = code.endTime.split(':').map(Number)
        
        const startTotal = startHours * 60 + startMinutes
        const endTotal = endHours * 60 + endMinutes
        
        // Night shifts: endTime < startTime (spans midnight)
        // Day shifts: endTime > startTime
        if (endTotal < startTotal) {
          // This is a night shift spanning midnight, which is valid
          expect(endTotal).toBeLessThan(startTotal)
        } else {
          // This is a day shift, endTime should be after startTime
          expect(endTotal).toBeGreaterThan(startTotal)
        }
      })
    })
  })

  describe('all-day codes', () => {
    const allDayCodes = ['M', 'CM', 'MM', 'R', 'V', 'X']
    
    it('should identify all-day codes correctly (00:00-23:59)', () => {
      allDayCodes.forEach(code => {
        expect(SCHEDULE_CODES[code].startTime).toBe('00:00')
        expect(SCHEDULE_CODES[code].endTime).toBe('23:59')
      })
    })

    it('should have all all-day codes in the list', () => {
      const actualAllDayCodes = Object.values(SCHEDULE_CODES)
        .filter(code => code.startTime === '00:00' && code.endTime === '23:59')
        .map(code => code.code)
      
      expect(actualAllDayCodes.length).toBe(allDayCodes.length)
      allDayCodes.forEach(code => {
        expect(actualAllDayCodes).toContain(code)
      })
    })
  })

  describe('day shifts (07:00-19:30)', () => {
    const dayShiftCodes = ['J', 'JC', 'JB']
    
    it('should have correct times for day shifts', () => {
      dayShiftCodes.forEach(code => {
        expect(SCHEDULE_CODES[code].startTime).toBe('07:00')
        expect(SCHEDULE_CODES[code].endTime).toBe('19:30')
      })
    })
  })

  describe('night shifts (19:00-07:30)', () => {
    const nightShiftCodes = ['N', 'NC', 'NA']
    
    it('should have correct times for night shifts', () => {
      nightShiftCodes.forEach(code => {
        expect(SCHEDULE_CODES[code].startTime).toBe('19:00')
        expect(SCHEDULE_CODES[code].endTime).toBe('07:30')
      })
    })
  })

  describe('formation shift (08:00-16:00)', () => {
    it('should have correct times for formation', () => {
      expect(SCHEDULE_CODES.F.startTime).toBe('08:00')
      expect(SCHEDULE_CODES.F.endTime).toBe('16:00')
      expect(SCHEDULE_CODES.F.description).toBe('Formation')
      expect(SCHEDULE_CODES.F.color).toBe('teal')
    })
  })

  describe('colors', () => {
    it('should have a color for each code', () => {
      Object.values(SCHEDULE_CODES).forEach(code => {
        expect(code.color).toBeDefined()
        expect(code.color.length).toBeGreaterThan(0)
      })
    })

    it('should have expected colors for specific codes', () => {
      expect(SCHEDULE_CODES.J.color).toBe('blue')
      expect(SCHEDULE_CODES.JC.color).toBe('light-green')
      expect(SCHEDULE_CODES.JB.color).toBe('dark-green')
      expect(SCHEDULE_CODES.N.color).toBe('black')
      expect(SCHEDULE_CODES.NC.color).toBe('dark-grey')
      expect(SCHEDULE_CODES.V.color).toBe('orange')
      expect(SCHEDULE_CODES.X.color).toBe('red')
      expect(SCHEDULE_CODES.R.color).toBe('yellow')
    })
  })

  describe('descriptions', () => {
    it('should have non-empty descriptions', () => {
      Object.values(SCHEDULE_CODES).forEach(code => {
        expect(code.description).toBeDefined()
        expect(code.description.length).toBeGreaterThan(0)
      })
    })

    it('should have expected descriptions', () => {
      expect(SCHEDULE_CODES.J.description).toBe('Jour')
      expect(SCHEDULE_CODES.N.description).toBe('Nuit')
      expect(SCHEDULE_CODES.V.description).toBe('Vacances')
      expect(SCHEDULE_CODES.F.description).toBe('Formation')
      expect(SCHEDULE_CODES.M.description).toBe('Maladie')
    })
  })
})

describe('Type definitions', () => {
  describe('ScheduleCode', () => {
    it('should match the ScheduleCode interface', () => {
      const sampleCode: ScheduleCode = {
        code: 'TEST',
        startTime: '08:00',
        endTime: '17:00',
        description: 'Test',
        color: 'blue',
      }
      
      expect(sampleCode.code).toBe('TEST')
      expect(sampleCode.startTime).toBe('08:00')
      expect(sampleCode.endTime).toBe('17:00')
      expect(sampleCode.description).toBe('Test')
      expect(sampleCode.color).toBe('blue')
    })
  })

  describe('Employee', () => {
    it('should match the Employee interface', () => {
      const employee: Employee = {
        id: 'emp1',
        name: 'John Doe',
      }
      
      expect(employee.id).toBe('emp1')
      expect(employee.name).toBe('John Doe')
    })
  })

  describe('ScheduleEntry', () => {
    it('should match the ScheduleEntry interface', () => {
      const entry: ScheduleEntry = {
        employeeId: 'emp1',
        date: 15,
        code: 'J',
      }
      
      expect(entry.employeeId).toBe('emp1')
      expect(entry.date).toBe(15)
      expect(entry.code).toBe('J')
    })

    it('should have date between 1 and 31', () => {
      const validDates = [1, 15, 31]
      validDates.forEach(date => {
        const entry: ScheduleEntry = {
          employeeId: 'emp1',
          date,
          code: 'J',
        }
        expect(entry.date).toBeGreaterThanOrEqual(1)
        expect(entry.date).toBeLessThanOrEqual(31)
      })
    })
  })

  describe('Schedule', () => {
    it('should match the Schedule interface', () => {
      const schedule: Schedule = {
        id: 'schedule1',
        month: 12,
        year: 2025,
        employees: [
          { id: 'emp1', name: 'John Doe' },
          { id: 'emp2', name: 'Jane Smith' },
        ],
        entries: [
          { employeeId: 'emp1', date: 1, code: 'J' },
          { employeeId: 'emp2', date: 1, code: 'N' },
        ],
      }
      
      expect(schedule.id).toBe('schedule1')
      expect(schedule.month).toBe(12)
      expect(schedule.year).toBe(2025)
      expect(schedule.employees.length).toBe(2)
      expect(schedule.entries.length).toBe(2)
    })

    it('should have month between 1 and 12', () => {
      const schedule: Schedule = {
        id: 'schedule1',
        month: 6,
        year: 2025,
        employees: [],
        entries: [],
      }
      
      expect(schedule.month).toBeGreaterThanOrEqual(1)
      expect(schedule.month).toBeLessThanOrEqual(12)
    })
  })
})

