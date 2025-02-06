import { listRecipes } from "../graphql/queries";
import { createRecipe, updateRecipe, deleteRecipe } from "../graphql/mutations";

const waitForAmplifyInstance = () => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 600; // 20 seconds (200 * 100ms)
    const interval = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        window.AmplifyInstance &&
        window.AmplifyInstance.API &&
        typeof window.AmplifyInstance.API.graphql === "function"
      ) {
        clearInterval(interval);
        resolve(window.AmplifyInstance.API);
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error("Amplify instance not available"));
        }
      }
    }, 100);
  });
};

export const fetchRecipes = async () => {
  try {
    const API = await waitForAmplifyInstance();
    const recipeData = await API.graphql({ query: listRecipes });
    return recipeData.data.listRecipes.items;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

export const addRecipe = async (recipe) => {
  try {
    const API = await waitForAmplifyInstance();
    const newRecipe = await API.graphql({
      query: createRecipe,
      variables: { input: recipe },
    });
    return newRecipe.data.createRecipe;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
};

export const updateExistingRecipe = async (recipe) => {
  try {
    const API = await waitForAmplifyInstance();
    const updatedRecipe = await API.graphql({
      query: updateRecipe,
      variables: { input: recipe },
    });
    return updatedRecipe.data.updateRecipe;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

export const removeRecipe = async (recipeId) => {
  try {
    const API = await waitForAmplifyInstance();
    const deletedRecipe = await API.graphql({
      query: deleteRecipe,
      variables: { input: { id: recipeId } },
    });
    return deletedRecipe.data.deleteRecipe;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};
