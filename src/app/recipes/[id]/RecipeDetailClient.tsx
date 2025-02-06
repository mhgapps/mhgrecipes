"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRecipe } from "../../../graphql/queries";

type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  station?: string;
  concept?: string[];
  location?: string;
};

export default function RecipeDetailClient() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        // Retrieve the Amplify instance from the global window
        const AmplifyInstance = (window as any).AmplifyInstance;
        if (
          !AmplifyInstance ||
          !AmplifyInstance.API ||
          typeof AmplifyInstance.API.graphql !== "function"
        ) {
          throw new Error("Amplify instance not available");
        }
        const result: any = await AmplifyInstance.API.graphql({
          query: getRecipe,
          variables: { id },
        });
        setRecipe(result.data.getRecipe);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (loading) return <p>Loading recipe...</p>;
  if (!recipe) return <p>Recipe not found</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      <p className="mb-4">{recipe.description}</p>
      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.title} className="max-w-md my-4" />
      )}
      <p>
        <strong>Category:</strong> {recipe.category}
      </p>
      <p>
        <strong>Station:</strong> {recipe.station}
      </p>
      {recipe.concept && (
        <p>
          <strong>Concept:</strong> {recipe.concept.join(", ")}
        </p>
      )}
      <p>
        <strong>Location:</strong> {recipe.location}
      </p>
    </div>
  );
}
