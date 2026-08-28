'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ShoppingCart } from 'lucide-react'

export default function ProductDetail() {
    const params = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProductDetails() {
            if (!params?.id) return

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', params.id)
                .maybeSingle()

            if (error) {
                console.error('Error fetching product:', error.message)
            } else {
                setProduct(data)
            }
            setLoading(false)
        }

        fetchProductDetails()
    }, [params?.id])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-neutral-400 font-sans">Loading product...</div>
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center font-sans text-neutral-800 p-6 text-center bg-white">
                <h2 className="text-2xl font-black mb-2 text-neutral-950">Product Not Found</h2>
                <p className="text-neutral-500 text-sm mb-6">Could not locate product with ID: <span className="font-mono text-xs bg-neutral-100 p-1 rounded text-neutral-800">{params?.id}</span></p>
                <button onClick={() => router.push('/')} className="px-5 py-2.5 bg-[#FACC15] text-neutral-950 font-bold text-xs rounded-xl shadow-sm hover:bg-yellow-400 transition">
                    Back to Home
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white text-neutral-900 font-sans p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-950 mb-8 transition"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Catalog
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <div className="w-full h-[380px] md:h-[450px] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-sm">
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image Available</div>
                        )}
                    </div>

                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-neutral-950 text-xs font-black uppercase mb-4 tracking-wider">
                                In Stock
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-black text-neutral-950 mb-4">{product.title}</h1>
                            <p className="text-2xl font-black text-neutral-950 mb-6">${product.price}</p>
                            <p className="text-neutral-600 text-sm font-light leading-relaxed mb-8">{product.description || "No description provided."}</p>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#FACC15] text-neutral-950 font-bold text-sm rounded-xl hover:bg-yellow-400 transition shadow-sm">
                            <ShoppingCart className="w-4 h-4" /> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}