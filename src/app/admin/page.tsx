"use client";

import { useRef, useState } from "react";
import { addRecipe } from "../../lib/recipeAPI";
import * as AmplifyStorage from "@aws-amplify/storage"; // Namespace import

// Other parts of your code remain unchanged.

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Sorted Category options
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
    "Seafood",
  ];
  const [category, setCategory] = useState(categoryOptions[0]);

  // Station options (alphabetical) as multi-select checkboxes
  const stationOptions = ["Grill", "Pasta", "Pizza", "Salad", "Sautee"];
  const [station, setStation] = useState<string[]>([]);

  // Concept options (alphabetical) as multi-select checkboxes
  const conceptOptions = ["Blu Pointe", "Beso", "Market Place", "Mercato", "MP Tavern"];
  const [concept, setConcept] = useState<string[]>([]);

  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        // Cast the imported storage module to any to bypass TS type errors.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const storage: any = AmplifyStorage;
        const result = await storage.put(file.name, file, {
          contentType: file.type,
        });
        const url = await storage.get(result.key);
        setImageUrl(url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

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
    setMessage("Submitting...");
    try {
      const recipe = { title, description, category, station, imageUrl, concept };
      const newRecipe = await addRecipe(recipe);
      setMessage("Recipe added: " + newRecipe.title);
      setTitle("");
      setDescription("");
      setCategory(categoryOptions[0]);
      setStation([]);
      setConcept([]);
      setImageUrl("");
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin - Add Recipe</h1>
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
        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Image:</label>
          <button
            type="button"
            onClick={handleUploadButtonClick}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Upload Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
          />
          {imageUrl && (
            <div className="mt-2">
              <img src={imageUrl} alt="Preview" className="max-w-xs" />
            </div>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Recipe
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
