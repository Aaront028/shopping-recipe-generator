"use client"

import { useState, useEffect } from 'react'
import { Plus, Trash, RefreshCw, ChefHat, ShoppingCart, Edit, Search, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, addDays, isBefore, isAfter } from 'date-fns'
import React from 'react'
import { useMediaQuery } from "@/hooks/use-media-query"

const categories = ["Produce", "Meat", "Dairy", "Grains", "Other"]
const units = ["piece(s)", "g", "kg", "ml", "l", "cup(s)", "tbsp", "tsp", "oz", "lb", "bunch(es)"]

// Function to fetch recipes from MealDB API
const fetchRecipes = async (ingredients: InventoryItem[]) => {
  const recipes = []
  for (const ingredient of ingredients) {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient.name}`
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch recipes')
      }
      const data = await response.json()
      if (data.meals) {
        recipes.push(...data.meals)
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
    }
  }
  return recipes
}

// Function to fetch recipe details from MealDB API
const fetchRecipeDetails = async (recipeId: string) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch recipe details')
    }
    const data = await response.json()
    return data.meals[0]
  } catch (error) {
    console.error('Error fetching recipe details:', error)
    return null
  }
}

const getAppropriateUnit = (itemName: string, category: string) => {
  const lowerName = itemName.toLowerCase()
  if (category === "Produce") {
    if (lowerName.includes("berry") || lowerName.includes("grape")) return "cup(s)"
    if (lowerName.includes("lettuce") || lowerName.includes("cabbage")) return "head(s)"
    if (lowerName.includes("herb") || lowerName.includes("spinach") || lowerName.includes("kale")) return "bunch(es)"
    return "piece(s)"
  }
  if (category === "Meat") return "g"
  if (category === "Dairy") {
    if (lowerName.includes("milk") || lowerName.includes("cream")) return "ml"
    if (lowerName.includes("cheese")) return "g"
    if (lowerName.includes("yogurt")) return "g"
    return "piece(s)"
  }
  if (category === "Grains") {
    if (lowerName.includes("flour") || lowerName.includes("rice")) return "g"
    if (lowerName.includes("bread")) return "slice(s)"
    return "g"
  }
  return "piece(s)"
}
interface ShoppingItem {
  id: number
  name: string
  quantity: number
  category: string
  checked: boolean
  unit: string
}

interface InventoryItem {
  id: number
  name: string
  quantity: number
  category: string
  unit: string
  expirationDate: string
}

interface Recipe {
  idMeal: string
  strMeal: string
  details?: {
    [key: string]: string
  }
  matchedIngredients?: number
  totalIngredients?: number
}

export default function ShoppingApp() {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([])
  const [newItem, setNewItem] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState(1)
  const [newItemCategory, setNewItemCategory] = useState("Other")
  const [newItemUnit, setNewItemUnit] = useState("piece(s)")
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([])
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const recipesPerPage = 5

  useEffect(() => {
    fetchShoppingList();
    fetchInventory();
  }, []);

  const fetchShoppingList = async () => {
    try {
      const response = await fetch('/api/shopping-list');
      if (!response.ok) {
        throw new Error('Failed to fetch shopping list');
      }
      const data = await response.json();
      console.log('Fetched shopping list:', data);
      if (Array.isArray(data)) {
        setShoppingList(data);
      } else {
        console.error('Fetched shopping list is not an array:', data);
        setShoppingList([]);
      }
    } catch (error) {
      console.error('Error fetching shopping list:', error);
      setShoppingList([]);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      const data = await response.json();
      console.log('Fetched inventory data:', data); // Add this line
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  useEffect(() => {
    if (newItem && newItemCategory) {
      const suggestedUnit = getAppropriateUnit(newItem, newItemCategory)
      setNewItemUnit(suggestedUnit)
    }
  }, [newItem, newItemCategory])

  const addItem = async () => {
    if (newItem.trim() !== "") {
      const item = {
        name: newItem,
        quantity: newItemQuantity,
        category: newItemCategory,
        checked: false,
        unit: newItemUnit
        // Note: We're not including userId here
      };
      try {
        const response = await fetch('/api/shopping-list', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newItemWithId = await response.json();
        setShoppingList(prevList => [...prevList, newItemWithId]);
        setNewItem("");
        setNewItemQuantity(1);
        setNewItemCategory("Other");
        setNewItemUnit("piece(s)");
      } catch (error) {
        console.error("Error adding item:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  const toggleItem = async (id: number, checked: boolean) => {
    try {
      console.log('Sending PUT request with id:', id, 'and checked:', checked);
      const response = await fetch('/api/shopping-list', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, checked }),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update item');
      }

      setShoppingList(prevList =>
        prevList.map(item =>
          item.id === id ? { ...item, checked } : item
        )
      );
    } catch (error) {
      console.error('Error toggling item:', error);
      // You might want to show an error message to the user here
    }
  };

  const removeItem = async (id: number) => {
    await fetch('/api/shopping-list', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setShoppingList(prevList => prevList.filter(item => item.id !== id));
  };

  const clearList = async () => {
    for (const item of shoppingList) {
      await fetch('/api/shopping-list', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });
    }
    fetchShoppingList();
  };

  const suggestRecipes = async () => {
    setIsLoadingRecipes(true)
    const availableIngredients = inventory.filter(item => item.quantity > 0)

    try {
      const recipes = await fetchRecipes(availableIngredients)
      const uniqueRecipes = Array.from(new Set(recipes.map((r: Recipe) => r.idMeal)))
        .map(id => recipes.find((r: Recipe) => r.idMeal === id))

      const recipesWithDetails = await Promise.all(
        uniqueRecipes.slice(0, 20).map(async (recipe: Recipe) => {
          const details = await fetchRecipeDetails(recipe.idMeal)
          return { ...recipe, details }
        })
      )

      const recipesWithIngredientMatch = recipesWithDetails.map(recipe => {
        const recipeIngredients = Array.from({ length: 20 }, (_, i) => i + 1)
          .map(i => recipe.details[`strIngredient${i}`])
          .filter(Boolean)
          .map(ing => ing.toLowerCase())

        const matchedIngredients = availableIngredients.filter(item =>
          recipeIngredients.some(ing => ing.includes(item.name.toLowerCase()))
        )

        return {
          ...recipe,
          matchedIngredients: matchedIngredients.length,
          totalIngredients: recipeIngredients.length
        }
      })

      const sortedRecipes = recipesWithIngredientMatch.sort((a, b) =>
        (b.matchedIngredients ?? 0) - (a.matchedIngredients ?? 0) ||
        (a.totalIngredients ?? 0) - (b.totalIngredients ?? 0)
      )

      setSuggestedRecipes(sortedRecipes)
      setCurrentPage(1)
    } catch (error) {
      console.error("Error generating recipes:", error)
    } finally {
      setIsLoadingRecipes(false)
    }
  }

  const handleUseRecipe = async (recipe: Recipe) => {
    const updatedInventory = inventory.map(item => {
      const recipeIngredient = recipe.details && Array.from({ length: 20 }, (_, i) => i + 1)
        .map(i => ({
          name: recipe.details?.[`strIngredient${i}`] ?? '',
          measure: recipe.details?.[`strMeasure${i}`] ?? ''
        }))
        .find(ing => ing.name && ing.name.toLowerCase().includes(item.name.toLowerCase()))

      if (recipeIngredient) {
        // This is a simplified approach. In a real app, you'd need to handle unit conversions and parsing of measures.
        return { ...item, quantity: Math.max(0, item.quantity - 1) }
      }
      return item
    })

    // Update the database for each changed item
    for (const item of updatedInventory) {
      const originalItem = inventory.find(i => i.id === item.id)
      if (originalItem && originalItem.quantity !== item.quantity) {
        await fetch('/api/inventory', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: item.id,
            quantity: item.quantity,
          }),
        })
      }
    }

    // Fetch the updated inventory from the server
    await fetchInventory()
  }

  const addToInventory = async () => {
    const checkedItems = shoppingList.filter(item => item.checked);
    for (const item of checkedItems) {
      const existingItem = inventory.find(invItem =>
        invItem.name.toLowerCase() === item.name.toLowerCase() &&
        invItem.unit === item.unit
      );
      if (existingItem) {
        await fetch('/api/inventory', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: existingItem.id,
            quantity: existingItem.quantity + item.quantity,
          }),
        });
      } else {
        await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: item.name,
            quantity: item.quantity,
            category: item.category,
            unit: item.unit,
            expirationDate: addDays(new Date(), 7).toISOString(),
          }),
        });
      }
      await fetch('/api/shopping-list', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });
    }
    fetchShoppingList();
    fetchInventory();
  };

  const startEditingItem = (item: InventoryItem) => {
    setEditingItem({ ...item })
  }

  const saveEditedItem = async () => {
    if (editingItem) {
      await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      fetchInventory();
      setEditingItem(null);
    }
  };

  const filteredInventory = Array.isArray(inventory)
    ? inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  console.log('Filtered inventory:', filteredInventory); // Add this line

  const filteredRecipes = suggestedRecipes.filter(recipe =>
    recipe.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isExpiringSoon = (date: string) => {
    const expirationDate = new Date(date)
    const today = new Date()
    const threeDaysFromNow = addDays(today, 3)
    return isAfter(expirationDate, today) && isBefore(expirationDate, threeDaysFromNow)
  }

  const isExpired = (date: string) => {
    const expirationDate = new Date(date)
    const today = new Date()
    return isBefore(expirationDate, today)
  }

  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  )

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage)

  // Add this hook to detect mobile screens
  const isMobile = useMediaQuery("(max-width: 640px)")

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Shopping List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'flex-row space-x-2'} mb-4`}>
            <Input
              type="text"
              value={newItem}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(e.target.value)}
              placeholder="Add new item"
              className={`${isMobile ? 'w-full' : 'flex-grow'}`}
            />
            <Input
              type="number"
              value={newItemQuantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItemQuantity(parseInt(e.target.value))}
              placeholder="Qty"
              className={`${isMobile ? 'w-full' : 'w-20'}`}
              min="1"
            />
            <Select value={newItemCategory} onValueChange={setNewItemCategory}>
              <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[140px]'}`}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={newItemUnit} onValueChange={setNewItemUnit}>
              <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[140px]'}`}>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map(unit => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addItem} className={`${isMobile ? 'w-full' : 'whitespace-nowrap'}`}>
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </div>
          <ul>
            {Array.isArray(shoppingList) ? (
              shoppingList.map((item) => (
                <li key={item.id} className="flex items-center mb-2 flex-wrap">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id, !item.checked)}
                    className="mr-2"
                  />
                  <span className={`${item.checked ? "line-through" : ""} flex-grow`}>
                    {item.name}
                  </span>
                  <span className="text-sm text-gray-500 mr-2">
                    {item.quantity} {item.unit}, {item.category}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </li>
              ))
            ) : (
              <li>No items in the shopping list</li>
            )}
          </ul>
          <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between'} mt-4`}>
            <Button variant="outline" onClick={clearList} className={`${isMobile ? 'w-full' : ''}`}>
              <RefreshCw className="w-4 h-4 mr-2" /> Clear List
            </Button>
            <Button onClick={addToInventory} className={`${isMobile ? 'w-full' : ''}`}>
              <ShoppingCart className="w-4 h-4 mr-2" /> Add to Inventory
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center">
            <Search className="w-4 h-4 mr-2" />
            <Input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={`${isMobile ? 'overflow-x-auto' : ''}`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id} className={
                    isExpired(item.expirationDate) ? "bg-red-100" :
                      isExpiringSoon(item.expirationDate) ? "bg-yellow-100" : ""
                  }>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      {format(new Date(item.expirationDate), 'MMM dd, yyyy')}
                      {isExpiringSoon(item.expirationDate) && !isExpired(item.expirationDate) && (
                        <AlertTriangle className="inline-block ml-2 text-yellow-500" />
                      )}
                      {isExpired(item.expirationDate) && (
                        <AlertTriangle className="inline-block ml-2 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => startEditingItem(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Inventory Item</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value={editingItem?.name || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingItem(editingItem ? { ...editingItem, name: e.target.value } : null)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="quantity" className="text-right">
                                Quantity
                              </Label>
                              <Input
                                id="quantity"
                                type="number"
                                value={editingItem?.quantity || 0}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingItem(editingItem ? { ...editingItem, quantity: parseInt(e.target.value) } : null)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="unit" className="text-right">
                                Unit
                              </Label>
                              <Select
                                value={editingItem?.unit || 'piece(s)'}
                                onValueChange={(value: string) => setEditingItem(editingItem ? { ...editingItem, unit: value } : null)}
                              >
                                <SelectTrigger className="w-[180px] col-span-3">
                                  <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {units.map(unit => (
                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="category" className="text-right">
                                Category
                              </Label>
                              <Select
                                value={editingItem?.category || 'Other'}
                                onValueChange={(value: string) => setEditingItem(editingItem ? { ...editingItem, category: value } : null)}
                              >
                                <SelectTrigger className="w-[180px] col-span-3">
                                  <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="expirationDate" className="text-right">
                                Expiration Date
                              </Label>
                              <Input
                                id="expirationDate"
                                type="date"
                                value={editingItem?.expirationDate ? format(new Date(editingItem.expirationDate), 'yyyy-MM-dd') : ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingItem(editingItem ? { ...editingItem, expirationDate: new Date(e.target.value).toISOString() } : null)}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <Button onClick={saveEditedItem}>Save Changes</Button>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recipe Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center">
            <Search className="w-4 h-4 mr-2" />
            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={suggestRecipes} className={`mb-4 ${isMobile ? 'w-full' : ''}`} disabled={isLoadingRecipes}>
            {isLoadingRecipes ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Loading Recipes
              </>
            ) : (
              <>
                <ChefHat className="w-4 h-4 mr-2" /> Suggest Recipes
              </>
            )}
          </Button>
          {paginatedRecipes.length > 0 ? (
            <>
              <ul>
                {paginatedRecipes.map((recipe) => (
                  <li key={recipe.idMeal} className="mb-8 p-6 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-semibold">{recipe.strMeal}</h3>
                      <span className={`px-2 py-1 rounded-full text-sm ${recipe.matchedIngredients === recipe.totalIngredients ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {recipe.matchedIngredients} / {recipe.totalIngredients} ingredients available
                      </span>
                    </div>
                    {recipe.details && (
                      <div>
                        <h4 className="text-lg font-medium mb-2">Ingredients:</h4>
                        <ul className="list-disc list-inside mb-4">
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((i) => {
                            const ingredient = recipe.details?.[`strIngredient${i}`]
                            const measure = recipe.details?.[`strMeasure${i}`]
                            if (ingredient && measure) {
                              const isAvailable = inventory.some(item =>
                                ingredient.toLowerCase().includes(item.name.toLowerCase())
                              )
                              return (
                                <li key={i} className={isAvailable ? "text-green-600" : "text-red-500"}>
                                  {`${measure} ${ingredient}`} {isAvailable ? "(available)" : "(missing)"}
                                </li>
                              )
                            }
                            return null
                          }).filter(Boolean)}
                        </ul>
                        <h4 className="text-lg font-medium mb-2">Instructions:</h4>
                        <p>{recipe.details.strInstructions}</p>
                      </div>
                    )}
                    <Button onClick={() => handleUseRecipe(recipe)} size="sm" className="mt-4">
                      Use Recipe
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          ) : (
            <p>No recipes suggested yet. Click &quot;Suggest Recipes&quot; to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}