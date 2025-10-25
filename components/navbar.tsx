'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { Home, Book, Settings, LogOut } from 'lucide-react';

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Déconnexion réussie');
      router.push('/auth');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4">
          <div className="text-xl font-bold">🍳 RecipeAI</div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4">
        {/* Logo et navigation */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors"
          >
            <span className="text-2xl">🍳</span>
            <span className="font-bold text-xl">RecipeAI</span>
          </button>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => router.push('/')}
              className="font-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>
            <Button
              variant={isActive('/my-recipes') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => router.push('/my-recipes')}
              className="font-medium"
            >
              <Book className="w-4 h-4 mr-2" />
              Mes recettes
            </Button>
            <Button
              variant={isActive('/settings') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => router.push('/settings')}
              className="font-medium"
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </nav>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Mobile menu */}
              <div className="md:hidden flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/my-recipes')}
                >
                  <Book className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/settings')}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              {/* User info & logout */}
              <span className="hidden sm:block text-sm text-gray-600">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="sm:hidden"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/auth')}
              >
                Connexion
              </Button>
              <Button
                size="sm"
                onClick={() => router.push('/auth')}
              >
                S'inscrire
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}