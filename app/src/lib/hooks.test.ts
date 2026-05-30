import { describe, it, expect } from 'vitest'
import { fmtSec } from './hooks'

describe('fmtSec', () => {
  it('renders an em dash for null/undefined', () => {
    expect(fmtSec(null)).toBe('—')
    expect(fmtSec(undefined)).toBe('—')
  })

  it('renders sub-second values in milliseconds', () => {
    expect(fmtSec(0.25)).toBe('250 ms')
    expect(fmtSec(0.999)).toBe('999 ms')
  })

  it('renders >=1s values in seconds with two decimals', () => {
    expect(fmtSec(1)).toBe('1.00 s')
    expect(fmtSec(1.6)).toBe('1.60 s')
    expect(fmtSec(12.345)).toBe('12.35 s')
  })

  it('treats exactly 1 second as the seconds branch', () => {
    expect(fmtSec(1).endsWith('s')).toBe(true)
    expect(fmtSec(1)).not.toContain('ms')
  })
})
