'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Navbar } from '@/components/navbar';
import { Trash2, Eye } from 'lucide-react';

type SavedRecipe = {
  id: string;
  created_at: string;
  titre: string;
  temps: string;
  difficulte: string;
  ingredients: string[];
  etapes: string[];
};

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur:', error);
    } else {
      setRecipes(data || []);
    }
    
    setLoading(false);
  };

  const deleteRecipe = async (id: string, recipeTitle: string) => {
    if (!confirm(`Supprimer "${recipeTitle}" ? Cette action est irréversible.`)) return;

    try {
      toast.loading('Suppression en cours...', { id: 'delete-recipe' });

      const { data, error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(error.message || 'Erreur inconnue');
      }

      if (!data || data.length === 0) {
        throw new Error('Recette non trouvée ou déjà supprimée');
      }

      setRecipes(recipes.filter(r => r.id !== id));
      toast.success('✅ Recette supprimée avec succès', { id: 'delete-recipe' });
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      const errorMessage = error?.message || 'Erreur inconnue lors de la suppression';
      toast.error(`❌ Échec de la suppression: ${errorMessage}`, {
        id: 'delete-recipe',
        duration: 5000
      });
    }
  };

  const viewRecipe = (recipe: SavedRecipe) => {
    localStorage.setItem('recipe', JSON.stringify(recipe));
    router.push('/recipe');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">📚 Mes recettes sauvegardées</h1>

        {recipes.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">Aucune recette sauvegardée pour le moment.</p>
            <Button onClick={() => router.push('/')} className="mt-4">
              Générer une recette
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold mb-2">{recipe.titre}</h3>
                <div className="text-sm text-gray-600 mb-4 space-y-1">
                  <p>⏱️ {recipe.temps}</p>
                  <p>📊 {recipe.difficulte}</p>
                  <p className="text-xs">
                    {new Date(recipe.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => viewRecipe(recipe)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </Button>
                  <Button
                    onClick={() => deleteRecipe(recipe.id, recipe.titre)}
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}