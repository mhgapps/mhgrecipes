// Do NOT include "use client" here.

export async function generateStaticParams() {
    // For now, return a dummy static parameter.
    return [{ id: "1" }];
  }
  
  import RecipeDetailClient from "./RecipeDetailClient";
  
  export default function RecipeDetailPage() {
    return <RecipeDetailClient />;
  }
  