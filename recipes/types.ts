export interface IRecipeStep {
  id: number;
  recipeId: number;
  stepNumber: number;
  title: string;
  content: string;

  headerImagePath?: string;
  headerImageAlt?: string;
  headerImageNote?: string;
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
}

export enum CrudFlag {
  CREATE,
  READ,
  UPDATE,
  DELETE
}

export interface IIngredient {
  id: number;
  recipeId: number;
  name: string;
  hint?: string;
  amount?: number;
  unit?: string;
  flag?: CrudFlag;
}
