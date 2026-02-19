/**
 * Demo rate card for landing page Live Quote Simulator.
 * Mock data only — no API calls.
 * All values in KES.
 */

export type DemoUnit = 'A4' | 'A3' | 'SQM'
export type DemoMaterial = '130gsm' | '150gsm' | '300gsm' | 'Banner' | 'Vinyl' | 'Reflective'
export type DemoFinishing = 'Lamination' | 'Round edges' | 'Binding' | 'Folding'

/** Printing: per sheet, oneSided and duplex (duplex is NOT 2× oneSided) */
export const printingRates: Record<DemoUnit, { oneSided: number; duplex: number }> = {
  A4: { oneSided: 8, duplex: 14 },
  A3: { oneSided: 15, duplex: 26 },
  SQM: { oneSided: 450, duplex: 800 }, // per m²
}

/** Material: per sheet for digital (A4/A3), per m² for SQM (Banner/Vinyl/Reflective) */
export const materialRates: Record<DemoUnit, Partial<Record<DemoMaterial, number>>> = {
  A4: {
    '130gsm': 2.5,
    '150gsm': 3.2,
    '300gsm': 6.5,
  },
  A3: {
    '130gsm': 5,
    '150gsm': 6.4,
    '300gsm': 13,
  },
  SQM: {
    Banner: 180,
    Vinyl: 320,
    Reflective: 450,
  },
}

/** Finishing: flat add-ons. Some per sheet, some per job */
export const finishingRates: Record<DemoFinishing, { price: number; chargeBy: 'per_sheet' | 'per_job' }> = {
  Lamination: { price: 12, chargeBy: 'per_sheet' },
  'Round edges': { price: 3, chargeBy: 'per_sheet' },
  Binding: { price: 250, chargeBy: 'per_job' },
  Folding: { price: 2, chargeBy: 'per_sheet' },
}

/** Imposition: sheets per physical sheet (e.g. A5 = 2 per A4, 4 per SRA3) */
export const impositionByUnit: Record<DemoUnit, number> = {
  A4: 1,
  A3: 1,
  SQM: 1,
}

/** Form state for the quote simulator */
export interface DemoFormState {
  unit: DemoUnit
  sides: 1 | 2
  quantity: number
  material: DemoMaterial
  finishing: DemoFinishing[]
  widthM: number
  heightM: number
  imposition: number
  profitMargin: number
}

/** Template presets for gallery cards */
export interface DemoPreset {
  id: string
  name: string
  unit: DemoUnit
  sides: 1 | 2
  quantity: number
  material: DemoMaterial
  finishing: DemoFinishing[]
  widthM?: number
  heightM?: number
}

export const templatePresets: DemoPreset[] = [
  {
    id: 'business-cards',
    name: 'Business Cards',
    unit: 'A4',
    sides: 2,
    quantity: 500,
    material: '300gsm',
    finishing: ['Round edges'],
  },
  {
    id: 'a5-flyers',
    name: 'A5 Flyers',
    unit: 'A4',
    sides: 2,
    quantity: 1000,
    material: '130gsm',
    finishing: [],
  },
  {
    id: 'posters',
    name: 'Posters',
    unit: 'A3',
    sides: 1,
    quantity: 100,
    material: '150gsm',
    finishing: ['Lamination'],
  },
  {
    id: 'stickers',
    name: 'Stickers',
    unit: 'A4',
    sides: 1,
    quantity: 250,
    material: '300gsm',
    finishing: ['Round edges'],
  },
  {
    id: 'banners',
    name: 'Banners',
    unit: 'SQM',
    sides: 1,
    quantity: 1,
    material: 'Banner',
    finishing: [],
    widthM: 1.2,
    heightM: 2.4,
  },
  {
    id: 'invitations',
    name: 'Invitations',
    unit: 'A4',
    sides: 2,
    quantity: 200,
    material: '300gsm',
    finishing: ['Folding', 'Round edges'],
  },
]
