'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, MoreHorizontal, Image as ImageIcon, X, Upload } from 'lucide-react'
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const dummyProducts = [
  { id: '1', name: 'Mango Pickle (Avakaya)', category: 'Pickles', price: 250, stock: 45, status: 'Active' },
  { id: '2', name: 'Garlic Pickle', category: 'Pickles', price: 280, stock: 12, status: 'Active' },
  { id: '3', name: 'Gongura Mutton', category: 'Non-Veg', price: 450, stock: 0, status: 'Out of Stock' },
  { id: '4', name: 'Lemon Pickle', category: 'Pickles', price: 200, stock: 150, status: 'Active' },
  { id: '5', name: 'Mixed Veg Pickle', category: 'Pickles', price: 220, stock: 5, status: 'Low Stock' },
  { id: '6', name: 'Chicken Pickle', category: 'Non-Veg', price: 400, stock: 30, status: 'Active' },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [productName, setProductName] = useState('')
  const [productDesc, setProductDesc] = useState('')
  const [weight, setWeight] = useState('')
  const [units, setUnits] = useState('grams')
  const [category, setCategory] = useState('Pickles')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [status, setStatus] = useState('Active')
  const [images, setImages] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleReset = () => {
    setProductName('')
    setProductDesc('')
    setWeight('')
    setUnits('grams')
    setCategory('Pickles')
    setPrice('')
    setStock('')
    setStatus('Active')
    setImages([])
    setErrors({})
  }

  const handlePublish = () => {
    const newErrors: Record<string, string> = {}
    if (!productName.trim()) newErrors.productName = 'Product name is required'
    if (!productDesc.trim()) newErrors.productDesc = 'Description is required'
    if (!weight) newErrors.weight = 'Weight is required'
    else if (Number(weight) <= 0) newErrors.weight = 'Weight must be positive'
    if (!price) newErrors.price = 'Price is required'
    else if (Number(price) < 0) newErrors.price = 'Price cannot be negative'
    if (!stock) newErrors.stock = 'Stock is required'
    else if (Number(stock) < 0) newErrors.stock = 'Stock cannot be negative'
    if (images.length === 0) newErrors.images = 'At least 1 image is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Success logic here
    setIsAddDialogOpen(false)
    handleReset()
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
          <div className="flex items-center py-4">
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
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                        <ImageIcon className="h-5 w-5 text-slate-400" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.status === 'Active' ? 'default' : product.status === 'Out of Stock' ? 'destructive' : 'secondary'}
                        className={product.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {product.status}
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
                          <DropdownMenuItem>Edit Product</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold">Add New Product</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsAddDialogOpen(false)} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Enter product name" className={errors.productName ? 'border-red-500' : ''} />
                {errors.productName && <p className="text-xs text-red-500">{errors.productName}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Description</label>
                <textarea 
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  className={`w-full min-h-[100px] rounded-md border ${errors.productDesc ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300`}
                  placeholder="Describe your product..."
                />
                {errors.productDesc && <p className="text-xs text-red-500">{errors.productDesc}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 h-9 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300">
                    <option value="Pickles">Pickles</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 h-9 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300">
                    <option value="Active">Active</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (₹)</label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 250" className={errors.price ? 'border-red-500' : ''} />
                  {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock Quantity</label>
                  <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="e.g. 50" className={errors.stock ? 'border-red-500' : ''} />
                  {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight</label>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 250" className={errors.weight ? 'border-red-500' : ''} />
                  {errors.weight && <p className="text-xs text-red-500">{errors.weight}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Units</label>
                  <select value={units} onChange={(e) => setUnits(e.target.value)} className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 h-9 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300">
                    <option value="grams">Grams</option>
                    <option value="kg">KG</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Images (Up to 3)</label>
                <div onClick={() => { if (images.length < 3) { setImages([...images, 'dummy-image']); setErrors({...errors, images: ''}) } }} className={`border-2 border-dashed ${errors.images ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer`}>
                  <Upload className="h-8 w-8 mb-2" />
                  <p className="text-sm font-medium">Click to upload images</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
                {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}
                <div className="flex gap-2 mt-2">
                  {images.map((img, i) => (
                    <div key={i} className="h-16 w-16 rounded-md border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-900 relative">
                      <ImageIcon className="h-5 w-5 text-slate-300" />
                    </div>
                  ))}
                  {images.length === 0 && <span className="text-xs text-slate-400">No images uploaded</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <Button variant="outline" onClick={handleReset}>Reset</Button>
              <Button onClick={handlePublish}>Publish</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
