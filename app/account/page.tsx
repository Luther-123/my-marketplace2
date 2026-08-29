'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { User, Lock, Bell, ShieldCheck, MapPin, LogOut, Save, Moon, Sun, HelpCircle, CheckCircle, Eye, EyeOff, Edit3, ShoppingCart, Package, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Order {
    id: string
    created_at: string
    total_amount: number
    status: string
    shipping_address: string
    items: { title: string; quantity: number; price: number }[]
}

export default function AccountPage() {
    const router = useRouter()
    const { darkMode, setDarkMode, cartCount, setIsCartOpen } = useCart()
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'address' | 'password' | 'notifications' | 'verification'>('profile')
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    // Orders state & pagination
    const [orders, setOrders] = useState<Order[]>([])
    const [loadingOrders, setLoadingOrders] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 5

    // Edit modes for sections
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [isEditingAddress, setIsEditingAddress] = useState(false)

    // Profile state
    const [fullName, setFullName] = useState('Luther Makori')
    const [email, setEmail] = useState('ongongoluther06@gmail.com')
    const [phone, setPhone] = useState('+254743818278')

    // Address state
    const [addressData, setAddressData] = useState({
        street: 'Ngong Town, Namanga Close',
        city: 'Kajiado',
        postalCode: '00200',
        country: 'Kenya'
    })

    // Password state & visibility toggles
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    // Notifications state
    const [notifs, setNotifs] = useState({ emailAlerts: true, orderUpdates: true, promoSMS: false })

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders()
        }
    }, [activeTab])

    const fetchOrders = async () => {
        setLoadingOrders(true)
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching orders:', error.message)
            } else {
                setOrders(data || [])
            }
        } catch (err) {
            console.error('Unexpected error fetching orders:', err)
        } finally {
            setLoadingOrders(false)
        }
    }

    // Pagination calculations
    const totalPages = Math.ceil(orders.length / rowsPerPage) || 1
    const startIndex = (currentPage - 1) * rowsPerPage
    const currentOrders = orders.slice(startIndex, startIndex + rowsPerPage)

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setIsEditingProfile(false)
            setSuccessMessage('Profile settings updated successfully!')
            setTimeout(() => setSuccessMessage(''), 4000)
        }, 600)
    }

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setIsEditingAddress(false)
            setSuccessMessage('Shipping address saved successfully!')
            setTimeout(() => setSuccessMessage(''), 4000)
        }, 600)
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwords.newPass !== passwords.confirm) {
            alert('New passwords do not match.')
            return
        }
        setLoading(true)
        const { error } = await supabase.auth.updateUser({ password: passwords.newPass })
        setLoading(false)
        if (error) {
            alert(`Error updating password: ${error.message}`)
        } else {
            setSuccessMessage('Password updated securely!')
            setPasswords({ current: '', newPass: '', confirm: '' })
            setTimeout(() => setSuccessMessage(''), 4000)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        localStorage.clear() // Clears the cached session token
        router.push('/signin') // Redirects back to login
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

            {/* Main Account Dashboard Layout */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className={`rounded-[2.5rem] border overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>

                    {/* Sidebar Navigation */}
                    <div className={`lg:col-span-4 p-6 md:p-8 border-b lg:border-b-0 lg:border-r flex flex-col justify-between ${darkMode ? 'border-neutral-800 bg-neutral-950/50' : 'border-neutral-200 bg-neutral-50/50'}`}>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#FACC15] text-neutral-950 font-black text-xl flex items-center justify-center shadow-md">
                                    {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="font-black text-base truncate">{fullName}</h2>
                                    <p className="text-xs text-neutral-400 truncate">{email}</p>
                                </div>
                            </div>

                            <nav className="space-y-1.5 font-semibold text-xs">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition cursor-pointer ${activeTab === 'profile' ? 'bg-[#FACC15] text-neutral-950 font-black shadow-sm' : darkMode ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'}`}
                                >
                                    <User className="w-4 h-4" /> Profile Settings
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition cursor-pointer ${activeTab === 'orders' ? 'bg-[#FACC15] text-neutral-950 font-black shadow-sm' : darkMode ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'}`}
                                >
                                    <Package className="w-4 h-4" /> Order History
                                </button>
                                <button
                                    onClick={() => setActiveTab('address')}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition cursor-pointer ${activeTab === 'address' ? 'bg-[#FACC15] text-neutral-950 font-black shadow-sm' : darkMode ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'}`}
                                >
                                    <MapPin className="w-4 h-4" /> Saved Addresses
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition cursor-pointer ${activeTab === 'password' ? 'bg-[#FACC15] text-neutral-950 font-black shadow-sm' : darkMode ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'}`}
                                >
                                    <Lock className="w-4 h-4" /> Password
                                </button>
                                <button
                                    onClick={() => setActiveTab('notifications')}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition cursor-pointer ${activeTab === 'notifications' ? 'bg-[#FACC15] text-neutral-950 font-black shadow-sm' : darkMode ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'}`}
                                >
                                    <Bell className="w-4 h-4" /> Notifications
                                </button>
                                <button
                                    onClick={() => setActiveTab('verification')}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition cursor-pointer ${activeTab === 'verification' ? 'bg-[#FACC15] text-neutral-950 font-black shadow-sm' : darkMode ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'}`}
                                >
                                    <ShieldCheck className="w-4 h-4" /> Verification
                                </button>
                            </nav>
                        </div>

                        <div className="pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-800">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-500/10 font-bold text-xs transition cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" /> Log out
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 p-6 md:p-10">
                        {successMessage && (
                            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 shrink-0" /> {successMessage}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div>
                                <div className="mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-black tracking-tight">Profile Settings</h1>
                                        <p className="text-xs text-neutral-400 mt-1">Manage your account preferences and secure details.</p>
                                    </div>
                                    {!isEditingProfile && (
                                        <button
                                            onClick={() => setIsEditingProfile(true)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-neutral-300 hover:bg-neutral-100'}`}
                                        >
                                            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-6 mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full bg-[#FACC15] text-neutral-950 font-black text-2xl flex items-center justify-center shadow-md">
                                            {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            disabled={!isEditingProfile}
                                            onClick={() => alert('Profile photo upload triggered!')}
                                            className={`px-5 py-2.5 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-sm mb-1.5 ${isEditingProfile ? 'bg-[#FACC15] text-neutral-950 hover:bg-yellow-400 cursor-pointer' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'}`}
                                        >
                                            Upload New
                                        </button>
                                        <p className="text-[11px] text-neutral-400">PNG, JPG or WEBP. Max size 2MB.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSaveProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Full Name</label>
                                            <input
                                                type="text" value={fullName} disabled={!isEditingProfile} onChange={(e) => setFullName(e.target.value)}
                                                className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none transition ${!isEditingProfile ? darkMode ? 'bg-neutral-900/30 border-neutral-800/80 text-neutral-300 cursor-default' : 'bg-neutral-50/80 border-neutral-200 text-neutral-700 cursor-default' : darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-[#FACC15]' : 'bg-white border-neutral-400 text-neutral-900 shadow-sm'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Email Address</label>
                                            <input
                                                type="email" value={email} disabled={!isEditingProfile} onChange={(e) => setEmail(e.target.value)}
                                                className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none transition ${!isEditingProfile ? darkMode ? 'bg-neutral-900/30 border-neutral-800/80 text-neutral-300 cursor-default' : 'bg-neutral-50/80 border-neutral-200 text-neutral-700 cursor-default' : darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-[#FACC15]' : 'bg-white border-neutral-400 text-neutral-900 shadow-sm'}`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Phone Number</label>
                                        <input
                                            type="tel" value={phone} disabled={!isEditingProfile} onChange={(e) => setPhone(e.target.value)}
                                            className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none transition ${!isEditingProfile ? darkMode ? 'bg-neutral-900/30 border-neutral-800/80 text-neutral-300 cursor-default' : 'bg-neutral-50/80 border-neutral-200 text-neutral-700 cursor-default' : darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-[#FACC15]' : 'bg-white border-neutral-400 text-neutral-900 shadow-sm'}`}
                                        />
                                    </div>

                                    {isEditingProfile && (
                                        <div className="flex items-center gap-4 pt-2">
                                            <button
                                                type="submit" disabled={loading}
                                                className="px-8 py-3.5 bg-[#FACC15] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-yellow-400 transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                            >
                                                <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingProfile(false)}
                                                className={`px-6 py-3.5 rounded-2xl font-bold text-xs border transition cursor-pointer ${darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-neutral-300 hover:bg-neutral-100'}`}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <div className="mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                                    <h1 className="text-2xl font-black tracking-tight">Order History</h1>
                                    <p className="text-xs text-neutral-400 mt-1">Track your previous purchases and delivery status.</p>
                                </div>

                                {loadingOrders ? (
                                    <div className="py-12 text-center text-xs text-neutral-400">Loading your orders...</div>
                                ) : orders.length === 0 ? (
                                    <div className={`p-12 rounded-2xl border text-center ${darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                                        <Package className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                                        <h3 className="font-bold text-sm mb-1">No orders placed yet</h3>
                                        <p className="text-xs text-neutral-400 mb-4">When you checkout items, they will appear right here.</p>
                                        <button
                                            onClick={() => router.push('/')}
                                            className="px-6 py-2.5 bg-[#FACC15] text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-400 transition cursor-pointer"
                                        >
                                            Start Shopping
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            {currentOrders.map((order) => (
                                                <div key={order.id} className={`p-6 rounded-2xl border space-y-4 ${darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-200 dark:border-neutral-800 text-xs">
                                                        <div>
                                                            <span className="font-bold text-neutral-400">Order ID: </span>
                                                            <span className="font-mono font-bold">#{order.id.slice(0, 8)}</span>
                                                        </div>
                                                        <div className="text-neutral-400">
                                                            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold w-fit">
                                                            <Check className="w-3.5 h-3.5" /> {order.status || 'pending'}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        {order.items?.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-center text-xs">
                                                                <span className="font-medium">{item.title} <span className="text-neutral-400">x{item.quantity}</span></span>
                                                                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-sm font-black">
                                                        <span>Total Paid</span>
                                                        <span className="text-[#FACC15]">${order.total_amount?.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination Controls */}
                                        <div className={`flex items-center justify-between pt-4 border-t text-xs font-semibold ${darkMode ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-600'}`}>
                                            <div>
                                                Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, orders.length)} of {orders.length} records
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span>Page {currentPage} of {totalPages}</span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={currentPage === 1}
                                                        className={`p-2 rounded-xl border transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${darkMode ? 'border-neutral-800 hover:bg-neutral-800' : 'border-neutral-300 hover:bg-neutral-100'}`}
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                        disabled={currentPage === totalPages}
                                                        className={`p-2 rounded-xl border transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${darkMode ? 'border-neutral-800 hover:bg-neutral-800' : 'border-neutral-300 hover:bg-neutral-100'}`}
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'address' && (
                            <div>
                                <div className="mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-black tracking-tight">Saved Addresses</h1>
                                        <p className="text-xs text-neutral-400 mt-1">Manage your default shipping and delivery destinations.</p>
                                    </div>
                                    {!isEditingAddress && (
                                        <button
                                            onClick={() => setIsEditingAddress(true)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-neutral-300 hover:bg-neutral-100'}`}
                                        >
                                            <Edit3 className="w-3.5 h-3.5" /> Edit Address
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleSaveAddress} className="space-y-6">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Street Address / Landmark / Building</label>
                                        <input
                                            type="text" required disabled={!isEditingAddress} placeholder="e.g., Enter your street address, building, or nearest landmark..."
                                            value={addressData.street} onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                                            className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none transition ${!isEditingAddress ? darkMode ? 'bg-neutral-900/30 border-neutral-800/80 text-neutral-300 cursor-default' : 'bg-neutral-50/80 border-neutral-200 text-neutral-700 cursor-default' : darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-[#FACC15]' : 'bg-white border-neutral-400 text-neutral-900 shadow-sm'}`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">City / County</label>
                                            <input
                                                type="text" required disabled={!isEditingAddress} placeholder="e.g., Nairobi, Kajiado..."
                                                value={addressData.city} onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                                                className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none transition ${!isEditingAddress ? darkMode ? 'bg-neutral-900/30 border-neutral-800/80 text-neutral-300 cursor-default' : 'bg-neutral-50/80 border-neutral-200 text-neutral-700 cursor-default' : darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-[#FACC15]' : 'bg-white border-neutral-400 text-neutral-900 shadow-sm'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Postal Code</label>
                                            <input
                                                type="text" disabled={!isEditingAddress} placeholder="e.g., 00100"
                                                value={addressData.postalCode} onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                                                className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none transition ${!isEditingAddress ? darkMode ? 'bg-neutral-900/30 border-neutral-800/80 text-neutral-300 cursor-default' : 'bg-neutral-50/80 border-neutral-200 text-neutral-700 cursor-default' : darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-[#FACC15]' : 'bg-white border-neutral-400 text-neutral-900 shadow-sm'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Country</label>
                                            <input
                                                type="text" required disabled={!isEditingAddress} placeholder="Kenya"
                                                value={addressData.country} onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                                                className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none transition ${!isEditingAddress ? darkMode ? 'bg-neutral-900/30 border-neutral-800/80 text-neutral-300 cursor-default' : 'bg-neutral-50/80 border-neutral-200 text-neutral-700 cursor-default' : darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-[#FACC15]' : 'bg-white border-neutral-400 text-neutral-900 shadow-sm'}`}
                                            />
                                        </div>
                                    </div>

                                    {isEditingAddress && (
                                        <div className="flex items-center gap-4 pt-2">
                                            <button
                                                type="submit" disabled={loading}
                                                className="px-8 py-3.5 bg-[#FACC15] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-yellow-400 transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                            >
                                                <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Address'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingAddress(false)}
                                                className={`px-6 py-3.5 rounded-2xl font-bold text-xs border transition cursor-pointer ${darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-neutral-300 hover:bg-neutral-100'}`}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div>
                                <div className="mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                                    <h1 className="text-2xl font-black tracking-tight">Security & Password</h1>
                                    <p className="text-xs text-neutral-400 mt-1">Update your password to keep your account secure.</p>
                                </div>

                                <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-lg">
                                    <div className="relative">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showCurrent ? 'text' : 'password'} required placeholder="••••••••"
                                                value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                className={`w-full rounded-2xl border px-4 py-3 pr-12 text-sm focus:outline-none transition ${darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-[#FACC15]' : 'bg-white border-neutral-400 text-neutral-900 shadow-sm'}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrent(!showCurrent)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition cursor-pointer"
                                                aria-label="Toggle password visibility"
                                            >
                                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNew ? 'text' : 'password'} required placeholder="••••••••"
                                                value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                                                className={`w-full rounded-2xl border px-4 py-3 pr-12 text-sm focus:outline-none transition ${darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-[#FACC15]' : 'bg-white border-neutral-400 text-neutral-900 shadow-sm'}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNew(!showNew)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition cursor-pointer"
                                                aria-label="Toggle password visibility"
                                            >
                                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Confirm New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirm ? 'text' : 'password'} required placeholder="••••••••"
                                                value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                className={`w-full rounded-2xl border px-4 py-3 pr-12 text-sm focus:outline-none transition ${darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-[#FACC15]' : 'bg-white border-neutral-400 text-neutral-900 shadow-sm'}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition cursor-pointer"
                                                aria-label="Toggle password visibility"
                                            >
                                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit" disabled={loading}
                                        className="px-8 py-3.5 bg-[#FACC15] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-yellow-400 transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        <Lock className="w-4 h-4" /> {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div>
                                <div className="mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                                    <h1 className="text-2xl font-black tracking-tight">Notification Preferences</h1>
                                    <p className="text-xs text-neutral-400 mt-1">Choose what updates you want to receive.</p>
                                </div>

                                <div className="space-y-4 max-w-lg">
                                    {[
                                        { key: 'emailAlerts', title: 'Email Alerts', desc: 'Receive daily updates about new featured items.' },
                                        { key: 'orderUpdates', title: 'Order & Shipping Updates', desc: 'Get live SMS and email notifications regarding your package.' },
                                        { key: 'promoSMS', title: 'Promotional Offers & Discounts', desc: 'Receive exclusive discount codes and clearance alerts.' },
                                    ].map((item) => (
                                        <label key={item.key} className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition ${darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                                            <div>
                                                <h4 className="font-bold text-sm mb-0.5">{item.title}</h4>
                                                <p className="text-xs text-neutral-400">{item.desc}</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={(notifs as any)[item.key]}
                                                onChange={(e) => setNotifs({ ...notifs, [item.key]: e.target.checked })}
                                                className="mt-1 w-4 h-4 accent-[#FACC15] cursor-pointer"
                                            />
                                        </label>
                                    ))}

                                    <button
                                        onClick={() => {
                                            setSuccessMessage('Notification preferences saved successfully!')
                                            setTimeout(() => setSuccessMessage(''), 4000)
                                        }}
                                        className="mt-4 px-8 py-3.5 bg-[#FACC15] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-yellow-400 transition shadow-md cursor-pointer"
                                    >
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'verification' && (
                            <div>
                                <div className="mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                                    <h1 className="text-2xl font-black tracking-tight">Account Verification</h1>
                                    <p className="text-xs text-neutral-400 mt-1">Verify your identity for secure order fulfillment in Kenya.</p>
                                </div>

                                <div className={`p-6 rounded-2xl border space-y-4 max-w-lg ${darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                                    <div className="flex items-center gap-3 text-emerald-500 font-bold text-sm">
                                        <ShieldCheck className="w-6 h-6" /> Phone Number Verified (+254 743 818 278)
                                    </div>
                                    <p className="text-xs text-neutral-400 leading-relaxed">Your account is fully verified via M-Pesa secure token checks. You are cleared for express order fulfillment nationwide.</p>
                                    <button
                                        onClick={() => alert('Identity verification documentation submitted!')}
                                        className="px-6 py-3 bg-[#FACC15] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-400 transition shadow-sm cursor-pointer"
                                    >
                                        Update KYC Documents
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

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
                            <li><Link href="/account" className="hover:text-neutral-950 dark:hover:text-white transition">Profile Settings</Link></li>
                            <li><Link href="/help" className="hover:text-neutral-950 dark:hover:text-white transition">Help Center</Link></li>
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