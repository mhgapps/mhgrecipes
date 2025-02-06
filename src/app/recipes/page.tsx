"use client";

import { useEffect, useState } from "react";
import { fetchRecipes } from "../../lib/recipeAPI";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

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

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await fetchRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = ["All", ...new Set(recipes.map((r) => r.category).filter(Boolean))];

  const filteredRecipes =
    selectedCategory === "All"
      ? recipes
      : recipes.filter((r) => r.category === selectedCategory);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recipe Carousel</h1>
      {loading ? (
        <p>Loading recipes...</p>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="category-select" className="mr-2">
              Filter by Category:
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded p-1"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {filteredRecipes.length === 0 ? (
            <p>No recipes found for this category.</p>
          ) : (
            <Swiper spaceBetween={30} slidesPerView={1}>
              {filteredRecipes.map((recipe) => (
                <SwiperSlide key={recipe.id}>
                  <div className="p-4 border rounded">
                    <h2 className="text-xl font-semibold">{recipe.title}</h2>
                    <p>{recipe.description}</p>
                    {recipe.imageUrl && (
                      <div className="mt-2 relative w-full h-64">
                        <Image
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
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
