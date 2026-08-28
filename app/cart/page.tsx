'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, User, HelpCircle, Moon, Sun } from 'lucide-react'

export default function CartPage() {
    const router = useRouter()
    const { cart, updateQuantity, removeFromCart, cartCount, setIsCartOpen, darkMode, setDarkMode } = useCart()

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 15.00
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

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

            {/* Cart Body */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight mb-1">Shopping Cart</h1>
                    <p className="text-xs text-neutral-400">Home / Shopping Cart</p>
                </div>

                {cart.length === 0 ? (
                    <div className={`p-16 rounded-3xl border text-center ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
                        <p className="text-xs text-neutral-400 mb-6">Discover our catalog and add items to your cart.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-[#FACC15] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-400 transition cursor-pointer"
                        >
                            Explore Catalog
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className={`lg:col-span-8 p-6 md:p-8 rounded-3xl border ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                            <div className="grid grid-cols-12 pb-4 border-b text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:border-neutral-800">
                                <span className="col-span-6">Product</span>
                                <span className="col-span-2 text-center">Price</span>
                                <span className="col-span-2 text-center">Quantity</span>
                                <span className="col-span-2 text-right">Subtotal</span>
                            </div>

                            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {cart.map((item) => (
                                    <div key={item.id} className="grid grid-cols-12 items-center py-5">
                                        <div className="col-span-6 flex items-center gap-4">
                                            <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded-xl object-cover border border-neutral-700 shrink-0" />
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-sm truncate">{item.title}</h3>
                                                <p className="text-xs text-neutral-400">Curated Item</p>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-rose-500 text-xs font-semibold flex items-center gap-1 mt-1 hover:underline cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-center text-sm font-bold">${item.price}</div>
                                        <div className="col-span-2 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer ${darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-neutral-300 hover:bg-neutral-100'}`}
                                            >
                                                -
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer ${darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-neutral-300 hover:bg-neutral-100'}`}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="col-span-2 text-right text-sm font-black">${(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary Box */}
                        <div className={`lg:col-span-4 p-6 md:p-8 rounded-3xl border h-fit space-y-4 ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                            <h3 className="text-base font-black mb-4">Order Summary</h3>
                            <div className={`space-y-2.5 py-4 border-y text-xs ${darkMode ? 'border-neutral-800 text-neutral-300' : 'border-neutral-200 text-neutral-600'}`}>
                                <div className="flex justify-between">
                                    <span>Total Items</span>
                                    <span className="font-bold">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-bold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2 text-base font-black">
                                <span>Total Amount</span>
                                <span className="text-xl text-[#FACC15]">${total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="w-full py-4 bg-[#FACC15] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-yellow-400 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Proceed to Checkout <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className={`border-t mt-20 transition-colors duration-300 ${darkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-400' : 'bg-white border-neutral-200 text-neutral-600'}`}>
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-[#FACC15] flex items-center justify-center text-neutral-950 font-black text-lg">
                                P
                            </div>
                            <span className="text-lg font-black tracking-tight text-neutral-950 dark:text-white">plugKe</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">Your ultimate destination for high-end tech, stylish apparel, and minimalist home furniture in Kenya.</p>
                    </div>

                    <div>
                        <h4 className="font-black text-sm text-neutral-950 dark:text-white mb-4 uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2.5 font-semibold">
                            <li><Link href="/" className="hover:text-[#FACC15] transition">Home Catalog</Link></li>
                            <li><Link href="/cart" className="hover:text-[#FACC15] transition">Shopping Cart</Link></li>
                            <li><Link href="/account" className="hover:text-[#FACC15] transition">Account Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-sm text-neutral-950 dark:text-white mb-4 uppercase tracking-wider">Customer Services</h4>
                        <ul className="space-y-2.5 font-semibold">
                            <li><Link href="/account" className="hover:text-[#FACC15] transition">Profile Settings</Link></li>
                            <li><Link href="/help" className="hover:text-[#FACC15] transition">Help Center</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-sm text-neutral-950 dark:text-white mb-4 uppercase tracking-wider">Contact Info</h4>
                        <p className="font-semibold mb-2">+254 712 345 678</p>
                        <p className="font-semibold mb-2">support@plugke.co.ke</p>
                        <p className="text-[11px]">Nairobi, Kenya</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}