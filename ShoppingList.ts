// eslint-disable-next-line max-classes-per-file
// @ts-ignore
// noinspection JSUnusedGlobalSymbols

import { v4 as uuidv4 } from 'uuid';

export interface IShoppingListItem {
  id: string,
  name: string,
}

export interface  LegacyShoppingListItem extends IShoppingListItem {
  done: boolean,
}

export interface IShoppingList {
  id: number,
  name: string,
  description: string,
  listid: string,
  owner: string,
  entries: IShoppingListItem[],
  checkedEntries: IShoppingListItem[],
  additional: {
    loading: boolean,
  },
}

interface ErrorConstructor {
  captureStackTrace(thisArg: any, func: any): void;
}

// eslint-disable-next-line max-classes-per-file
class ItemNotFoundError extends Error {
  private searchId?: string;

  /**
   * Create a new ItemNotFoundError. This Error is usually thrown if a list item cannot be found due to, for example, a wrong id.
   * @summary Usually thrown when an item can't be found inside a list.
   * @param searchId (can be null) Given uuid
   * @param message (default: "Unable to find item!")
   */
  constructor(searchId?: string, message = 'Unable to find item!') {
    super(message);

    (Error as unknown as ErrorConstructor).captureStackTrace(this, ItemNotFoundError);

    this.name = 'ItemNotFoundError';
    this.searchId = searchId;
  }
}

export interface AdditionalItemData {
  edit: boolean,
  editName: string,
  focused: boolean,
}

// eslint-disable-next-line no-use-before-define
export interface ShoppingListItemWithIndex extends ShoppingListItem {
  index: number,
}

export type EntryList = 'entries' | 'checkedEntries';

// eslint-disable-next-line max-classes-per-file
export class ShoppingListItem {
  public name: string;
  public id: string;
  public additional: AdditionalItemData;

  /**
   * Create a new list item without pushing it to a list's dict.
   @deprecated `done` param removed since April 5th, '23
   * @param name List item name
   * @param id (optional) When id is passed, none will be created.
   * @param additional (default: { edit: false, editName: name }) Additional data (only used by frontend)
   */
  constructor(name: string, id?: string, additional: AdditionalItemData = {
    edit: false,
    editName: name,
    focused: false,
  }) {
    this.name = name.trim();
    this.id = id ?? uuidv4();
    this.additional = additional;
  }
}

export default class ShoppingList {
  public name = '';
  public description = '';
  public listid = '';
  public owner = '';
  public entries: ShoppingListItem[] = [];
  public checkedEntries: ShoppingListItem[] = [];

  /**
   * Create a new list.
   * @param listId UUIDv4 of the list
   * @param name Name of the new list
   * @param description Description of the list
   * @param owner
   * @param entries (optional) Pass already existing [IShoppingListItems]
   * {@param checkedEntries @link IShoppingListItem} (optional) Pass already existing [IShoppingListItems] (only checked)
   */
  constructor(listId: string, name: string, description: string, owner?: string, entries?: IShoppingListItem[], checkedEntries?: IShoppingListItem[]) {
    this.name = name;
    this.description = description;
    this.listid = listId;
    this.owner = owner ?? '';

    // Convert database shopping list item type to class type
    entries?.forEach((t) => {
      this.entries.push(new ShoppingListItem(t.name, t.id));
    });

    checkedEntries?.forEach((t) => {
      this.checkedEntries.push(new ShoppingListItem(t.name, t.id));
    });
  }

  /**
   * Create a new ShoppingList instance from a IShoppingList interface
   * @param list Data to be used for creation
   */
  public static from(list: IShoppingList): ShoppingList {
    return new ShoppingList(list.listid, list.name, list.description, list.owner, list.entries, list.checkedEntries);
  }

  /**
   * Returns all entries (checked and todos)
   */
  get globalEntries(): ShoppingListItem[] {
    return [...this.entries, ...this.checkedEntries];
  }

  /**
   * Find entry from both {@link entries} and {@link checkedEntries}
   * @param predicate condition
   */
  public findEntryGlobal(predicate: (value: ShoppingListItem, index: number, obj: ShoppingListItem[]) => unknown): ShoppingListItemWithIndex | undefined {
    let index = -1;
    let entry;

    ['entries', 'checkedEntries'].every((k) => {
      entry = this[k as 'entries'].find((_v, _i, _obj) => {
        const condition = predicate(_v, _i, _obj);
        if (condition) index = _i;

        return condition;
      }) as ShoppingListItemWithIndex;

      if (entry === undefined) return true;
      entry.index = index;
      return false;
    });

    return entry;
  }

  /**
   * Mark item as done
   * @param id item id
   * @param check If true, will be marked as done, if not: will be marked as todo.
   */
  public checkItem(id: string, check: boolean): void {
    let i = -1;
    let item = this.entries.find((t, idx) => {
      i = idx;
      return t.id === id;
    });
    if (!item) {
      item = this.checkedEntries.find((t, idx) => {
        i = idx;
        return t.id === id;
      });
      if (!item) throw new ItemNotFoundError();
    }

    if (check) {
      console.log('condition 1');
      this.checkedEntries.push(item);
      this.entries.splice(i, 1);
    } else {
      console.log('condition 2');

      this.checkedEntries.splice(i, 1);
      this.entries.push(item);
    }
  }

  /**
   * Create a new list item and push it to the lists items.
   * @summary Create list item
   * @param name The name of the item.
   * @returns {ShoppingListItem} Shopping list item
   */
  public createItem(name: string): ShoppingListItem {
    const id = uuidv4();
    this.entries.unshift(new ShoppingListItem(name, id));

    const item = this.entries.find((t) => t.id === id);

    if (!item) throw new ItemNotFoundError(id);
    return item;
  }

  /**
   * Rename list item.
   * @throws {ItemNotFoundError} When the item can't be found.
   * @param id Item id
   * @param name New name
   */
  public renameItem(id: string, name: string): void {
    const item = this.entries.find((t) => t.id === id);
    if (!item) return;

    item.name = name;
  }

  /**
   * Clear list of items that are marked as done.
   * @return {IShoppingListItem[]} All the items marked as done before deletion, to, for example: push the values to log.
   */
  public clearDone(): IShoppingListItem[] {
    const del = this.checkedEntries;
    this.checkedEntries = [];

    return del;
  }

  /**
   * Convert class instance to interface
   * @param id database id
   */
  public toInterface(id: number): IShoppingList {
    return {
      id,
      name: this.name,
      description: this.description,
      listid: this.listid,
      owner: this.owner,
      entries: this.entries,
      checkedEntries: this.checkedEntries,
      additional: {
        loading: false,
      },
    };
  }
}
