'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async () => {
  setLoading(true);
  
  try {
    if (isLogin) {
      // Connexion
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Résultat login:', { data, error });
      
      if (error) {
        toast.error('Erreur de connexion: ' + error.message);
      } else {
        toast.success('Connexion réussie !');
        router.push('/');
        router.refresh();
      }
    } else {
      // Inscription
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });
      
      console.log('Résultat signup:', { data, error });
      
      if (error) {
        toast.error('Erreur inscription: ' + error.message);
      } else {
        toast.success('Inscription réussie ! Tu peux maintenant te connecter.');
        setIsLogin(true); // Basculer vers le mode connexion
      }
    }
  } catch (error) {
    console.error('Erreur auth:', error);
    toast.error('Erreur: ' + error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center p-8">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          {isLogin ? '🔐 Connexion' : '✨ Inscription'}
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleAuth}
            disabled={loading || !email || !password}
            className="w-full"
          >
            {loading ? '⏳ Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
          </Button>
          
          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {isLogin ? "Pas de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}