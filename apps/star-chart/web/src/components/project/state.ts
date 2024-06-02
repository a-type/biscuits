import { createActorContext } from '@xstate/react';
import { setup, emit, assign } from 'xstate';
import { Vector2 } from '../canvas/types.js';

export const projectCanvasMachine = setup({
  types: {
    context: {} as {
      selectedTask: string | undefined;
      selectedConnection: string | undefined;
    },
    events: {} as
      | { type: 'selectTask'; taskId: string }
      | { type: 'selectConnection'; connectionId: string }
      | { type: 'tapCanvas'; position: { x: number; y: number } },

    emitted: {} as { type: 'createTask'; position: Vector2 },
  },
  actions: {
    selectTask: assign((_, event: { taskId: string }) => {
      console.log('selected task', event.taskId);
      return { selectedTask: event.taskId, selectedConnection: undefined };
    }),
    selectConnection: assign((_, event: { connectionId: string }) => {
      console.log('selected connection', event.connectionId);
      return {
        selectedTask: undefined,
        selectedConnection: event.connectionId,
      };
    }),
    deselect: assign(() => {
      console.log('deselect');
      return {
        selectedTask: undefined,
        selectedConnection: undefined,
      };
    }),
    createTask: (_, event: { position: Vector2 }) => {
      // implement via provides
    },
  },
}).createMachine({
  id: 'projectCanvas',
  context: {
    selectedTask: undefined,
    selectedConnection: undefined,
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        selectTask: {
          target: 'taskSelected',
          actions: [
            {
              type: 'selectTask',
              params: ({ event }) => ({ taskId: event.taskId }),
            },
          ],
        },
        selectConnection: {
          target: 'connectionSelected',
          actions: [
            {
              type: 'selectConnection',
              params: ({ event }) => ({ connectionId: event.connectionId }),
            },
          ],
        },
        tapCanvas: {
          target: 'idle',
          actions: [
            {
              type: 'createTask',
              params: ({ event }) => ({ position: event.position }),
            },
          ],
        },
      },
    },
    taskSelected: {
      on: {
        selectTask: {
          target: 'taskSelected',
          actions: [
            {
              type: 'selectTask',
              params: ({ event }) => ({ taskId: event.taskId }),
            },
          ],
        },
        selectConnection: {
          target: 'connectionSelected',
          actions: [
            {
              type: 'selectConnection',
              params: ({ event }) => ({ connectionId: event.connectionId }),
            },
          ],
        },
        tapCanvas: {
          target: 'idle',
          actions: [{ type: 'deselect' }],
        },
      },
    },
    connectionSelected: {
      on: {
        selectTask: {
          target: 'taskSelected',
          actions: [
            {
              type: 'selectTask',
              params: ({ event }) => ({ taskId: event.taskId }),
            },
          ],
        },
        selectConnection: {
          target: 'connectionSelected',
          actions: [
            {
              type: 'selectConnection',
              params: ({ event }) => ({ connectionId: event.connectionId }),
            },
          ],
        },
        tapCanvas: {
          target: 'idle',
          actions: [{ type: 'deselect' }],
        },
      },
    },
  },
});

export const ProjectCanvasState = createActorContext(projectCanvasMachine);
