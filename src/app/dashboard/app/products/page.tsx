'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { ImageUpload } from '@/components/ImageUpload'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, MoreHorizontal, Image as ImageIcon, X, Upload, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFlag, setFilterFlag] = useState<string>('All')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [dynamicCategories, setDynamicCategories] = useState<{label: string}[]>([])
  
  // Basic Info
  const [productName, setProductName] = useState('')
  const [productDesc, setProductDesc] = useState('')
  const [category, setCategory] = useState('Pickles')
  const [subCategory, setSubCategory] = useState('')
  const [isBestSeller, setIsBestSeller] = useState(false)
  const [isMostLoved, setIsMostLoved] = useState(false)
  const [isFreshPick, setIsFreshPick] = useState(false)
  const [isOutOfStock, setIsOutOfStock] = useState(false)
  const [isVeg, setIsVeg] = useState(true)
  const [stockCount, setStockCount] = useState<number>(100)
  const [rating, setRating] = useState('0')
  const [images, setImages] = useState<string[]>([])
  const [storyImage, setStoryImage] = useState<string>('')
  const [gallery, setGallery] = useState<string[]>([])
  const [color, setColor] = useState('0xFF18453B')
  const [canRequestTempering, setCanRequestTempering] = useState(false)
  
  // Pricing & Inventory
  const [weightPriceEntries, setWeightPriceEntries] = useState([{ weight: '250g', price: '' }])
  
  // Behind the Jar
  const defaultBehindTheJar = [
    { title: 'Origin', subtitle: '', description: '' },
    { title: 'Process', subtitle: '', description: '' },
    { title: 'Prepared In', subtitle: '', description: '' },
    { title: 'Storage', subtitle: '', description: '' },
    { title: 'Shelf Life', subtitle: '', description: '' },
  ];
  const [behindTheJar, setBehindTheJar] = useState(defaultBehindTheJar);

  const [origin, setOrigin] = useState('')
  const [preparationMethod, setPreparationMethod] = useState('')
  const [storageInstructions, setStorageInstructions] = useState('')
  const [servingSuggestion, setServingSuggestion] = useState('')
  const [shelfLife, setShelfLife] = useState('')
  const [trustBadges, setTrustBadges] = useState<string[]>([])
  const [artisanName, setArtisanName] = useState('')
  const [artisanImage, setArtisanImage] = useState('')
  const [artisanDescription, setArtisanDescription] = useState('')
  const [recipes, setRecipes] = useState<{image?: string, title: string, instruction: string}[]>([])

  // Ingredients & Pairings
  const [ingredients, setIngredients] = useState<{name: string, image: string}[]>([])
  const [secretIngredient, setSecretIngredient] = useState({ name: '', description: '', image: '' })
  const [pairings, setPairings] = useState<string[]>([])
  const [sommelierPairings, setSommelierPairings] = useState<{title: string, description: string, icon: string}[]>([])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/dashboard/app/api/products')
      const result = await res.json()
      if (result.success && result.data) {
        setProducts(Object.values(result.data))
      }
      
      const catRes = await fetch('/dashboard/app/api/app-data?docId=categories')
      const catResult = await catRes.json()
      if (catResult.success && catResult.data) {
        if (catResult.data.list && Array.isArray(catResult.data.list)) {
          setDynamicCategories(catResult.data.list)
        }
      }
    } catch (err) {
      console.error('Failed to fetch products', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || (p.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    let matchesFlag = true;
    if (filterFlag === 'Best Seller') matchesFlag = p.isBestSeller;
    if (filterFlag === 'Most Loved') matchesFlag = p.isMostLoved;
    if (filterFlag === 'Fresh Pick') matchesFlag = p.isFreshPick;
    
    return matchesSearch && matchesFlag;
  });

  useEffect(() => {
    if (dynamicCategories.length > 0 && !editingProductId) {
      if (!dynamicCategories.find(c => c.label === category)) {
        setCategory(dynamicCategories[0].label)
      }
    }
  }, [dynamicCategories])

  const handleReset = () => {
    setProductName('')
    setProductDesc('')
    setCategory(dynamicCategories.length > 0 ? dynamicCategories[0].label : 'Pickles')
    setSubCategory('')
    setIsBestSeller(false)
    setIsMostLoved(false)
    setIsFreshPick(false)
    setIsOutOfStock(false)
    setIsVeg(true)
    setStockCount(100)
    setRating('0')
    setImages([])
    setStoryImage('')
    setColor('0xFF18453B')
    setCanRequestTempering(false)
    setWeightPriceEntries([{ weight: '250g', price: '' }])
    
    setOrigin('')
    setPreparationMethod('')
    setStorageInstructions('')
    setServingSuggestion('')
    setShelfLife('')
    setBehindTheJar(defaultBehindTheJar)
    setTrustBadges([])
    setArtisanName('')
    setArtisanImage('')
    setArtisanDescription('')
    setRecipes([])

    setIngredients([])
    setGallery([])
    setSecretIngredient({ name: '', description: '', image: '' })
    setPairings([])
    setSommelierPairings([])

    setErrors({})
    setEditingProductId(null)
  }

  const handleEdit = (product: any) => {
    setEditingProductId(product.id)
    setProductName(product.name || '')
    setProductDesc(product.description || '')
    setCategory(product.category || 'Pickles')
    setSubCategory(product.subCategory || '')
    setIsBestSeller(product.isBestSeller || false)
    setIsMostLoved(product.isMostLoved || false)
    setIsFreshPick(product.isFreshPick || false)
    setIsOutOfStock(product.isOutOfStock || false)
    setIsVeg(product.isVeg !== undefined ? product.isVeg : true)
    setStockCount(product.stockCount !== undefined ? product.stockCount : 100)
    setRating(product.rating ? String(product.rating) : '0')
    setImages(product.image ? [product.image] : [])
    setStoryImage(product.storyImage || '')
    setGallery(product.gallery || [])
    setColor(product.color || '0xFF18453B')
    setCanRequestTempering(product.canRequestTempering || false)
    
    if (product.weightPriceMap && Object.keys(product.weightPriceMap).length > 0) {
      const entries = Object.entries(product.weightPriceMap).map(([weight, price]) => ({
        weight, price: String(price)
      }))
      setWeightPriceEntries(entries)
    } else {
      setWeightPriceEntries([{ weight: '250g', price: '' }])
    }
    
    setOrigin(product.origin || '')
    setPreparationMethod(product.preparationMethod || '')
    setStorageInstructions(product.storageInstructions || '')
    setServingSuggestion(product.servingSuggestion || '')
    setShelfLife(product.shelfLife || '')
    
    if (product.behindTheJar && product.behindTheJar.length === 5) {
      setBehindTheJar(product.behindTheJar)
    } else {
      setBehindTheJar(defaultBehindTheJar)
    }
    
    setTrustBadges(product.trustBadges || [])
    setArtisanName(product.artisanName || '')
    setArtisanImage(product.artisanImage || '')
    setArtisanDescription(product.artisanDescription || '')
    setRecipes(product.recipes || [])

    setIngredients(product.ingredients || [])
    if (product.secretIngredient) {
      setSecretIngredient(product.secretIngredient)
    } else {
      setSecretIngredient({ name: '', description: '', image: '' })
    }
    setPairings(product.pairings || [])
    setSommelierPairings(product.sommelierPairings || [])
    
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch('/dashboard/app/api/products?id=' + productId, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  }

  const handleAddWeightPrice = () => {
    setWeightPriceEntries([...weightPriceEntries, { weight: '', price: '' }])
  }

  const handleRemoveWeightPrice = (index: number) => {
    if (weightPriceEntries.length > 1) {
      setWeightPriceEntries(weightPriceEntries.filter((_, i) => i !== index))
    }
  }

  const updateWeightPrice = (index: number, field: 'weight' | 'price', value: string) => {
    const newEntries = [...weightPriceEntries]
    newEntries[index][field] = value
    setWeightPriceEntries(newEntries)
  }

  const handlePublish = async () => {
    const newErrors: Record<string, string> = {}
    if (!productName.trim()) newErrors.productName = 'Product name is required'
    if (!productDesc.trim()) newErrors.productDesc = 'Description is required'
    
    // Validate weightPriceMap
    const weightPriceMap: Record<string, number> = {}
    let hasValidPrice = false
    weightPriceEntries.forEach(entry => {
      if (entry.weight && entry.price) {
        weightPriceMap[entry.weight] = Number(entry.price)
        hasValidPrice = true
      }
    })
    
    if (!hasValidPrice) newErrors.weightPriceMap = 'At least one valid weight/price pair is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert("Please fix the validation errors in the Basic Info and Inventory tabs.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/dashboard/app/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: editingProductId,
          name: productName,
          description: productDesc,
          category: category,
          subCategory: subCategory,
          isBestSeller: isBestSeller,
          isMostLoved: isMostLoved,
          isFreshPick: isFreshPick,
          isOutOfStock: isOutOfStock,
          isVeg: isVeg,
          stockCount: Number(stockCount),
          rating: Number(rating),
          image: images[0] || '', // Only taking first image for now based on schema
          storyImage: storyImage,
          color: color,
          canRequestTempering: canRequestTempering,
          viewCount: 0,
          purchaseCount: 0,
          weightPriceMap: weightPriceMap,
          
          origin: origin,
          preparationMethod: preparationMethod,
          storageInstructions: storageInstructions,
          servingSuggestion: servingSuggestion,
          shelfLife: shelfLife,
          behindTheJar: behindTheJar,
          trustBadges: trustBadges.filter(b => b.trim() !== ''),
          artisanName: artisanName,
          artisanImage: artisanImage,
          artisanDescription: artisanDescription,
          recipes: recipes.filter(r => r.title.trim() !== '' && r.instruction.trim() !== ''),

          ingredients: ingredients.filter(i => i.name && i.name.trim() !== ''),
          gallery: gallery.filter(g => g.trim() !== ''),
          secretIngredient: secretIngredient.name ? secretIngredient : null,
          pairings: pairings.filter(p => p.trim() !== ''),
          sommelierPairings: sommelierPairings.filter(s => s.title.trim() !== '')
        })
      })
      if (res.ok) {
        await fetchProducts()
        setIsAddDialogOpen(false)
        handleReset()
      } else {
        const err = await res.json()
        alert('Error: ' + err.error)
      }
    } catch (err) {
      console.error('Error saving product', err)
      alert('Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-2 sm:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Manage Inventory</CardTitle>
          <CardDescription>
            View and manage your pickles, powders, and homemade specials.
          </CardDescription>
          <div className="flex flex-wrap items-center gap-4 py-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterFlag}
              onChange={(e) => setFilterFlag(e.target.value)}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-slate-300"
            >
              <option value="All">All Products</option>
              <option value="Best Seller">Best Sellers</option>
              <option value="Most Loved">Most Loved</option>
              <option value="Fresh Pick">Fresh Picks</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-100 dark:border-slate-800">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Prices</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">Loading products...</TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">No products found for this filter.</TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <TableCell>
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                      {product.isBestSeller && <Badge variant="secondary" className="ml-2 mt-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Best Seller</Badge>}
                      {product.isMostLoved && <Badge variant="secondary" className="ml-2 mt-1 bg-pink-100 text-pink-800 hover:bg-pink-100">Most Loved</Badge>}
                      {product.isFreshPick && <Badge variant="secondary" className="ml-2 mt-1 bg-blue-100 text-blue-800 hover:bg-blue-100">Fresh Pick</Badge>}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {product.weightPriceMap && Object.entries(product.weightPriceMap).map(([weight, price]) => (
                          <div key={weight}>{weight}: ₹{price as number}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>⭐ {product.rating}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={!product.isOutOfStock ? 'default' : 'destructive'}
                        className={!product.isOutOfStock ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {!product.isOutOfStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(product)}>Edit Product</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(product.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-lg shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <h3 className="text-lg font-semibold">{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsAddDialogOpen(false)} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="inventory">Pricing</TabsTrigger>
                  <TabsTrigger value="details">Behind the Jar</TabsTrigger>
                  <TabsTrigger value="pairings">Ingredients</TabsTrigger>
                </TabsList>
                
                {/* TAB 1: BASIC INFO */}
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product Name</label>
                      <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Bellam Avakaya" className={errors.productName ? 'border-red-500' : ''} />
                      {errors.productName && <p className="text-xs text-red-500">{errors.productName}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 h-9 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300">
                        {dynamicCategories.length > 0 ? (
                          dynamicCategories.map((cat, idx) => (
                            <option key={idx} value={cat.label}>{cat.label}</option>
                          ))
                        ) : (
                          <>
                            <option value="Pickles">Pickles</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Spices">Spices</option>
                            <option value="Sweets">Sweets</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sub-Category (Filter Tag)</label>
                    <Input value={subCategory} onChange={(e) => setSubCategory(e.target.value)} placeholder="e.g. Classic, Mango Based, Spicy" />
                    <p className="text-xs text-slate-500">Automatically creates filter chips at the top of the category page.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Theme Color (Hex)</label>
                      <div className="flex gap-2">
                        <div className="relative w-10 h-10 overflow-hidden rounded border shrink-0">
                          <input 
                            type="color" 
                            title="Pick a color"
                            value={color?.startsWith('0xFF') ? '#' + color.slice(4) : (color?.startsWith('#') ? color : '#18453B')} 
                            onChange={e => setColor('0xFF' + e.target.value.slice(1).toUpperCase())} 
                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                          />
                        </div>
                        <Input placeholder="e.g. 0xFF18453B" value={color} onChange={e => setColor(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col justify-center pt-6">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" checked={canRequestTempering} onChange={e => setCanRequestTempering(e.target.checked)} className="w-4 h-4 accent-orange-600" />
                        <span className="text-sm font-medium">Allow "Request Tempering" (Tadka)</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea 
                      value={productDesc}
                      onChange={(e) => setProductDesc(e.target.value)}
                      className={`w-full min-h-[80px] rounded-md border ${errors.productDesc ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300`}
                      placeholder="Describe your product..."
                    />
                    {errors.productDesc && <p className="text-xs text-red-500">{errors.productDesc}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2 flex flex-col justify-center border rounded-md p-3">
                      <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                        <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="rounded border-slate-300" />
                        <span>Best Seller</span>
                      </label>
                    </div>
                    <div className="space-y-2 flex flex-col justify-center border rounded-md p-3">
                      <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                        <input type="checkbox" checked={isMostLoved} onChange={(e) => setIsMostLoved(e.target.checked)} className="rounded border-slate-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-pink-600">Most Loved Product</span>
                      </label>
                    </div>
                    <div className="space-y-2 flex flex-col justify-center border rounded-md p-3">
                      <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                        <input type="checkbox" checked={isFreshPick} onChange={(e) => setIsFreshPick(e.target.checked)} className="rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
                        <span className="text-blue-600">Fresh Pick</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 flex flex-col justify-center">
                      <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                        <input type="checkbox" checked={isVeg} onChange={(e) => setIsVeg(e.target.checked)} className="rounded border-slate-300 text-green-600 focus:ring-green-600" />
                        <span className="text-green-600">Pure Veg</span>
                      </label>
                    </div>
                    <div className="space-y-2 flex flex-col justify-center">
                      <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                        <input type="checkbox" checked={isOutOfStock} onChange={(e) => setIsOutOfStock(e.target.checked)} className="rounded border-slate-300" />
                        <span className="text-red-500">Out of Stock</span>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Initial Rating</label>
                      <Input type="number" step="0.1" min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="4.9" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Main Image</label>
                    <ImageUpload 
                      value={images[0] || ''} 
                      onChange={(url) => { setImages([url]); setErrors({...errors, images: ''}); }} 
                      folder="products" 
                    />
                    {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-sm font-medium">Snack Story Artwork Image (Optional)</label>
                    <p className="text-xs text-slate-500">Wavy artwork displayed directly above the snack product card.</p>
                    <ImageUpload 
                      value={storyImage} 
                      onChange={(url) => setStoryImage(url)} 
                      folder="products/story" 
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium">Gallery Thumbnails (Max 4)</label>
                    <p className="text-xs text-slate-500">Add up to 4 additional images for the product page.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map((idx) => (
                        <ImageUpload 
                          key={idx}
                          value={gallery[idx] || ''} 
                          onChange={(url) => { 
                            const newGallery = [...gallery];
                            if (url) {
                              newGallery[idx] = url;
                            } else {
                              newGallery.splice(idx, 1);
                            }
                            setGallery(newGallery.filter(Boolean)); 
                          }} 
                          folder="products/gallery" 
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 2: INVENTORY & PRICING */}
                <TabsContent value="inventory" className="space-y-8">
                  <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Current Stock Level</h4>
                    <div className="space-y-2 max-w-xs">
                      <label className="text-sm font-medium">Stock Count</label>
                      <Input 
                        type="number" 
                        value={stockCount} 
                        onChange={(e) => setStockCount(Number(e.target.value))} 
                      />
                      <p className="text-xs text-slate-500">Controls the "ONLY X LEFT!" badge on the app.</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Weights & Prices</h4>
                      <p className="text-xs text-slate-500">Set the variants and their prices.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddWeightPrice}>
                      <Plus className="h-4 w-4 mr-1" /> Add Option
                    </Button>
                  </div>
                  {errors.weightPriceMap && <p className="text-xs text-red-500">{errors.weightPriceMap}</p>}
                  
                  {weightPriceEntries.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Input placeholder="e.g. 250g" value={entry.weight} onChange={(e) => updateWeightPrice(idx, 'weight', e.target.value)} className="w-1/3" />
                      <Input placeholder="Price (₹)" type="number" value={entry.price} onChange={(e) => updateWeightPrice(idx, 'price', e.target.value)} className="w-1/3" />
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveWeightPrice(idx)} disabled={weightPriceEntries.length === 1}>
                        <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                {/* TAB 3: BEHIND THE JAR */}
                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Origin</label>
                    <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. Bhimavaram, Andhra Pradesh" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preparation Method</label>
                    <textarea value={preparationMethod} onChange={(e) => setPreparationMethod(e.target.value)} className="w-full min-h-[60px] rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300" placeholder="Describe the process..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Storage Instructions</label>
                    <Input value={storageInstructions} onChange={(e) => setStorageInstructions(e.target.value)} placeholder="e.g. Store in a cool, dry place" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Serving Suggestion</label>
                    <Input value={servingSuggestion} onChange={(e) => setServingSuggestion(e.target.value)} placeholder="e.g. Serve hot with rice and ghee" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Shelf Life</label>
                    <Input value={shelfLife} onChange={(e) => setShelfLife(e.target.value)} placeholder="e.g. 6 Months" />
                  </div>

                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Timeline Events (Behind The Jar)</h4>
                    <p className="text-xs text-slate-500">Customize the 5 points in the heritage timeline. Leave blank to use app defaults.</p>
                    <div className="space-y-4">
                      {behindTheJar.map((item, idx) => (
                        <div key={idx} className="p-3 border rounded-md space-y-2">
                          <label className="text-sm font-medium">{item.title}</label>
                          <Input 
                            placeholder={`${item.title} Subtitle (e.g. Bhimavaram, AP)`} 
                            value={item.subtitle} 
                            onChange={(e) => {
                              const newArr = [...behindTheJar];
                              newArr[idx].subtitle = e.target.value;
                              setBehindTheJar(newArr);
                            }} 
                          />
                          <Input 
                            placeholder={`${item.title} Description`} 
                            value={item.description} 
                            onChange={(e) => {
                              const newArr = [...behindTheJar];
                              newArr[idx].description = e.target.value;
                              setBehindTheJar(newArr);
                            }} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Master Artisan</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">Artisan Name</label>
                        <Input value={artisanName} onChange={(e) => setArtisanName(e.target.value)} placeholder="e.g. Smt. Annapurna" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">Artisan Image</label>
                        <ImageUpload value={artisanImage} onChange={(url) => setArtisanImage(url)} folder="products/artisan" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">Artisan Description</label>
                        <textarea value={artisanDescription} onChange={(e) => setArtisanDescription(e.target.value)} className="w-full min-h-[60px] rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300" placeholder="e.g. 40 years of experience..." />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <label className="text-sm font-medium">Purity & Trust Badges</label>
                    <p className="text-xs text-slate-500">Highlights shown in a horizontal row of icons.</p>
                    {trustBadges.map((badge, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input value={badge} onChange={(e) => { const n = [...trustBadges]; n[idx] = e.target.value; setTrustBadges(n) }} placeholder="e.g. Zero Preservatives" />
                        <Button variant="ghost" size="icon" onClick={() => setTrustBadges(trustBadges.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setTrustBadges([...trustBadges, ''])}>+ Add Trust Badge</Button>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <label className="text-sm font-medium">Royal Recipes (Serving Suggestions)</label>
                    <p className="text-xs text-slate-500">Quick recipes to help users imagine how they will use the product.</p>
                    {recipes.map((recipe, idx) => (
                      <div key={idx} className="flex flex-col gap-2 mb-4 p-3 border rounded">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-slate-500">Recipe {idx + 1}</label>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setRecipes(recipes.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                        </div>
                        <Input value={recipe.title} onChange={(e) => { const n = [...recipes]; n[idx].title = e.target.value; setRecipes(n) }} placeholder="Recipe Title (e.g. Avakaya with Hot Rice)" />
                        <Input value={recipe.instruction} onChange={(e) => { const n = [...recipes]; n[idx].instruction = e.target.value; setRecipes(n) }} placeholder="Subtitle/Instruction (e.g. A timeless classic.)" />
                        <div className="mt-2">
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Recipe Image</label>
                          <ImageUpload value={recipe.image || ''} onChange={(url) => { const n = [...recipes]; n[idx].image = url; setRecipes(n) }} folder="products/recipes" />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setRecipes([...recipes, {image: '', title: '', instruction: ''}])}>+ Add Recipe</Button>
                  </div>

                </TabsContent>

                {/* TAB 4: INGREDIENTS & PAIRINGS */}
                <TabsContent value="pairings" className="space-y-6">
                  {/* Ingredients List */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ingredients (Name & Image Grid)</label>
                    <p className="text-xs text-slate-500">Add the product ingredients along with their images. They will be displayed in a circular grid on the product page.</p>
                    {ingredients.map((ing, idx) => (
                      <div key={idx} className="flex flex-col gap-2 mb-4 p-3 border rounded border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-slate-500">Ingredient {idx + 1}</label>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                        </div>
                        <Input value={ing.name} onChange={(e) => { const n = [...ingredients]; n[idx].name = e.target.value; setIngredients(n) }} placeholder="Ingredient Name (e.g. Raw Mangoes)" />
                        <div className="mt-2">
                          <label className="text-xs font-medium text-slate-500 mb-1 block">Ingredient Image</label>
                          <ImageUpload value={ing.image} onChange={(url) => { const n = [...ingredients]; n[idx].image = url; setIngredients(n) }} folder="products/ingredients" />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setIngredients([...ingredients, {name: '', image: ''}])}>+ Add Ingredient</Button>
                  </div>

                  {/* Secret Ingredient */}
                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Secret Ingredient (Optional)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">Ingredient Name</label>
                        <Input value={secretIngredient.name} onChange={(e) => setSecretIngredient({...secretIngredient, name: e.target.value})} placeholder="e.g. Guntur Chilli" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">Short Description</label>
                        <Input value={secretIngredient.description} onChange={(e) => setSecretIngredient({...secretIngredient, description: e.target.value})} placeholder="Locally sourced..." />
                      </div>
                    </div>
                  </div>

                  {/* Exquisite Pairings */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <label className="text-sm font-medium">Exquisite Pairings (Related Products)</label>
                    <p className="text-xs text-slate-500">Names of other products to suggest at the bottom.</p>
                    {pairings.map((pairing, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input value={pairing} onChange={(e) => { const n = [...pairings]; n[idx] = e.target.value; setPairings(n) }} placeholder="e.g. Gongura Pickle" />
                        <Button variant="ghost" size="icon" onClick={() => setPairings(pairings.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setPairings([...pairings, ''])}>+ Add Pairing</Button>
                  </div>

                  {/* Sommelier Guide */}
                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">The Sommelier Guide</h4>
                    {sommelierPairings.map((som, idx) => (
                      <div key={idx} className="flex flex-col gap-2 p-3 border rounded-md">
                        <Input placeholder="Title (e.g. Steaming Hot Idli)" value={som.title} onChange={(e) => { const n = [...sommelierPairings]; n[idx].title = e.target.value; setSommelierPairings(n) }} />
                        <Input placeholder="Description" value={som.description} onChange={(e) => { const n = [...sommelierPairings]; n[idx].description = e.target.value; setSommelierPairings(n) }} />
                        <Input placeholder="Icon URL" value={som.icon} onChange={(e) => { const n = [...sommelierPairings]; n[idx].icon = e.target.value; setSommelierPairings(n) }} />
                        <Button variant="destructive" size="sm" onClick={() => setSommelierPairings(sommelierPairings.filter((_, i) => i !== idx))}>Remove</Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setSommelierPairings([...sommelierPairings, {title:'', description:'', icon:''}])}>+ Add Guide Entry</Button>
                  </div>

                </TabsContent>
              </Tabs>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <Button variant="outline" onClick={handleReset} disabled={isSubmitting}>Reset</Button>
              <Button onClick={handlePublish} disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
