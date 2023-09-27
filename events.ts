export enum EventType {
  MOVE_ENTRY = 'MOVE_ENTRY',
  DELETE_ENTRY = 'DELETE_ENTRY',
  CREATE_ENTRY = 'CREATE_ENTRY',
  CHANGED_ENTRY_NAME = 'CHANGED_ENTRY_NAME',
  MARK_ENTRY_DONE = 'MARK_ENTRY_DONE',
  MARK_ENTRY_TODO = 'MARK_ENTRY_TODO',
  CLEAR_DONE = 'CLEAR_DONE',
}

export interface EventData {
  event: EventType,
  entryId: string,
  sender?: string,
  isoDate: string,
  state: {
    name: string,
    /**
     * @deprecated done is deprecated since 23.11.2022. Just emit with {@link EventType} set to {@link EventType.MARK_ENTRY_DONE} or {@link EventType.MARK_ENTRY_TODO}
     */
    done?: boolean,
    oldIndex?: number,
    newIndex?: number,
  },
}

export interface LogEvent {
  listid: string,
  eventData: EventData
}

export type LogEventListenerData = LogEvent;
