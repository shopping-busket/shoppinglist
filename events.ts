export enum EventType {
  MOVE_ENTRY = 'MOVE_ENTRY',
  DELETE_ENTRY = 'DELETE_ENTRY',
  CREATE_ENTRY = 'CREATE_ENTRY',
  CHANGED_ENTRY_NAME = 'CHANGED_ENTRY_NAME',
  MARK_ENTRY_DONE = 'MARK_ENTRY_DONE',
  MARK_ENTRY_TODO = 'MARK_ENTRY_TODO',
}

export interface LogEvent {
  event: EventType,
  entryId: string,
  state: {
    name: string,
    /**
     * @deprecated done is deprecated since 23.11.2022. Just emit with {@link EventType} set to {@link EventType.MARK_ENTRY_DONE} or {@link EventType.MARK_ENTRY_TODO}
     */
    done?: boolean,
    aboveEntry?: string,
    belowEntry?: string,
    oldIndex?: number,
    newIndex?: number,
  },
  isoDate: string,
}

export interface LogEventListenerData {
  listid: string,
  eventData: LogEvent,
}
