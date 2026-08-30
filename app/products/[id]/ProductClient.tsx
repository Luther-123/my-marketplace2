'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { User, HelpCircle, ShoppingCart, Moon, Sun, Star, ShieldCheck, Truck, ArrowLeft, Plus, Minus } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Product {
    id: string
    title: string
    price: number
    image_url: string
    description?: string
    category?: string
}

export default function ProductClient({ productId }: { productId: string }) {
    const router = useRouter()
    const { darkMode, setDarkMode, cartCount, setIsCartOpen, addToCart } = useCart()

    const [product, setProduct] = useState<Product | null>(null)
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)
    const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')

    const reviews = [
        { id: 1, name: 'Kevin O.', rating: 5, date: 'Aug 24, 2026', comment: 'Absolute game changer. Premium quality build and arrived lightning fast in Nairobi!' },
        { id: 2, name: 'Brenda W.', rating: 5, date: 'Aug 20, 2026', comment: 'Exceeded expectations. The battery life and finish are truly top tier.' },
        { id: 3, name: 'Brian M.', rating: 4, date: 'Aug 15, 2026', comment: 'Very solid item, packaging was pristine. Would definitely recommend to anyone.' }
    ]

    useEffect(() => {
        if (productId) {
            fetchProductAndRelated()
        }
    }, [productId])

    const fetchProductAndRelated = async () => {
        setLoading(true)
        try {
            const { data: currentProd, error: prodError } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single()

            if (prodError) {
                console.error('Error fetching product:', prodError.message)
            } else {
                setProduct(currentProd)

                const { data: relatedData } = await supabase
                    .from('products')
                    .select('*')
                    .neq('id', productId)
                    .limit(4)

                setRelatedProducts(relatedData || [])
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (!product) return
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image_url: product.image_url
            })
        }
        setAdded(true)
        setTimeout(() => setAdded(false), 3000)
    }

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center font-sans ${darkMode ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-900'}`}>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider animate-pulse">Loading product details...</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center font-sans gap-4 ${darkMode ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-900'}`}>
                <h1 className="text-xl font-black">Product not found</h1>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-[#FACC15] text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                    Back to Catalog
                </button>
            </div>
        )
    }

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-900'}`}>
            {/* Top Navigation Bar */}
            <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${darkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white/80 border-neutral-200'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="w-10 h-10 rounded-xl bg-[#FACC15] flex items-center justify-center text-neutral-950 font-black text-xl shadow-sm">
                            P
                        </div>
                        <span className="text-xl font-black tracking-tight">plugKe</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/account"
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${darkMode ? 'text-neutral-300 hover:bg-neutral-900' : 'text-neutral-600 hover:bg-neutral-100'}`}
                        >
                            <User className="w-4 h-4" /> Account
                        </Link>

                        <Link
                            href="/help"
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${darkMode ? 'text-neutral-300 hover:bg-neutral-900' : 'text-neutral-600 hover:bg-neutral-100'}`}
                        >
                            <HelpCircle className="w-4 h-4" /> Help
                        </Link>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${darkMode ? 'bg-neutral-900 text-yellow-400 border border-neutral-800 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'}`}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FACC15] text-neutral-950 font-black text-[10px] flex items-center justify-center shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition cursor-pointer ${darkMode ? 'bg-neutral-900 border-neutral-800 text-yellow-400 hover:bg-neutral-800' : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'}`}
                            aria-label="Toggle theme"
                        >
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Product Container */}
            <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Catalog
                </button>

                <div className={`rounded-[2.5rem] border p-8 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12 ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                    <div className="lg:col-span-6 flex flex-col gap-4">
                        <div className={`w-full h-[400px] md:h-[450px] rounded-3xl border overflow-hidden flex items-center justify-center ${darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div className="inline-block px-3 py-1 rounded-full bg-[#FACC15]/10 text-yellow-500 font-bold text-[10px] uppercase tracking-wider">
                                {product.category || 'Curated Tech'}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{product.title}</h1>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-neutral-400">(4.9 / 128 Reviews)</span>
                            </div>

                            <div className="text-3xl font-black text-[#FACC15]">${product.price.toFixed(2)}</div>

                            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
                                {product.description || 'Engineered with precision and premium craftsmanship.'}
                            </p>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Quantity</span>
                                <div className={`flex items-center gap-3 rounded-2xl border px-3 py-2 ${darkMode ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-neutral-50'}`}>
                                    <button onClick={() => setQuantity(prev => Math.max(prev - 1, 1))} className="text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition cursor-pointer">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold text-sm w-6 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(prev => prev + 1)} className="text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition cursor-pointer">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={handleAddToCart} className="flex-1 py-4 bg-[#FACC15] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-yellow-400 transition shadow-md flex items-center justify-center gap-2 cursor-pointer">
                                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                                </button>
                                <button onClick={() => { handleAddToCart(); setIsCartOpen(true); }} className={`flex-1 py-4 font-black text-xs uppercase tracking-wider rounded-2xl border transition shadow-sm flex items-center justify-center gap-2 cursor-pointer ${darkMode ? 'border-neutral-700 hover:bg-neutral-800 text-white' : 'border-neutral-300 hover:bg-neutral-100 text-neutral-900'}`}>
                                    Buy Now
                                </button>
                            </div>

                            {added && <p className="text-xs font-bold text-emerald-500 text-center">Successfully added {quantity} item(s) to your cart!</p>}

                            <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-neutral-400">
                                <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#FACC15]" /> Express Delivery in Kenya</div>
                                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#FACC15]" /> 1 Year Secure Warranty</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`rounded-[2.5rem] border p-8 md:p-12 shadow-xl ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                    <div className="flex items-center gap-8 border-b pb-4 border-neutral-200 dark:border-neutral-800 text-sm font-black">
                        <button onClick={() => setActiveTab('details')} className={`pb-2 border-b-2 transition cursor-pointer ${activeTab === 'details' ? 'border-[#FACC15] text-[#FACC15]' : 'border-transparent text-neutral-400 hover:text-neutral-950 dark:hover:text-white'}`}>
                            Product Details & Specs
                        </button>
                        <button onClick={() => setActiveTab('reviews')} className={`pb-2 border-b-2 transition cursor-pointer ${activeTab === 'reviews' ? 'border-[#FACC15] text-[#FACC15]' : 'border-transparent text-neutral-400 hover:text-neutral-950 dark:hover:text-white'}`}>
                            Customer Feedback ({reviews.length})
                        </button>
                    </div>

                    <div className="py-6">
                        {activeTab === 'details' ? (
                            <div className="space-y-4 text-xs md:text-sm text-neutral-400 leading-relaxed">
                                <h3 className="font-bold text-neutral-950 dark:text-white text-base">Crafted for Excellence</h3>
                                <p>Every unit goes through rigorous quality control inspections to ensure absolute durability, flawless finish, and maximum operational efficiency.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((rev) => (
                                    <div key={rev.id} className={`p-5 rounded-2xl border space-y-2 ${darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className={`font-black ${darkMode ? 'text-white' : 'text-neutral-950'}`}>{rev.name}</span>
                                            <span className="text-neutral-400">{rev.date}</span>
                                        </div>
                                        <div className="flex items-center text-yellow-400">
                                            {[...Array(rev.rating)].map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-current" />))}
                                        </div>
                                        <p className="text-xs text-neutral-400">{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tight">Related Results</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => router.push(`/products/${item.id}`)}
                                    className={`group rounded-3xl border p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between ${darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'}`}
                                >
                                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 bg-neutral-100 dark:bg-neutral-950">
                                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    </div>
                                    <div className="space-y-1 mb-4">
                                        <h3 className="font-bold text-sm truncate">{item.title}</h3>
                                        <p className="text-xs text-neutral-400">Curated Item</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-black text-[#FACC15]">${item.price.toFixed(2)}</span>
                                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${darkMode ? 'bg-neutral-800 group-hover:bg-[#FACC15] group-hover:text-neutral-950' : 'bg-neutral-100 group-hover:bg-[#FACC15] group-hover:text-neutral-950'}`}>View</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <footer className={`border-t mt-20 transition-colors duration-300 ${darkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-400' : 'bg-white border-neutral-200 text-neutral-600'}`}>
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-[#FACC15] flex items-center justify-center text-neutral-950 font-black text-lg">P</div>
                            <span className="text-lg font-black tracking-tight text-neutral-950 dark:text-white">plugKe</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">Your ultimate destination for high-end tech, stylish apparel, and minimalist home furniture in Kenya.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}