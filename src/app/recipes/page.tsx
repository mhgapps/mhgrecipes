"use client";

import React, { useEffect, useState } from "react";
import { fetchRecipes } from "../../lib/recipeAPI";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Define the Recipe type
type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  location?: string;
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Build a list of unique categories from the recipes
  const categories = ["All", ...new Set(recipes.map((r) => r.category).filter(Boolean))];

  // Filter recipes based on the selected category
  const filteredRecipes =
    selectedCategory === "All"
      ? recipes
      : recipes.filter((r) => r.category === selectedCategory);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Recipe Carousel</h1>
      {loading ? (
        <p>Loading recipes...</p>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="category-select">Filter by Category: </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {filteredRecipes.length === 0 ? (
            <p>No recipes found.</p>
          ) : (
            <Swiper spaceBetween={30} slidesPerView={1}>
              {filteredRecipes.map((recipe) => (
                <SwiperSlide key={recipe.id}>
                  <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
                    <h2>{recipe.title}</h2>
                    <p>{recipe.description}</p>
                    {recipe.imageUrl && (
                      <img src={recipe.imageUrl} alt={recipe.title} style={{ width: "100%", height: "auto" }} />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </>
      )}
    </div>
  );
}
