"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRecipe } from "../../../graphql/queries";
import { updateExistingRecipe } from "../../../lib/recipeAPI";

type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  station?: string[];
  concept?: string[];
  location?: string;
};

export default function EditRecipePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fields for editing
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [station, setStation] = useState<string[]>([]);
  const [concept, setConcept] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");

  // Options (sorted alphabetically)
  const categoryOptions = [
    "Appetizers",
    "Bowls",
    "Brunch",
    "Classics",
    "Desserts",
    "Hand-Helds",
    "Meat & Poultry",
    "Pasta",
    "Pizza",
    "Salads",
    "Seafood"
  ];
  const stationOptions = ["Grill", "Pasta", "Pizza", "Salad", "Sautee"];
  const conceptOptions = ["Beso", "Blu Pointe", "Market Place", "Mercato", "MP Tavern"];

  useEffect(() => {
    async function fetchRecipe() {
      try {
        // Use the global Amplify instance stored earlier.
        const AmplifyInstance = (window as any).AmplifyInstance;
        if (!AmplifyInstance) {
          throw new Error("Amplify instance not available");
        }
        const result: any = await AmplifyInstance.API.graphql({
          query: getRecipe,
          variables: { id }
        });
        const fetchedRecipe: Recipe = result.data.getRecipe;
        setTitle(fetchedRecipe.title);
        setDescription(fetchedRecipe.description);
        setCategory(fetchedRecipe.category || categoryOptions[0]);
        setStation(fetchedRecipe.station || []);
        setConcept(fetchedRecipe.concept || []);
        setImageUrl(fetchedRecipe.imageUrl || "");
        setLocation(fetchedRecipe.location || "");
      } catch (error: any) {
        console.error("Error fetching recipe:", error);
        setMessage("Error fetching recipe");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    option: string,
    currentSelections: string[],
    setSelections: (sel: string[]) => void
  ) => {
    if (e.target.checked) {
      setSelections([...currentSelections, option]);
    } else {
      setSelections(currentSelections.filter((item) => item !== option));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Updating...");
    try {
      const updated = await updateExistingRecipe({
        id,
        title,
        description,
        category,
        station,
        concept,
        imageUrl,
        location
      });
      setMessage("Recipe updated: " + updated.title);
      router.push("/admin");
    } catch (error: any) {
      console.error("Error updating recipe:", error);
      setMessage("Error updating recipe");
    }
  };

  if (loading) return <p>Loading recipe...</p>;
  if (!title) return <p>Recipe not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        {/* Category Dropdown */}
        <div>
          <label className="block font-medium mb-1">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded p-2"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {/* Station Checkboxes */}
        <div>
          <label className="block font-medium mb-1">Station:</label>
          <div className="flex space-x-4">
            {stationOptions.map((option) => (
              <label key={option} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={station.includes(option)}
                  onChange={(e) =>
                    handleCheckboxChange(e, option, station, setStation)
                  }
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Concept Checkboxes */}
        <div>
          <label className="block font-medium mb-1">Concept:</label>
          <div className="flex space-x-4">
            {conceptOptions.map((option) => (
              <label key={option} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={concept.includes(option)}
                  onChange={(e) =>
                    handleCheckboxChange(e, option, concept, setConcept)
                  }
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Image URL (read-only) */}
        <div>
          <label className="block font-medium mb-1">Image URL:</label>
          <input
            type="text"
            value={imageUrl}
            readOnly
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>
        {/* Location/Concept field */}
        <div>
          <label className="block font-medium mb-1">Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Recipe
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
