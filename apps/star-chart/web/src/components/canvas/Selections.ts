import { EventSubscriber } from '@a-type/utils';

export class Selections extends EventSubscriber<{
  change: (selectedIds: string[]) => void;
  [k: `change:${string}`]: (selected: boolean) => void;
  [k: `pendingChange:${string}`]: (pending: boolean) => void;
}> {
  readonly selectedIds = new Set<string>();
  readonly pendingIds = new Set<string>();

  add = (objectId: string) => {
    if (this.selectedIds.has(objectId)) return;
    this.selectedIds.add(objectId);
    this.emit(`change:${objectId}`, true);
    this.emit('change', Array.from(this.selectedIds));
  };

  addAll = (objectIds: string[]) => {
    for (const objectId of objectIds) {
      this.add(objectId);
    }
  };

  remove = (objectId: string) => {
    if (!this.selectedIds.has(objectId)) return;
    this.selectedIds.delete(objectId);
    this.emit(`change:${objectId}`, false);
    this.emit('change', Array.from(this.selectedIds));
  };

  removeAll = (objectIds: string[]) => {
    for (const objectId of objectIds) {
      this.remove(objectId);
    }
  };

  clear = () => {
    this.set([]);
    console.log('clear');
  };

  toggle = (objectId: string) => {
    if (this.selectedIds.has(objectId)) {
      this.remove(objectId);
    } else {
      this.add(objectId);
    }
  };

  addPending = (objectId: string) => {
    if (this.pendingIds.has(objectId)) return;
    this.pendingIds.add(objectId);
    this.emit(`pendingChange:${objectId}`, true);
  };

  removePending = (objectId: string) => {
    if (!this.pendingIds.has(objectId)) return;
    this.pendingIds.delete(objectId);
    this.emit(`pendingChange:${objectId}`, false);
  };

  togglePending = (objectId: string) => {
    if (this.pendingIds.has(objectId)) {
      this.removePending(objectId);
    } else {
      this.addPending(objectId);
    }
  };

  set = (objectIds: string[]) => {
    const selectedIds = new Set(objectIds);
    for (const objectId of this.selectedIds) {
      if (!selectedIds.has(objectId)) {
        this.remove(objectId);
      }
    }
    for (const objectId of objectIds) {
      if (!this.selectedIds.has(objectId)) {
        this.add(objectId);
      }
    }
  };

  setPending = (objectIds: string[]) => {
    const pendingIds = new Set(objectIds);
    for (const objectId of this.pendingIds) {
      if (!pendingIds.has(objectId)) {
        this.removePending(objectId);
      }
    }
    for (const objectId of objectIds) {
      if (!this.pendingIds.has(objectId)) {
        this.addPending(objectId);
      }
    }
  };
}
