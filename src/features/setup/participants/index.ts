/**
 * ParticipantsList Module Exports
 * 
 * Main entry point for the ParticipantsList feature module.
 * Use this for importing the main component.
 * 
 * @example
 * import { ParticipantsList } from './participants';
 */

export { ParticipantsList } from './ParticipantsList';

// Optional: Export components for reuse in other parts of the app
export { ParticipantInput } from './components/ParticipantInput';
export { ParticipantCard } from './components/ParticipantCard';
export { ParticipantGrid } from './components/ParticipantGrid';
export { GroupManagement } from './components/GroupManagement';
export { HabitRecognition } from './components/HabitRecognition';

// Optional: Export hooks for reuse
export { useParticipantForm } from './hooks/useParticipantForm';
export { useGroupManagement } from './hooks/useGroupManagement';
export { useHabitRecognition } from './hooks/useHabitRecognition';

// Optional: Export utilities
export { validateParticipantName, validateGroupName } from './utils/participantValidation';
