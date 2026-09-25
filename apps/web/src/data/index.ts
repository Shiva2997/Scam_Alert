import type { Alert, ChecklistSection, Question, ResourceGroup } from '../types'
import alertsJson from './alerts.json'
import checklistJson from './checklist.json'
import questionsJson from './questions.json'
import resourcesJson from './resources.json'

// Phase 1 ships content as static JSON so the app works fully offline.
// Phase 2 replaces `alerts` with an API call and keeps this file as the fallback.
export const questions = questionsJson as Question[]
export const alerts = alertsJson as Alert[]
export const checklist = checklistJson as ChecklistSection[]
export const resources = resourcesJson as ResourceGroup[]
