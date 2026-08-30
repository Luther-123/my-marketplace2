'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CheckoutModal from '@/components/CheckoutModal'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
    const router = useRouter()
    const { cart, removeFromCart, isCartOpen, setIsCartOpen } = useCart()
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

    if (!isCartOpen) return null

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

    const handleCheckoutClick = async () => {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            setIsCartOpen(false)
            router.push('/signup')
            return
        }

        setIsCheckoutOpen(true)
    }

    return (
        <>
            <div className="fixed inset-0 z-50 overflow-hidden font-sans">
                <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />

                <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                    <div className="w-screen max-w-md shadow-2xl flex flex-col justify-between transition-colors duration-300 bg-white text-neutral-900 border-l border-neutral-200">

                        {/* Header */}
                        <div className="p-6 border-b flex items-center justify-between border-neutral-100">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-neutral-950" />
                                <h2 className="text-base font-black text-neutral-950">Your Cart</h2>
                            </div>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 transition text-neutral-400 hover:text-neutral-950 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400">
                                    <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
                                    <p className="text-sm font-medium">Your cart is empty</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center p-3 rounded-2xl border transition bg-neutral-50/50 border-neutral-100 shadow-sm">
                                        <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded-xl object-cover border border-neutral-200" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm line-clamp-1 text-neutral-950">{item.title}</h4>
                                            <p className="text-xs text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                                            <p className="text-xs font-black mt-1 text-neutral-950">Ksh {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-neutral-400 hover:text-rose-500 transition cursor-pointer">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer & Checkout Trigger */}
                        <div className="p-6 border-t bg-neutral-50 border-neutral-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Subtotal</span>
                                <span className="text-xl font-black text-neutral-950">Ksh {subtotal.toLocaleString()}</span>
                            </div>
                            <button
                                disabled={cart.length === 0}
                                onClick={handleCheckoutClick}
                                className="w-full py-4 bg-[#FACC15] text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-400 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Proceed to Checkout
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        </>
    )
}