'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { X, CheckCircle, Lock, CreditCard, ArrowRight, ArrowLeft, Trash2, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function CheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const router = useRouter()
    const { cart, setIsCartOpen, clearCart } = useCart() // <-- 1. Pull clearCart here
    const [isSubmitted, setIsSubmitted] = useState(false)
    // ...
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa' | 'apple'>('card')

    const [checkoutItems, setCheckoutItems] = useState<any[]>([])

    // Inside CheckoutModal.tsx, pre-populate and lock the email from Supabase auth
    useEffect(() => {
        if (isOpen) {
            setCheckoutItems([...cart])
            supabase.auth.getUser().then(({ data: { user } }) => {
                if (user?.email) {
                    setFormData(prev => ({ ...prev, email: user.email! }))
                }
            })
        }
    }, [isOpen, cart])

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'Kenya',
        phone: '',
        cardNumber: '',
        expiry: '',
        cvc: '',
    })

    if (!isOpen) return null

    const handleRemoveLocalItem = (id: string) => {
        setCheckoutItems(prev => prev.filter(item => item.id !== id))
    }

    const subtotal = checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 15.00
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const orderPayload = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            customer_email: formData.email,
            address: formData.address,
            city: formData.city,
            postal_code: formData.zip,
            phone: formData.phone,
            payment_method: paymentMethod,
            items: checkoutItems,
            total_amount: total,
            status: 'pending',
        }

        const { error } = await supabase.from('orders').insert([orderPayload])

        if (error) {
            console.error('Error saving order to Supabase:', error.message)
            alert('Failed to place order. Please try again.')
            return
        }

        clearCart() // <-- 2. Wipe the cart and localStorage immediately on success
        setIsSubmitted(true)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans overflow-y-auto">
            <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs" onClick={onClose} />

            <div className="relative w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden z-10 transition-colors duration-300 max-h-[90vh] flex flex-col bg-white text-neutral-900 border border-neutral-200">

                {/* Top Header Bar */}
                <div className="p-6 border-b flex items-center justify-between shrink-0 border-neutral-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FACC15] flex items-center justify-center text-neutral-950 font-black text-sm">
                            P
                        </div>
                        <span className="font-black text-lg tracking-tight text-neutral-950">plugKe Cart & Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                        <Lock className="w-3.5 h-3.5" /> Secure Checkout
                    </div>
                    <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-700 transition cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {isSubmitted ? (
                        <div className="py-16 text-center flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-neutral-950">Order Placed Successfully!</h2>
                            <p className="text-sm max-w-md text-neutral-600">
                                Thank you, <span className="font-bold text-neutral-950">{formData.firstName} {formData.lastName}</span>. Your order is confirmed and will be shipped to <span className="font-bold text-neutral-950">{formData.address}, {formData.city}</span>.
                            </p>
                            <button
                                onClick={() => {
                                    setIsSubmitted(false)
                                    onClose()
                                    setIsCartOpen(false)
                                    window.location.reload()
                                }}
                                className="mt-6 px-8 py-3.5 bg-[#FACC15] text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-400 transition shadow-sm cursor-pointer"
                            >
                                Back to Store
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Left Column: Shipping & Payment Information */}
                            <div className="lg:col-span-7 space-y-6">

                                {/* Shipping Information Section */}
                                <div className="p-6 rounded-2xl border bg-neutral-50 border-neutral-200">
                                    <h3 className="text-base font-black mb-4 text-neutral-950">Shipping Information</h3>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">First Name</label>
                                            <input
                                                type="text" required placeholder="John"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-white border-neutral-300 text-neutral-900 focus:border-neutral-500 placeholder-neutral-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Last Name</label>
                                            <input
                                                type="text" required placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-white border-neutral-300 text-neutral-900 focus:border-neutral-500 placeholder-neutral-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Email Address</label>
                                        <input
                                            type="email" required readOnly value={formData.email}
                                            className="w-full rounded-xl border px-3.5 py-2.5 text-sm bg-neutral-100 border-neutral-300 text-neutral-600 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Street Address</label>
                                        <input
                                            type="text" required placeholder="123 Main Street"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-white border-neutral-300 text-neutral-900 focus:border-neutral-500 placeholder-neutral-400"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">City</label>
                                            <input
                                                type="text" required placeholder="Nairobi"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-white border-neutral-300 text-neutral-900 focus:border-neutral-500 placeholder-neutral-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Postal Code</label>
                                            <input
                                                type="text" required placeholder="00100"
                                                value={formData.zip}
                                                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                                className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-white border-neutral-300 text-neutral-900 focus:border-neutral-500 placeholder-neutral-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Phone Number</label>
                                        <input
                                            type="tel" required placeholder="+254 712 345 678"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-white border-neutral-300 text-neutral-900 focus:border-neutral-500 placeholder-neutral-400"
                                        />
                                    </div>
                                </div>

                                {/* Payment Method Section */}
                                <div className="p-6 rounded-2xl border bg-neutral-50 border-neutral-200">
                                    <h3 className="text-base font-black mb-4 text-neutral-950">Payment Method</h3>

                                    <div className="space-y-3 mb-6">
                                        <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${paymentMethod === 'card' ? 'border-[#FACC15] bg-yellow-50' : 'border-neutral-200 bg-white'}`}>
                                            <div className="flex items-center gap-3">
                                                <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-[#FACC15]" />
                                                <span className="font-bold text-sm text-neutral-900">Credit / Debit Card</span>
                                            </div>
                                            <CreditCard className="w-4 h-4 text-neutral-500" />
                                        </label>

                                        <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${paymentMethod === 'mpesa' ? 'border-[#FACC15] bg-yellow-50' : 'border-neutral-200 bg-white'}`}>
                                            <div className="flex items-center gap-3">
                                                <input type="radio" name="payment" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} className="accent-[#FACC15]" />
                                                <span className="font-bold text-sm text-neutral-900">M-Pesa Express</span>
                                            </div>
                                            <span className="text-xs font-black bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded">Instant</span>
                                        </label>
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Card Number</label>
                                                <input
                                                    type="text" placeholder="4111 2222 3333 4444"
                                                    value={formData.cardNumber}
                                                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                                    className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-white border-neutral-300 text-neutral-900 focus:border-neutral-500 placeholder-neutral-400"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Expiry Date</label>
                                                    <input
                                                        type="text" placeholder="MM/YY"
                                                        value={formData.expiry}
                                                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                                                        className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-white border-neutral-300 text-neutral-900 focus:border-neutral-500 placeholder-neutral-400"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">CVC / CVV</label>
                                                    <input
                                                        type="password" placeholder="123" maxLength={4}
                                                        value={formData.cvc}
                                                        onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                                                        className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-white border-neutral-300 text-neutral-900 focus:border-neutral-500 placeholder-neutral-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Right Column: Order Summary & Totals */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="p-6 rounded-2xl border bg-neutral-50 border-neutral-200">
                                    <h3 className="text-base font-black mb-4 text-neutral-950">Order Summary ({checkoutItems.reduce((acc, item) => acc + item.quantity, 0)})</h3>

                                    {/* Items Scroll List with Remove Button */}
                                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-6">
                                        {checkoutItems.length === 0 ? (
                                            <p className="text-xs text-neutral-500 text-center py-6">No items in order summary.</p>
                                        ) : (
                                            checkoutItems.map((item) => (
                                                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border bg-white border-neutral-200 shadow-sm">
                                                    <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-neutral-200" />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-xs truncate text-neutral-950">{item.title}</h4>
                                                        <p className="text-[11px] text-neutral-500">Qty: {item.quantity}</p>
                                                    </div>
                                                    <span className="text-xs font-black mr-2 text-neutral-950">${(item.price * item.quantity).toFixed(2)}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveLocalItem(item.id)}
                                                        className="text-neutral-400 hover:text-rose-500 transition p-1 cursor-pointer"
                                                        title="Remove from summary"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Calculations */}
                                    <div className="space-y-2.5 py-4 border-y text-xs border-neutral-200 text-neutral-600">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span className="font-bold text-neutral-900">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span className="font-bold text-neutral-900">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Estimated Tax (8%)</span>
                                            <span className="font-bold text-neutral-900">${tax.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between py-4 text-base font-black">
                                        <span className="text-neutral-950">Total Amount</span>
                                        <span className="text-xl text-neutral-950">${total.toFixed(2)}</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onClose()
                                            router.push('/cart')
                                        }}
                                        className="w-full mt-2 py-4 bg-[#FACC15] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-yellow-400 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <ShoppingBag className="w-4 h-4" /> View Full Shopping Cart <ArrowRight className="w-4 h-4" />
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={checkoutItems.length === 0}
                                        className="w-full mt-2 py-3 bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Quick Checkout <ArrowRight className="w-4 h-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-full mt-2 py-2 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-neutral-600 hover:text-neutral-950"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
                                    </button>
                                </div>
                            </div>

                        </form>
                    )}
                </div>

            </div>
        </div>
    )
}