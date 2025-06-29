// Replace the entire file content with real Spoonacular API integration

const SPOONACULAR_API_KEY = "edfe4886a1cb4d309e16288a81219424"
const BASE_URL = "https://api.spoonacular.com/recipes"

// Cache for API responses to avoid excessive calls
const cache = new Map()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

// Helper function to make API calls with caching
async function fetchWithCache(url, cacheKey) {
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    })

    return data
  } catch (error) {
    console.error("API Error:", error)
    // Return fallback data if API fails
    return getFallbackData(cacheKey)
  }
}

// Mood to cuisine/diet mapping
const moodToCuisineMap = {
  lazy: { tags: "quick,easy", maxReadyTime: 30, type: "main course" },
  healthy: { tags: "healthy,low-calorie", diet: "vegetarian", type: "main course" },
  broke: { tags: "cheap,budget", maxReadyTime: 45, type: "main course" },
  fancy: { tags: "expensive,gourmet", cuisine: "french,italian", type: "main course" },
  comfort: { tags: "comfort-food", cuisine: "american", type: "main course" },
  adventurous: { cuisine: "thai,indian,mexican,korean", tags: "spicy", type: "main course" },
}

// Weather to recipe type mapping
const weatherToRecipeMap = {
  hot: { tags: "cold,refreshing,salad", type: "salad,beverage" },
  cold: { tags: "warm,soup,stew", type: "soup,main course" },
  rainy: { tags: "comfort-food,warm", type: "soup,main course" },
  mild: { tags: "fresh,light", type: "main course,side dish" },
}

export const getMoodBasedMeals = async (mood) => {
  const params = moodToCuisineMap[mood]
  if (!params) return []

  const queryParams = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    number: 6,
    addRecipeInformation: true,
    fillIngredients: true,
    ...params,
  })

  const url = `${BASE_URL}/complexSearch?${queryParams}`
  const cacheKey = `mood-${mood}`

  const data = await fetchWithCache(url, cacheKey)

  return (
    data.results?.map((recipe) => ({
      id: `spoon-${recipe.id}`,
      name: recipe.title,
      description: recipe.summary
        ? recipe.summary.replace(/<[^>]*>/g, "").substring(0, 120) + "..."
        : `Delicious ${recipe.title.toLowerCase()} perfect for when you're feeling ${mood}!`,
      recipeUrl:
        recipe.sourceUrl ||
        `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-").toLowerCase()}-${recipe.id}`,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      category: mood,
      spoonacularId: recipe.id,
    })) || []
  )
}

export const getWeatherBasedMeals = async (weather) => {
  const params = weatherToRecipeMap[weather]
  if (!params) return []

  const queryParams = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    number: 6,
    addRecipeInformation: true,
    fillIngredients: true,
    ...params,
  })

  const url = `${BASE_URL}/complexSearch?${queryParams}`
  const cacheKey = `weather-${weather}`

  const data = await fetchWithCache(url, cacheKey)

  return (
    data.results?.map((recipe) => ({
      id: `spoon-${recipe.id}`,
      name: recipe.title,
      description: recipe.summary
        ? recipe.summary.replace(/<[^>]*>/g, "").substring(0, 120) + "..."
        : `Perfect ${recipe.title.toLowerCase()} for ${weather} weather!`,
      recipeUrl:
        recipe.sourceUrl ||
        `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-").toLowerCase()}-${recipe.id}`,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      category: weather,
      spoonacularId: recipe.id,
    })) || []
  )
}

export const getRandomMeal = async () => {
  const queryParams = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    number: 1,
    addRecipeInformation: true,
    fillIngredients: true,
  })

  const url = `${BASE_URL}/random?${queryParams}`
  const cacheKey = `random-${Date.now()}`

  const data = await fetchWithCache(url, cacheKey)

  if (data.recipes && data.recipes.length > 0) {
    const recipe = data.recipes[0]
    return {
      id: `spoon-${recipe.id}`,
      name: recipe.title,
      description: recipe.summary
        ? recipe.summary.replace(/<[^>]*>/g, "").substring(0, 120) + "..."
        : `A delicious ${recipe.title.toLowerCase()} chosen just for you!`,
      recipeUrl:
        recipe.sourceUrl ||
        `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-").toLowerCase()}-${recipe.id}`,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      category: "random",
      spoonacularId: recipe.id,
    }
  }

  return null
}

// Fallback data in case API fails
function getFallbackData(cacheKey) {
  const fallbackMeals = {
    "mood-lazy": [
      {
        id: "fallback-1",
        name: "Quick Pasta",
        description: "Simple pasta dish ready in minutes",
        recipeUrl: "https://spoonacular.com",
        category: "lazy",
      },
    ],
    "mood-healthy": [
      {
        id: "fallback-2",
        name: "Green Salad",
        description: "Fresh and healthy salad",
        recipeUrl: "https://spoonacular.com",
        category: "healthy",
      },
    ],
  }

  return { results: fallbackMeals[cacheKey] || [] }
}

// Get detailed recipe information
export const getRecipeDetails = async (spoonacularId) => {
  const queryParams = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    includeNutrition: true,
  })

  const url = `${BASE_URL}/${spoonacularId}/information?${queryParams}`
  const cacheKey = `recipe-${spoonacularId}`

  return await fetchWithCache(url, cacheKey)
}
