'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Navbar } from '@/components/navbar';

type Recipe = {
  titre: string;
  temps: string;
  difficulte: string;
  ingredients: string[];
  etapes: string[];
};

export default function RecipePage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const savedRecipe = localStorage.getItem('recipe');
    if (savedRecipe) {
      setRecipe(JSON.parse(savedRecipe));
    }
  }, []);

  const saveRecipe = async () => {
    if (!recipe) return;
    
    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Tu dois être connecté pour sauvegarder');
        router.push('/auth');
        return;
      }
      
      const { error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          titre: recipe.titre,
          temps: recipe.temps,
          difficulte: recipe.difficulte,
          ingredients: recipe.ingredients,
          etapes: recipe.etapes,
        });
      
      if (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de la sauvegarde');
      } else {
        setSaved(true);
        toast.success('✅ Recette sauvegardée !');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
          >
            ← Retour
          </Button>

          <Button
            onClick={saveRecipe}
            disabled={saving || saved}
          >
            {saved ? '✅ Sauvegardée' : saving ? '💾 Sauvegarde...' : '💾 Sauvegarder'}
          </Button>
        </div>

        <Card className="p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-4">{recipe.titre}</h1>
          
          <div className="flex gap-4 mb-6 text-sm text-gray-600">
            <span>⏱️ {recipe.temps}</span>
            <span>📊 {recipe.difficulte}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">🛒 Ingrédients</h2>
            <ul className="list-disc list-inside space-y-2">
              {recipe.ingredients.map((ing, index) => (
                <li key={index}>{ing}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">👨‍🍳 Étapes</h2>
            <ol className="space-y-4">
              {recipe.etapes.map((etape, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <span className="pt-1">{etape}</span>
                </li>
              ))}
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}