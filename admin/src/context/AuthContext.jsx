import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const demoAdmin = localStorage.getItem('krixtron_demo_admin')
    if (demoAdmin) {
      setAdmin(JSON.parse(demoAdmin))
      setLoading(false)
      return
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdmin(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!localStorage.getItem('krixtron_demo_admin')) {
        setAdmin(session?.user ?? null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    setLoading(true)

    // Bypass for demo purposes
    if (email === 'admin@gmail.com' && password === 'admin1234') {
      const mockAdmin = { id: 'demo', email: 'admin@gmail.com', username: 'Demo Admin' }
      setAdmin(mockAdmin)
      // Save to local storage to keep them logged in during refresh
      localStorage.setItem('krixtron_demo_admin', JSON.stringify(mockAdmin))
      setLoading(false)
      navigate('/dashboard')
      return true
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      throw error
    }

    if (data.user) {
      navigate('/dashboard')
      return true
    }
  }

  const logout = async () => {
    setLoading(true)
    localStorage.removeItem('krixtron_demo_admin')
    await supabase.auth.signOut()
    setAdmin(null)
    setLoading(false)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
