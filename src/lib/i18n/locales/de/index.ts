/**
 * German (de) translations - Modular structure matching English
 * Imports from separate files for better maintainability
 */
import { common } from './common';
import { landing } from './landing';
import { setup } from './setup';
import { assignment } from './assignment';
import { summary } from './summary';
import { messages } from './messages';

export const de = {
  translation: {
    ...common,
    landing,
    setup,
    assignment,
    summary,
    ...messages,
  },
};
