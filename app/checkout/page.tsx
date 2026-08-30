'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { Lock, CreditCard, ArrowLeft, Trash2, ShoppingCart, CheckCircle, User, HelpCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function CheckoutPage() {
    const router = useRouter()
    const { cart, clearCart, setIsCartOpen, cartCount } = useCart()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card')
    const [checkoutItems, setCheckoutItems] = useState<any[]>([])

    useEffect(() => {
        setCheckoutItems([...cart])
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user?.email) {
                setFormData(prev => ({ ...prev, email: user.email! }))
            }
        })
    }, [cart])

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        country: 'Kenya',
        phone: '',
        cardNumber: '',
        expiry: '',
        cvc: '',
    })

    const handleRemoveLocalItem = (id: string) => {
        setCheckoutItems(prev => prev.filter(item => item.id !== id))
    }

    const subtotal = checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    const shipping = checkoutItems.length > 0 ? 400 : 0
    const total = subtotal + shipping

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

        clearCart()
        setIsSubmitted(true)
    }

    return (
        <div className="min-h-screen font-sans bg-neutral-100 text-neutral-900 transition-colors duration-300">

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 backdrop-blur-md border-b bg-white/80 border-neutral-200 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="w-10 h-10 rounded-xl bg-[#FACC15] flex items-center justify-center text-neutral-950 font-black text-xl shadow-sm">
                            P
                        </div>
                        <span className="text-xl font-black tracking-tight text-neutral-950">plugKe</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/account"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition text-neutral-600 hover:bg-neutral-100"
                        >
                            <User className="w-4 h-4" /> Account
                        </Link>

                        <Link
                            href="/help"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition text-neutral-600 hover:bg-neutral-100"
                        >
                            <HelpCircle className="w-4 h-4" /> Help
                        </Link>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FACC15] text-neutral-950 font-black text-[10px] flex items-center justify-center shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Checkout Body */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight mb-1 text-neutral-950">Secure Checkout</h1>
                        <p className="text-xs text-neutral-500">Home / Cart / Checkout</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3.5 py-1.5 rounded-full">
                        <Lock className="w-3.5 h-3.5" /> Fully Encrypted
                    </div>
                </div>

                {isSubmitted ? (
                    <div className="p-16 rounded-3xl border text-center bg-white border-neutral-200 space-y-4 max-w-xl mx-auto">
                        <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center mx-auto">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-neutral-950">Order Placed Successfully!</h2>
                        <p className="text-sm text-neutral-600">
                            Thank you, <span className="font-bold text-neutral-950">{formData.firstName} {formData.lastName}</span>. Your order is confirmed and will be shipped to <span className="font-bold text-neutral-950">{formData.address}, {formData.city}</span>.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="mt-6 px-8 py-3.5 bg-[#FACC15] text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-400 transition shadow-sm cursor-pointer"
                        >
                            Back to Store
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left Column: Shipping & Payment Information */}
                        <div className="lg:col-span-7 space-y-6">

                            <div className="p-6 md:p-8 rounded-3xl border bg-white border-neutral-200 shadow-sm space-y-6">
                                <h3 className="text-lg font-black text-neutral-950">Shipping Information</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">First Name</label>
                                        <input
                                            type="text" required placeholder="John"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-neutral-50 border-neutral-300 text-neutral-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Last Name</label>
                                        <input
                                            type="text" required placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-neutral-50 border-neutral-300 text-neutral-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Email Address</label>
                                    <input
                                        type="email" required readOnly value={formData.email}
                                        className="w-full rounded-xl border px-3.5 py-2.5 text-sm bg-neutral-100 border-neutral-300 text-neutral-600 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Street Address</label>
                                    <input
                                        type="text" required placeholder="123 Main Street"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-neutral-50 border-neutral-300 text-neutral-900"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">City</label>
                                        <input
                                            type="text" required placeholder="Nairobi"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-neutral-50 border-neutral-300 text-neutral-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Postal Code</label>
                                        <input
                                            type="text" required placeholder="00100"
                                            value={formData.zip}
                                            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                            className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-neutral-50 border-neutral-300 text-neutral-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Phone Number</label>
                                    <input
                                        type="tel" required placeholder="+254 712 345 678"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-neutral-50 border-neutral-300 text-neutral-900"
                                    />
                                </div>
                            </div>

                            <div className="p-6 md:p-8 rounded-3xl border bg-white border-neutral-200 shadow-sm space-y-4">
                                <h3 className="text-lg font-black text-neutral-950">Payment Method</h3>

                                <div className="space-y-3">
                                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'card' ? 'border-[#FACC15] bg-yellow-50/50' : 'border-neutral-200 bg-neutral-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-[#FACC15]" />
                                            <span className="font-bold text-sm text-neutral-900">Credit / Debit Card</span>
                                        </div>
                                        <CreditCard className="w-4 h-4 text-neutral-500" />
                                    </label>

                                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'mpesa' ? 'border-[#FACC15] bg-yellow-50/50' : 'border-neutral-200 bg-neutral-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" name="payment" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} className="accent-[#FACC15]" />
                                            <span className="font-bold text-sm text-neutral-900">M-Pesa Express</span>
                                        </div>
                                        <span className="text-xs font-black bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded">Instant</span>
                                    </label>
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="space-y-4 pt-2">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Card Number</label>
                                            <input
                                                type="text" placeholder="4111 2222 3333 4444"
                                                value={formData.cardNumber}
                                                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                                className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-neutral-50 border-neutral-300 text-neutral-900"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Expiry Date</label>
                                                <input
                                                    type="text" placeholder="MM/YY"
                                                    value={formData.expiry}
                                                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                                                    className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-neutral-50 border-neutral-300 text-neutral-900"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">CVC / CVV</label>
                                                <input
                                                    type="password" placeholder="123" maxLength={4}
                                                    value={formData.cvc}
                                                    onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                                                    className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none bg-neutral-50 border-neutral-300 text-neutral-900"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="p-6 md:p-8 rounded-3xl border bg-white border-neutral-200 shadow-sm space-y-4">
                                <h3 className="text-base font-black mb-4 text-neutral-950">Order Summary ({checkoutItems.reduce((acc, item) => acc + item.quantity, 0)})</h3>

                                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-6">
                                    {checkoutItems.length === 0 ? (
                                        <p className="text-xs text-neutral-500 text-center py-6">No items in order summary.</p>
                                    ) : (
                                        checkoutItems.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border bg-neutral-50 border-neutral-200">
                                                <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-neutral-200" />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-xs truncate text-neutral-950">{item.title}</h4>
                                                    <p className="text-[11px] text-neutral-500">Qty: {item.quantity}</p>
                                                </div>
                                                <span className="text-xs font-black mr-2 text-neutral-950">Ksh {(item.price * item.quantity).toLocaleString()}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveLocalItem(item.id)}
                                                    className="text-neutral-400 hover:text-rose-500 transition p-1 cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="space-y-2.5 py-4 border-y text-xs border-neutral-200 text-neutral-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-neutral-900">Ksh {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping Flat Rate</span>
                                        <span className="font-bold text-neutral-900">Ksh {shipping.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-2 text-base font-black">
                                    <span className="text-neutral-950">Total Amount</span>
                                    <span className="text-xl text-neutral-950">Ksh {total.toLocaleString()}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={checkoutItems.length === 0}
                                    className="w-full py-4 bg-[#FACC15] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-yellow-400 transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Place Order <Lock className="w-4 h-4" />
                                </button>

                                <Link
                                    href="/cart"
                                    className="w-full py-3 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 text-neutral-600 hover:text-neutral-950"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
                                </Link>
                            </div>
                        </div>

                    </form>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t mt-20 transition-colors duration-300 bg-white border-neutral-200 text-neutral-600">
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-[#FACC15] flex items-center justify-center text-neutral-950 font-black text-lg">
                                P
                            </div>
                            <span className="text-lg font-black tracking-tight text-neutral-950">plugKe</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-neutral-500">Your ultimate destination for high-end tech, stylish apparel, and minimalist home furniture in Kenya.</p>
                    </div>

                    <div>
                        <h4 className="font-black text-sm text-neutral-950 mb-4 uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2.5 font-semibold text-neutral-600">
                            <li><Link href="/" className="hover:text-neutral-950 transition">Home Catalog</Link></li>
                            <li><Link href="/cart" className="hover:text-neutral-950 transition">Shopping Cart</Link></li>
                            <li><Link href="/account" className="hover:text-neutral-950 transition">Account Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-sm text-neutral-950 mb-4 uppercase tracking-wider">Customer Services</h4>
                        <ul className="space-y-2.5 font-semibold text-neutral-600">
                            <li><Link href="/account" className="hover:text-neutral-950 transition">Profile Settings</Link></li>
                            <li><Link href="/help" className="hover:text-neutral-950 transition">Help Center</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-sm text-neutral-950 mb-4 uppercase tracking-wider">Contact Info</h4>
                        <p className="font-semibold mb-2 text-neutral-600">+254 712 345 678</p>
                        <p className="font-semibold mb-2 text-neutral-600">support@plugke.co.ke</p>
                        <p className="text-[11px] text-neutral-500">Nairobi, Kenya</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}