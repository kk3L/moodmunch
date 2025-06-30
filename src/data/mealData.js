// Replace the entire file content with improved API integration

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

// Distinct mood to cuisine/diet mapping - each mood has very specific parameters
const moodToCuisineMap = {
  lazy: {
    tags: "quick,easy,30-minutes-or-less,one-pot",
    maxReadyTime: 30,
    type: "main course",
    cuisine: "american,italian",
    excludeCuisine: "indian,thai,korean,japanese",
    sort: "time",
  },
  healthy: {
    tags: "healthy,low-calorie,vegetarian,superfood",
    diet: "vegetarian",
    type: "salad,main course",
    excludeCuisine: "american,southern",
    minProtein: 10,
    sort: "healthiness",
  },
  broke: {
    tags: "cheap,budget,pasta,rice",
    maxReadyTime: 45,
    type: "main course",
    cuisine: "italian,american",
    excludeIngredients: "lobster,caviar,truffle,salmon",
    sort: "price",
  },
  fancy: {
    tags: "gourmet,elegant,restaurant-style,sophisticated",
    cuisine: "french,mediterranean,italian",
    type: "main course,appetizer",
    minReadyTime: 45,
    excludeCuisine: "american,fast-food",
    sort: "popularity",
  },
  comfort: {
    tags: "comfort-food,hearty,warm,homestyle",
    cuisine: "american,southern,british",
    type: "main course,soup",
    excludeCuisine: "asian,indian,mexican",
    sort: "popularity",
  },
  adventurous: {
    cuisine: "thai,indian,korean,japanese,moroccan,ethiopian",
    tags: "spicy,exotic,ethnic,authentic",
    type: "main course",
    excludeCuisine: "american,italian,french",
    sort: "random",
  },
}

// Distinct weather to recipe type mapping
const weatherToRecipeMap = {
  hot: {
    tags: "cold,refreshing,no-cook,summer,chilled",
    type: "salad,beverage,dessert,appetizer",
    excludeIngredients: "soup,stew,hot",
    maxReadyTime: 30,
    excludeCuisine: "indian,thai",
    sort: "time",
  },
  cold: {
    tags: "warm,hot,winter,hearty,soup",
    type: "soup,stew,main course",
    excludeIngredients: "ice-cream,salad,cold",
    minReadyTime: 30,
    cuisine: "american,italian,french",
    sort: "time",
  },
  rainy: {
    tags: "comfort-food,warm,cozy,indoor,baking",
    type: "soup,dessert,main course,bread",
    cuisine: "american,british,french",
    excludeCuisine: "thai,indian,mexican,asian",
    sort: "popularity",
  },
  mild: {
    tags: "fresh,light,balanced,spring",
    type: "main course,side dish,salad",
    cuisine: "mediterranean,italian,greek",
    excludeIngredients: "heavy-cream,butter",
    sort: "healthiness",
  },
}

export const getMoodBasedMeals = async (mood) => {
  const params = moodToCuisineMap[mood]
  if (!params) return []

  // Add unique timestamp and mood-specific offset for diversity
  const offset = Math.floor(Math.random() * 50)
  const queryParams = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    number: 8,
    offset: offset,
    addRecipeInformation: true,
    fillIngredients: true,
    ...params,
  })

  const url = `${BASE_URL}/complexSearch?${queryParams}`
  const cacheKey = `mood-${mood}-${Date.now()}-${Math.random()}`

  const data = await fetchWithCache(url, cacheKey)

  if (!data.results) return []

  return data.results.slice(0, 6).map((recipe) => ({
    id: `mood-${mood}-${recipe.id}`,
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
  }))
}

export const getWeatherBasedMeals = async (weather) => {
  const params = weatherToRecipeMap[weather]
  if (!params) return []

  // Add unique timestamp and weather-specific offset for diversity
  const offset = Math.floor(Math.random() * 100) + 50 // Different offset range
  const queryParams = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    number: 8,
    offset: offset,
    addRecipeInformation: true,
    fillIngredients: true,
    ...params,
  })

  const url = `${BASE_URL}/complexSearch?${queryParams}`
  const cacheKey = `weather-${weather}-${Date.now()}-${Math.random()}`

  const data = await fetchWithCache(url, cacheKey)

  if (!data.results) return []

  return data.results.slice(0, 6).map((recipe) => ({
    id: `weather-${weather}-${recipe.id}`,
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
  }))
}

export const getRandomMeal = async () => {
  // Use completely different endpoint for random meals
  const queryParams = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    number: 1,
    addRecipeInformation: true,
    fillIngredients: true,
  })

  const url = `${BASE_URL}/random?${queryParams}`
  const cacheKey = `random-${Date.now()}-${Math.random()}`

  const data = await fetchWithCache(url, cacheKey)

  if (data.recipes && data.recipes.length > 0) {
    const recipe = data.recipes[0]
    return {
      id: `random-${recipe.id}`,
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
