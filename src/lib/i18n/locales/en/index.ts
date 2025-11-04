/**
 * English (en) translations - Main export
 * Combines all translation modules into a single resource
 */
import { common } from './common';
import { landing } from './landing';
import { setup } from './setup';
import { assignment } from './assignment';
import { summary } from './summary';
import { messages } from './messages';

export const en = {
  translation: {
    ...common,
    landing,
  setup,
  assignment,
  summary,
    ...messages,
  },
};
