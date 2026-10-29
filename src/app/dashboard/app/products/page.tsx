'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { ImageUpload } from '@/components/ImageUpload'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, MoreHorizontal, Image as ImageIcon, X, Upload, Trash2, Flame, Sparkles } from 'lucide-react'
import { ProductDetailManager } from './components/ProductDetailManager'
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
  
  // Cinematic Living Photos & Glints Detail Modal
  const [detailProduct, setDetailProduct] = useState<any | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  
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

  // Taste Deck (Swipe Cards) Fields
  const [deckTag, setDeckTag] = useState('')
  const [deckDescription, setDeckDescription] = useState('')
  const [spiceLevel, setSpiceLevel] = useState<number>(3)
  const [cureNote, setCureNote] = useState('')
  const [deckColor1, setDeckColor1] = useState('#8A1A10')
  const [deckColor2, setDeckColor2] = useState('#2A0806')
  const [deckPhotos, setDeckPhotos] = useState<string[]>([])
  const [deckSort, setDeckSort] = useState<number>(0)
  const [deckHidden, setDeckHidden] = useState<boolean>(false)

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

    // Reset Taste Deck
    setDeckTag('')
    setDeckDescription('')
    setSpiceLevel(3)
    setCureNote('')
    setDeckColor1('#8A1A10')
    setDeckColor2('#2A0806')
    setDeckPhotos([])
    setDeckSort(0)
    setDeckHidden(false)

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

    // Load Taste Deck Fields
    setDeckTag(product.tag || product.deckTag || '')
    setDeckDescription(product.deck_description || product.deckDescription || '')
    setSpiceLevel(product.spice !== undefined ? Number(product.spice) : 3)
    setCureNote(product.cure_note || product.cureNote || '')
    setDeckColor1(product.color1 || product.deckColor1 || '#8A1A10')
    setDeckColor2(product.color2 || product.deckColor2 || '#2A0806')
    setDeckPhotos(Array.isArray(product.deck_photos) ? product.deck_photos : (Array.isArray(product.deckPhotos) ? product.deckPhotos : []))
    setDeckSort(product.deck_sort !== undefined ? Number(product.deck_sort) : 0)
    setDeckHidden(product.deck_hidden || product.deckHidden || false)
    
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
          sommelierPairings: sommelierPairings.filter(s => s.title.trim() !== ''),

          // Taste Deck Fields
          tag: deckTag,
          deckTag: deckTag,
          deck_description: deckDescription,
          deckDescription: deckDescription,
          spice: Number(spiceLevel),
          cure_note: cureNote,
          cureNote: cureNote,
          color1: deckColor1,
          deckColor1: deckColor1,
          color2: deckColor2,
          deckColor2: deckColor2,
          deck_photos: deckPhotos.filter(p => p && p.trim() !== ''),
          deckPhotos: deckPhotos.filter(p => p && p.trim() !== ''),
          deck_sort: Number(deckSort),
          deckSort: Number(deckSort),
          deck_hidden: deckHidden,
          deckHidden: deckHidden
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
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDetailProduct(product);
                            setIsDetailOpen(true);
                          }}
                          className="h-8 px-2 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10 text-xs font-bold flex items-center gap-1 shadow-sm"
                          title="Open Living Photos, Oil Glints & Cinematic Product Detail"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          <span>Glints</span>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(product)}>Edit Product</DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setDetailProduct(product);
                                setIsDetailOpen(true);
                              }}
                              className="text-amber-600 font-semibold flex items-center gap-1.5"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              Living Photos & Glints
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(product.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="inventory">Pricing</TabsTrigger>
                  <TabsTrigger value="details">Behind the Jar</TabsTrigger>
                  <TabsTrigger value="pairings">Ingredients</TabsTrigger>
                  <TabsTrigger value="deck">Taste Deck</TabsTrigger>
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
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="tempering" checked={canRequestTempering} onChange={e => setCanRequestTempering(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="tempering" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Allow Tempering Request (Tadkam)</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea value={productDesc} onChange={(e) => setProductDesc(e.target.value)} rows={3} placeholder="Full mouth-watering description..." className={`w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 ${errors.productDesc ? 'border-red-500' : ''}`} />
                    {errors.productDesc && <p className="text-xs text-red-500">{errors.productDesc}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Primary Product Image</label>
                      <ImageUpload value={images[0] || ''} onChange={(url) => setImages([url])} folder="products" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Story / Process Image (Optional)</label>
                      <ImageUpload value={storyImage} onChange={(url) => setStoryImage(url)} folder="products" />
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <label className="text-sm font-medium">Rating (0 - 5)</label>
                    <Input type="number" step="0.1" max="5" min="0" value={rating} onChange={(e) => setRating(e.target.value)} />
                  </div>

                  <div className="flex flex-wrap gap-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="bestseller" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <label htmlFor="bestseller" className="text-sm font-medium leading-none">Best Seller</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="mostloved" checked={isMostLoved} onChange={(e) => setIsMostLoved(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <label htmlFor="mostloved" className="text-sm font-medium leading-none">Most Loved</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="freshpick" checked={isFreshPick} onChange={(e) => setIsFreshPick(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <label htmlFor="freshpick" className="text-sm font-medium leading-none">Fresh Pick</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="outofstock" checked={isOutOfStock} onChange={(e) => setIsOutOfStock(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <label htmlFor="outofstock" className="text-sm font-medium leading-none">Out of Stock</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="isveg" checked={isVeg} onChange={(e) => setIsVeg(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <label htmlFor="isveg" className="text-sm font-medium leading-none">Vegetarian</label>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 2: PRICING & INVENTORY */}
                <TabsContent value="inventory" className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock Inventory Count</label>
                    <Input type="number" value={stockCount} onChange={(e) => setStockCount(Number(e.target.value))} placeholder="100" />
                    <p className="text-xs text-slate-500">Total units available before marked as Out of Stock automatically.</p>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Weights & Prices (e.g. 250g, 500g, 1kg)</label>
                      <Button variant="outline" size="sm" onClick={handleAddWeightPrice}>+ Add Weight Variant</Button>
                    </div>
                    {errors.weightPriceMap && <p className="text-xs text-red-500">{errors.weightPriceMap}</p>}

                    {weightPriceEntries.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <Input 
                          placeholder="Weight (e.g. 250g)" 
                          value={entry.weight} 
                          onChange={(e) => updateWeightPrice(idx, 'weight', e.target.value)} 
                          className="w-1/2"
                        />
                        <Input 
                          type="number" 
                          placeholder="Price (₹)" 
                          value={entry.price} 
                          onChange={(e) => updateWeightPrice(idx, 'price', e.target.value)} 
                          className="w-1/2"
                        />
                        {weightPriceEntries.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveWeightPrice(idx)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* TAB 3: BEHIND THE JAR */}
                <TabsContent value="details" className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">5-Step Behind The Jar Timeline</h4>
                    <p className="text-xs text-slate-500">Fixed heritage steps shown to customers inside the app details page.</p>

                    {behindTheJar.map((step, idx) => (
                      <div key={idx} className="p-3 border rounded-md space-y-2">
                        <span className="font-semibold text-xs text-primary">{idx + 1}. {step.title}</span>
                        <div className="grid grid-cols-2 gap-2">
                          <Input 
                            placeholder="Subtitle (e.g. Traditional Handcraft)" 
                            value={step.subtitle} 
                            onChange={(e) => {
                              const newArr = [...behindTheJar];
                              newArr[idx].subtitle = e.target.value;
                              setBehindTheJar(newArr);
                            }} 
                          />
                          <Input 
                            placeholder="Description" 
                            value={step.description} 
                            onChange={(e) => {
                              const newArr = [...behindTheJar];
                              newArr[idx].description = e.target.value;
                              setBehindTheJar(newArr);
                            }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trust Badges */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <label className="text-sm font-medium">Trust Badges (e.g. Zero Preservatives, Stone Ground)</label>
                    {trustBadges.map((badge, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input value={badge} onChange={(e) => { const n = [...trustBadges]; n[idx] = e.target.value; setTrustBadges(n) }} />
                        <Button variant="ghost" size="icon" onClick={() => setTrustBadges(trustBadges.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setTrustBadges([...trustBadges, ''])}>+ Add Trust Badge</Button>
                  </div>

                  {/* Master Artisan */}
                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Master Artisan Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Artisan Name" value={artisanName} onChange={(e) => setArtisanName(e.target.value)} />
                      <Input placeholder="Artisan Image URL" value={artisanImage} onChange={(e) => setArtisanImage(e.target.value)} />
                    </div>
                    <textarea placeholder="Artisan Short Story / Description" value={artisanDescription} onChange={(e) => setArtisanDescription(e.target.value)} rows={2} className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 text-sm" />
                  </div>

                  {/* Recipes */}
                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Signature Recipes</h4>
                    {recipes.map((rec, idx) => (
                      <div key={idx} className="flex flex-col gap-2 p-3 border rounded-md">
                        <Input placeholder="Recipe Title" value={rec.title} onChange={(e) => { const n = [...recipes]; n[idx].title = e.target.value; setRecipes(n) }} />
                        <textarea placeholder="Recipe Instruction" value={rec.instruction} onChange={(e) => { const n = [...recipes]; n[idx].instruction = e.target.value; setRecipes(n) }} rows={2} className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent p-2 text-sm" />
                        <Button variant="destructive" size="sm" onClick={() => setRecipes(recipes.filter((_, i) => i !== idx))}>Remove Recipe</Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setRecipes([...recipes, {title: '', instruction: ''}])}>+ Add Recipe</Button>
                  </div>
                </TabsContent>

                {/* TAB 4: INGREDIENTS & PAIRINGS */}
                <TabsContent value="pairings" className="space-y-6">
                  {/* Ingredients with Images */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Visual Ingredients List</h4>
                    <p className="text-xs text-slate-500">Ingredient names and circular image icons displayed on the detail sheet.</p>

                    {ingredients.map((ing, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Input placeholder="Ingredient Name (e.g. Raw Mango)" value={ing.name} onChange={(e) => { const n = [...ingredients]; n[idx].name = e.target.value; setIngredients(n) }} className="w-1/2" />
                        <Input placeholder="Image URL (Icon)" value={ing.image} onChange={(e) => { const n = [...ingredients]; n[idx].image = e.target.value; setIngredients(n) }} className="w-1/2" />
                        <Button variant="ghost" size="icon" onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setIngredients([...ingredients, {name:'', image:''}])}>+ Add Ingredient</Button>
                  </div>

                  {/* Secret Ingredient */}
                  <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Secret Ingredient (Golden Star Element)</h4>
                    <Input placeholder="Ingredient Name" value={secretIngredient.name} onChange={(e) => setSecretIngredient({...secretIngredient, name: e.target.value})} />
                    <Input placeholder="Special Story / Description" value={secretIngredient.description} onChange={(e) => setSecretIngredient({...secretIngredient, description: e.target.value})} />
                    <Input placeholder="Image URL" value={secretIngredient.image} onChange={(e) => setSecretIngredient({...secretIngredient, image: e.target.value})} />
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

                {/* TAB 5: TASTE DECK (SWIPE CARDS) */}
                <TabsContent value="deck" className="space-y-6">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-stone-900 to-amber-950/40 border border-red-500/30 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                      <Flame className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <span>Taste Deck Swipe Cards</span>
                        <span className="text-[10px] font-mono uppercase bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30">
                          GET /api/category/:slug/products
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Configure the full-screen vertical swipe cards for this product when viewed in the Category Deck screen.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Deck Info & Chilli Meter */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Card Tag / Badge</label>
                        <Input 
                          value={deckTag} 
                          onChange={(e) => setDeckTag(e.target.value)} 
                          placeholder="e.g. Best Seller, Amma's Special, Spicy Classic" 
                        />
                        <p className="text-xs text-slate-500">Displays on the top-right pill badge of the swipe card.</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Deck Short Description (1 Line)</label>
                        <Input 
                          value={deckDescription} 
                          onChange={(e) => setDeckDescription(e.target.value)} 
                          placeholder="e.g. Sweet & Spicy Mango Pickle sun-cured in jaadis" 
                          maxLength={90}
                        />
                        <p className="text-xs text-slate-500">Short, punchy line displayed prominently under the product name.</p>
                      </div>

                      {/* Chilli Spice Meter (0-5) */}
                      <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Chilli Meter (Spice Level)</label>
                          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                            {spiceLevel === 0 ? 'Mild / No Spice' : `Level ${spiceLevel} of 5`}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setSpiceLevel(lvl === spiceLevel ? 0 : lvl)}
                              className={`text-2xl transition-transform hover:scale-125 ${
                                lvl <= spiceLevel ? 'opacity-100 scale-110 filter drop-shadow' : 'opacity-25 grayscale'
                              }`}
                              title={`Set Spice Level ${lvl}`}
                            >
                              🌶️
                            </button>
                          ))}
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSpiceLevel(0)}
                            className="text-[11px] h-7 px-2 ml-2 text-slate-500"
                          >
                            Clear (0)
                          </Button>
                        </div>
                        <p className="text-[11px] text-slate-500">Tapping sets the flame indicators on the customer's swipe card.</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cure Note</label>
                        <Input 
                          value={cureNote} 
                          onChange={(e) => setCureNote(e.target.value)} 
                          placeholder="e.g. ☀️ 21 days sun-cured, Wood-fired, Freshly ground" 
                        />
                        <p className="text-xs text-slate-500">Heritage preparation note displayed alongside the spice meter.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">Deck Sort Order</label>
                          <Input 
                            type="number"
                            value={deckSort} 
                            onChange={(e) => setDeckSort(parseInt(e.target.value) || 0)} 
                            placeholder="0" 
                            className="h-8 text-xs font-mono"
                          />
                          <p className="text-[10px] text-slate-500">Lower numbers appear first in the deck.</p>
                        </div>

                        <div className="space-y-1.5 flex flex-col justify-end">
                          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <input 
                              type="checkbox"
                              checked={deckHidden}
                              onChange={(e) => setDeckHidden(e.target.checked)}
                              className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                            />
                            <span>Hide from Taste Deck</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Card Colors & Tall Photos */}
                    <div className="space-y-4">
                      <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <label className="text-sm font-medium">Card Gradient Colors</label>
                        <div className="grid grid-cols-2 gap-3 mt-1">
                          <div>
                            <span className="text-[11px] text-slate-500 block mb-1">Color 1 (Light Accent)</span>
                            <div className="flex items-center gap-2">
                              <input 
                                type="color" 
                                value={deckColor1} 
                                onChange={(e) => setDeckColor1(e.target.value)} 
                                className="w-8 h-8 rounded border cursor-pointer"
                              />
                              <Input 
                                value={deckColor1} 
                                onChange={(e) => setDeckColor1(e.target.value)} 
                                className="h-8 text-xs font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-500 block mb-1">Color 2 (Dark Shade)</span>
                            <div className="flex items-center gap-2">
                              <input 
                                type="color" 
                                value={deckColor2} 
                                onChange={(e) => setDeckColor2(e.target.value)} 
                                className="w-8 h-8 rounded border cursor-pointer"
                              />
                              <Input 
                                value={deckColor2} 
                                onChange={(e) => setDeckColor2(e.target.value)} 
                                className="h-8 text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Color Presets:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { name: 'Avakaya Crimson', c1: '#8A1A10', c2: '#2A0806' },
                              { name: 'Podi Emerald', c1: '#1B5E20', c2: '#0A290E' },
                              { name: 'Murukku Amber', c1: '#C2410C', c2: '#4A1A04' },
                              { name: 'Mithai Magenta', c1: '#831843', c2: '#2A0515' },
                              { name: 'Royal Purple', c1: '#4C1D95', c2: '#1E0741' }
                            ].map(p => (
                              <button
                                key={p.name}
                                type="button"
                                onClick={() => { setDeckColor1(p.c1); setDeckColor2(p.c2); }}
                                className="flex items-center gap-1.5 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 text-[10px] hover:border-red-400 bg-white dark:bg-slate-900"
                              >
                                <div className="w-3 h-3 rounded-full" style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }} />
                                <span>{p.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Deck Photos (1 or 2 Tall Photos)</label>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {(deckPhotos[0] ? 1 : 0) + (deckPhotos[1] ? 1 : 0)}/2 Photos
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Vertical / portrait aspect images (9:16) for full-height swipe card presentation.
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          {/* Photo 1: Front Tall Photo */}
                          <div className="space-y-1.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Photo 1 (Front View)</span>
                              {deckPhotos[0] && (
                                <button
                                  type="button"
                                  onClick={() => setDeckPhotos(['', deckPhotos[1] || ''])}
                                  className="text-[10px] text-red-500 hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <ImageUpload
                              value={deckPhotos[0] || ''}
                              onChange={(url) => setDeckPhotos([url, deckPhotos[1] || ''])}
                              folder="taste_deck"
                            />
                            {deckPhotos[0] && (
                              <div className="w-full h-32 rounded-lg overflow-hidden border border-red-500/30 mt-1">
                                <img src={deckPhotos[0]} alt="Deck Photo 1" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>

                          {/* Photo 2: Detail / Action Tall Photo */}
                          <div className="space-y-1.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Photo 2 (Detail View)</span>
                              {deckPhotos[1] && (
                                <button
                                  type="button"
                                  onClick={() => setDeckPhotos([deckPhotos[0] || '', ''])}
                                  className="text-[10px] text-red-500 hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <ImageUpload
                              value={deckPhotos[1] || ''}
                              onChange={(url) => setDeckPhotos([deckPhotos[0] || '', url])}
                              folder="taste_deck"
                            />
                            {deckPhotos[1] && (
                              <div className="w-full h-32 rounded-lg overflow-hidden border border-red-500/30 mt-1">
                                <img src={deckPhotos[1]} alt="Deck Photo 2" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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

      {/* CINEMATIC PRODUCT DETAIL & LIVING PHOTOS GLINTS MODAL */}
      {isDetailOpen && detailProduct && (
        <ProductDetailManager
          product={detailProduct}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onSaved={fetchProducts}
        />
      )}
    </div>
  )
}
