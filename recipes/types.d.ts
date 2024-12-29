export const enum ERecipeComponentType {
  ul= 'ul',
  'ol'= 'ol',
  'text'= 'text',
  'subtitle'= 'subtitle',
  'image'= 'image',
}

export interface IRecipeComponent {
  id: number;
  recipeId: number;
  type: ERecipeComponentType;
  content?: string;
  listContent?: string[];
  note?: string;
  sortingOrder: number;
}

export interface IRecipe {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  owner: {
    fullName: string;
    avatarURI?: string;
  };
  // Server joins recipe components when excludeComponents is false
  components?: IRecipeComponent[];
}

export interface IIngredient {
  id: number;
  recipeId: number;
  name: string;
  hint?: string;
  amount?: number;
  unit?: string;
}
