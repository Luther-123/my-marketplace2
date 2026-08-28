'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface CartItem {
    id: string
    title: string
    price: number
    image_url: string
    quantity: number
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (product: any) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    isCartOpen: boolean
    setIsCartOpen: (open: boolean) => void
    cartCount: number
    darkMode: boolean
    setDarkMode: (dark: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('plugke_cart')
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart))
            } catch (e) {
                console.error('Failed to parse cart from localStorage:', e)
            }
        }
        setIsInitialized(true)
    }, [])

    // Save cart to localStorage whenever it changes (after initial load)
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('plugke_cart', JSON.stringify(cart))
        }
    }, [cart, isInitialized])

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
                )
            }
            return [...prev, {
                id: product.id,
                title: product.title || product.name,
                price: product.price,
                image_url: product.image_url || product.image,
                quantity: product.quantity || 1
            }]
        })
        setIsCartOpen(true)
    }

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id)
            return
        }
        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
    }

    const clearCart = () => setCart([])

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen, cartCount, darkMode, setDarkMode }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within a CartProvider')
    return context
}