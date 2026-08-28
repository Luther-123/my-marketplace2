'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { User, HelpCircle, Send, CheckCircle, Moon, Sun, ShoppingCart } from 'lucide-react'

export default function HelpPage() {
    const router = useRouter()
    const { darkMode, setDarkMode, cartCount, setIsCartOpen } = useCart()
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
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

            {/* Main Help Content */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black tracking-tight mb-3">How can we help you?</h1>
                    <p className="text-sm text-neutral-400 max-w-md mx-auto">Get in touch with our support team or browse answers to common questions about orders and shipping.</p>
                </div>

                <div className={`p-8 md:p-12 rounded-[2.5rem] border shadow-xl ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                    {submitted ? (
                        <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-yellow-400/10 text-[#FACC15] flex items-center justify-center">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-black">Message Received!</h2>
                            <p className="text-xs text-neutral-400 max-w-sm">Thank you for reaching out. Our support team will get back to your email shortly.</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-4 px-6 py-3 bg-[#FACC15] text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-400 transition cursor-pointer"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Your Name</label>
                                    <input
                                        type="text" required placeholder="John Doe"
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none ${darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-[#FACC15]' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Email Address</label>
                                    <input
                                        type="email" required placeholder="john@example.com"
                                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none ${darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-[#FACC15]' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">How can we assist?</label>
                                <textarea
                                    rows={5} required placeholder="Describe your issue or inquiry here..."
                                    value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className={`w-full rounded-2xl border p-4 text-sm focus:outline-none resize-none ${darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-[#FACC15]' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-[#FACC15] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-yellow-400 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Send className="w-4 h-4" /> Submit Request
                            </button>
                        </form>
                    )}
                </div>
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