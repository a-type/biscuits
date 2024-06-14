import { UndoHistory } from '@wish-wash.biscuits/verdant';

export const undoHistory = new UndoHistory();

async function registerUndoKeybinds() {
  document.addEventListener('keydown', async (e) => {
    if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      e.preventDefault();
      const result = await undoHistory.undo();
      if (!result) {
        console.log('Nothing to undo');
      }
    }
    if (
      (e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'z' && e.shiftKey && (e.ctrlKey || e.metaKey))
    ) {
      e.preventDefault();
      const result = await undoHistory.redo();
      if (!result) {
        console.log('Nothing to redo');
      }
    }
  });
}

registerUndoKeybinds();
