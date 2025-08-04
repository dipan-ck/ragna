import { v4 as uuidv4 } from 'uuid';

export function generateProjectApiKey(): string {
  return 'proj_' + uuidv4();
}
