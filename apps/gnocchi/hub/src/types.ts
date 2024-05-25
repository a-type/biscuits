export interface HubRecipeData {
  id: string;
  title: string;
  prelude: any;
  mainImageUrl: string;
  ingredients: any[];
  instructions: any[];
  publisher: {
    fullName: string;
  };
}
