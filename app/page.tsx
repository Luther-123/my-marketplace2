'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import { ArrowRight, ShoppingBag, Menu, Search, Moon, Sun, Sparkles, ShoppingCart, User, Mail } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { cartCount, addToCart, setIsCartOpen, darkMode, setDarkMode } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*')
      if (error) {
        console.error('Error fetching products:', error.message, error.details, error.hint)
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`${darkMode ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900'} min-h-screen font-sans transition-colors duration-300 selection:bg-[#FACC15] selection:text-neutral-950`}>

      {/* ================= NAVBAR ================= */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${darkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white/80 border-neutral-100'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-lg bg-[#FACC15] flex items-center justify-center text-neutral-950 font-black text-xl tracking-tighter shadow-sm">
              P
            </div>
            <span className={`text-xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-neutral-950'}`}>plugKe</span>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div className={`relative w-full flex items-center rounded-xl border transition ${darkMode ? 'bg-neutral-900 border-neutral-800 text-white focus-within:border-yellow-400' : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus-within:border-neutral-400'}`}>
              <Search className="w-4 h-4 ml-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2 px-3 text-sm focus:outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Nav Icons & Actions: Cart, Account, Help, Dark Mode */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Help */}
            <Link
              href="/help"
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${darkMode ? 'text-neutral-300 hover:bg-neutral-900' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <Mail className="w-4 h-4" /> Help
            </Link>

            {/* Account */}
            <button
              onClick={() => router.push('/account')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${darkMode ? 'text-neutral-300 hover:bg-neutral-900' : 'text-neutral-600 hover:bg-neutral-100'}`}
              aria-label="Account"
            >
              <User className="w-4 h-4" /> <span className="hidden sm:inline">Account</span>
            </button>

            {/* Cart Button (Opens Drawer) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${darkMode ? 'bg-neutral-900 text-yellow-400 border border-neutral-800 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'}`}
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FACC15] text-neutral-950 font-black text-[10px] flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition ${darkMode ? 'bg-neutral-900 border-neutral-800 text-yellow-400 hover:bg-neutral-800' : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'}`}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className={`md:hidden p-2 cursor-pointer ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
              <Menu className="w-6 h-6" />
            </div>
          </div>

        </div>
      </header>

      <div className="md:hidden px-6 pt-4">
        <div className={`relative w-full flex items-center rounded-xl border transition ${darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}>
          <Search className="w-4 h-4 ml-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent py-2.5 px-3 text-sm focus:outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        <div className={`rounded-2xl border flex flex-col lg:flex-row items-center justify-between p-8 sm:p-16 overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-[#FEFCE8] border-yellow-100'}`}>

          <div className="max-w-xl z-10 mb-10 lg:mb-0">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-6 ${darkMode ? 'bg-neutral-800 text-yellow-400' : 'bg-yellow-100 text-yellow-800'}`}>
              <Sparkles className="w-3.5 h-3.5" /> Curated Marketplace
            </div>
            <h1 className={`text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-6 ${darkMode ? 'text-white' : 'text-neutral-950'}`}>
              Your Ultimate <br />Plug for Everything.
            </h1>
            <p className={`text-base sm:text-lg mb-8 font-normal ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Discover a diverse selection of high-end tech, stylish apparel, and minimalist home furniture.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                className={`flex items-center gap-3 px-7 py-4 font-bold rounded-xl shadow-md transition cursor-pointer ${darkMode ? 'bg-[#FACC15] text-neutral-950 hover:bg-yellow-400' : 'bg-neutral-950 text-white hover:bg-neutral-800'}`}
              >
                Explore Catalog <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="flex items-center gap-2 px-7 py-4 bg-[#FACC15] text-neutral-950 font-black rounded-xl shadow-md hover:bg-yellow-400 transition cursor-pointer"
              >
                Create Account <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative w-full lg:w-1/2 grid grid-cols-2 gap-4">
            <div className={`h-48 sm:h-60 rounded-xl overflow-hidden shadow-sm border ${darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-yellow-200'}`}>
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
                alt="Gadgets"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>
            <div className={`h-48 sm:h-60 rounded-xl overflow-hidden shadow-sm border mt-6 ${darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-yellow-200'}`}>
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
                alt="Furniture"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>
          </div>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { title: "Tech & Devices", count: "12+ Items", icon: "⚡" },
            { title: "Modern Furniture", count: "8+ Items", icon: "🛋️" },
            { title: "Apparel & Wear", count: "15+ Items", icon: "🧥" },
            { title: "Home Decor", count: "10+ Items", icon: "🪴" },
          ].map((cat, idx) => (
            <div key={idx} className={`p-5 rounded-xl border transition cursor-pointer flex items-center gap-4 ${darkMode ? 'bg-neutral-900 border-neutral-800 hover:border-yellow-400/50' : 'bg-neutral-50 border-neutral-100 hover:bg-yellow-50/50 hover:border-yellow-200'}`}>
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-neutral-900'}`}>{cat.title}</h3>
                <p className="text-xs text-neutral-400">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TRENDING CATEGORIES ================= */}
      <section className={`py-12 border-y mb-16 transition-colors duration-300 ${darkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-neutral-50/50 border-neutral-100'}`}>
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <h2 className={`text-2xl sm:text-3xl font-black ${darkMode ? 'text-white' : 'text-neutral-950'}`}>Trending Categories</h2>
          <p className="text-neutral-400 text-sm">Explore across different collections curated just for you.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Consumer Electronics", desc: "Latest gadgets, audio devices & smart accessories.", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", tag: "Tech" },
            { name: "Statement Furniture", desc: "Chairs, desks & minimalist living spaces.", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", tag: "Furniture" },
            { name: "Everyday Apparel", desc: "Cozy wear, streetwear & timeless outfits.", img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80", tag: "Fashion" },
          ].map((col, idx) => (
            <div
              key={idx}
              className={`group relative rounded-xl overflow-hidden h-[380px] flex flex-col justify-end p-8 cursor-pointer transition-all duration-300 border ${darkMode
                ? 'bg-neutral-900 border-neutral-800 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(250,204,21,0.15)] hover:border-yellow-400/50'
                : 'bg-white border-neutral-200 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:border-neutral-400'
                }`}
            >
              <img src={col.img} alt={col.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/40 to-transparent" />
              <div className="relative z-10 text-white">
                <span className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-neutral-950 text-xs font-black uppercase mb-3 tracking-wider">
                  {col.tag}
                </span>
                <h3 className="text-2xl font-black mb-2 tracking-tight">{col.name}</h3>
                <p className="text-sm text-neutral-300 font-light leading-relaxed">{col.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SUPABASE DYNAMIC INVENTORY ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12 mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-black ${darkMode ? 'text-white' : 'text-neutral-950'}`}>Live Inventory</h2>
            <p className="text-neutral-400 text-sm">Fetched directly from your live database tables.</p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading catalog items...</div>
        ) : filteredProducts.length === 0 ? (
          <div className={`p-12 rounded-2xl border text-center transition-colors duration-300 ${darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'}`}>
            <p className="font-medium mb-1">No products match your search criteria.</p>
            <p className="text-xs text-neutral-400">Try adjusting your search terms or add items to your Supabase table.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product: any) => (
              <div key={product.id} className={`rounded-2xl p-5 border shadow-sm hover:shadow-md transition flex flex-col justify-between group ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-100'}`}>
                <div>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} className="w-full h-48 rounded-xl object-cover mb-4 group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className={`w-full h-48 rounded-xl mb-4 overflow-hidden flex items-center justify-center border ${darkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-600' : 'bg-neutral-50 border-neutral-100 text-neutral-400'}`}>
                      <ShoppingBag className="w-8 h-8 opacity-20 group-hover:scale-110 transition duration-300" />
                    </div>
                  )}
                  <h3 className={`font-bold text-base mb-1 ${darkMode ? 'text-white' : 'text-neutral-950'}`}>{product.title}</h3>
                  <p className="text-neutral-400 text-xs line-clamp-2 mb-4 font-light">{product.description || "No description provided."}</p>
                </div>

                <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? 'border-neutral-800' : 'border-neutral-100'}`}>
                  <span className={`text-lg font-black ${darkMode ? 'text-white' : 'text-neutral-950'}`}>${product.price}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/products/${product.id}`)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl transition border ${darkMode ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-100'}`}
                    >
                      View
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-2 bg-[#FACC15] text-neutral-950 text-xs font-bold rounded-xl hover:bg-[#eab308] transition shadow-sm active:scale-95 cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= FOOTER / DIRECTORY SECTION ================= */}
      <footer id="contact" className="bg-neutral-950 text-white border-t border-neutral-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#FACC15] flex items-center justify-center text-neutral-950 font-black text-lg">
                P
              </div>
              <span className="text-lg font-black tracking-tight text-white">plugKe</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-400">Your ultimate destination for high-end tech, stylish apparel, and minimalist home furniture in Kenya.</p>
          </div>

          <div>
            <h4 className="font-black text-sm text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 font-semibold text-neutral-400">
              <li><Link href="/" className="hover:text-[#FACC15] transition">Home Catalog</Link></li>
              <li><Link href="/cart" className="hover:text-[#FACC15] transition">Shopping Cart</Link></li>
              <li><Link href="/account" className="hover:text-[#FACC15] transition">Account Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-sm text-white mb-4 uppercase tracking-wider">Customer Services</h4>
            <ul className="space-y-2.5 font-semibold text-neutral-400">
              <li><Link href="/account" className="hover:text-[#FACC15] transition">Profile Settings</Link></li>
              <li><Link href="/help" className="hover:text-[#FACC15] transition">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-sm text-white mb-4 uppercase tracking-wider">Contact Info</h4>
            <p className="font-semibold text-neutral-400 mb-2">+254 712 345 678</p>
            <p className="font-semibold text-neutral-400 mb-2">support@plugke.co.ke</p>
            <p className="text-[11px] text-neutral-500">Nairobi, Kenya</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© 2026 plugKe. All rights reserved. Powered by Next.js & Supabase.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  )
}