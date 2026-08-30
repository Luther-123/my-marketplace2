'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { User, ShieldAlert, Eye, EyeOff } from 'lucide-react'

export default function SignUpPage() {
    const router = useRouter()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.')
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        })

        if (error) {
            setErrorMsg(error.message)
            setLoading(false)
            return
        }

        router.push('/')
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 font-sans bg-neutral-100 text-neutral-900 transition-colors duration-300">

            <div className="w-full max-w-md p-8 md:p-10 rounded-[2.5rem] border shadow-sm bg-white border-neutral-200 text-neutral-900">

                {/* Avatar Icon Header */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative w-20 h-20 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center mb-3 text-neutral-950">
                        <User className="w-9 h-9" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#FACC15] text-neutral-950 flex items-center justify-center text-xs font-black shadow-sm">
                            +
                        </div>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-neutral-950">Create Account</h1>
                    <p className="text-xs text-neutral-500 mt-1">Sign up to get started with your dashboard.</p>
                </div>

                {errorMsg && (
                    <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-semibold flex items-start gap-2.5">
                        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>{errorMsg}</p>
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-3.5">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Full Name</label>
                        <input
                            type="text" required placeholder="Enter your name"
                            value={fullName} onChange={(e) => setFullName(e.target.value)}
                            className="w-full rounded-2xl border px-4 py-3 text-sm font-semibold focus:outline-none transition bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-400"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Email</label>
                        <input
                            type="email" required placeholder="Enter your email"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-2xl border px-4 py-3 text-sm font-semibold focus:outline-none transition bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-400"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'} required placeholder="Create a password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border px-4 pr-11 py-3 text-sm font-semibold focus:outline-none transition bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 transition cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'} required placeholder="Confirm your password"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-2xl border px-4 pr-11 py-3 text-sm font-semibold focus:outline-none transition bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 transition cursor-pointer"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full mt-2 py-3.5 bg-[#FACC15] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-yellow-400 transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Create Account'}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200" /></div>
                    <span className="relative px-3 text-xs uppercase tracking-widest font-semibold bg-white text-neutral-400">Or</span>
                </div>

                {/* Social Auth Icons */}
                <div className="flex items-center justify-center gap-4">
                    <button type="button" className="w-11 h-11 rounded-full border flex items-center justify-center transition bg-neutral-50 border-neutral-200 hover:border-neutral-300 text-neutral-900">
                        <span className="font-bold text-sm">G</span>
                    </button>
                    <button type="button" className="w-11 h-11 rounded-full border flex items-center justify-center transition bg-neutral-50 border-neutral-200 hover:border-neutral-300 text-neutral-900">
                        <span className="font-bold text-sm"></span>
                    </button>
                    <button type="button" className="w-11 h-11 rounded-full border flex items-center justify-center transition bg-neutral-50 border-neutral-200 hover:border-neutral-300 text-neutral-900">
                        <span className="font-bold text-sm">f</span>
                    </button>
                </div>

                {/* Footer Sign In Link */}
                <div className="mt-6 text-center text-xs font-bold text-neutral-600">
                    <span>Already have an account? </span>
                    <Link href="/signin" className="underline hover:text-neutral-950 transition ml-1 font-black text-neutral-950">
                        Sign In
                    </Link>
                </div>

            </div>
        </div>
    )
}