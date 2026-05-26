import { z } from 'zod'

export const SpeciesSchema = z.object({
  id: z.string(),
  name: z.string(),
  latin: z.string(),
  color: z.string(),
  freq: z.tuple([z.number(), z.number()]),
  peakHz: z.number(),
  depth: z.tuple([z.number(), z.number()]),
  body: z.number(),
  voice: z.string(),
  sample: z.string(),
})
export type Species = z.infer<typeof SpeciesSchema>

export const CodaSchema = z.object({
  name: z.string(),
  label: z.string(),
  intervals: z.array(z.number()),
  clan: z.string(),
  kind: z.string(),
})
export type Coda = z.infer<typeof CodaSchema>

export const CodaModifierSchema = z.object({
  id: z.string(),
  name: z.string(),
  desc: z.string(),
})
export type CodaModifier = z.infer<typeof CodaModifierSchema>

export const BrainSchema = z.object({
  id: z.string(),
  name: z.string(),
  latin: z.string(),
  mass: z.number(),
  neurons: z.number(),
  cortexNeurons: z.number(),
  EQ: z.number(),
  cortexArea: z.number(),
  length: z.number(),
  height: z.number(),
  color: z.string(),
  facts: z.array(z.string()),
})
export type Brain = z.infer<typeof BrainSchema>

export const TimelineEventSchema = z.object({
  year: z.number(),
  who: z.string(),
  what: z.string(),
  tag: z.string(),
})
export type TimelineEvent = z.infer<typeof TimelineEventSchema>

export const ZipfSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  alpha: z.number(),
  n: z.number(),
  color: z.string(),
  note: z.string(),
})
export type ZipfSource = z.infer<typeof ZipfSourceSchema>

export const RangeSchema = z.object({
  id: z.string(),
  name: z.string(),
  peak: z.number(),
  max: z.number(),
  note: z.string(),
})
export type Range = z.infer<typeof RangeSchema>
