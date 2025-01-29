export interface IImageUploadData {
  headerImagePath: string | null;
  headerImageAlt: string | null;
  headerImageNote: string | null;
}

export interface IRecipeStep extends IImageUploadData {
  id: number;
  recipeId: number;
  stepNumber: number;
  title: string;
  content: string;

  frontend?: {
    isEditing: boolean;
  };
}

export interface IRecipe extends IImageUploadData {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  owner: {
    uuid: string,
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
