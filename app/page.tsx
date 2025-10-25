'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Navbar } from '@/components/navbar';
import { RefreshCw, Beaker } from 'lucide-react';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  // Recettes statiques pour les tests
  const testRecipes = [
    {
      titre: "Poulet Basquaise",
      temps: "45 minutes",
      difficulte: "Moyen",
      ingredients: [
        "4 filets de poulet",
        "2 poivrons rouges",
        "2 tomates",
        "1 oignon",
        "3 gousses d'ail",
        "1 verre de vin blanc",
        "Huile d'olive",
        "Sel et poivre"
      ],
      etapes: [
        "Couper les filets de poulet en morceaux et les faire dorer dans l'huile d'olive",
        "Émincer l'oignon et l'ail, ajouter à la poêle",
        "Couper les poivrons et tomates en dés, ajouter à la préparation",
        "Verser le vin blanc et laisser mijoter 30 minutes à feu doux",
        "Saler, poivrer et servir avec du riz basmati"
      ]
    },
    {
      titre: "Quiche Lorraine",
      temps: "35 minutes",
      difficulte: "Facile",
      ingredients: [
        "1 pâte brisée",
        "200g de lardons fumés",
        "3 œufs",
        "20cl de crème fraîche",
        "100g de gruyère râpé",
        "Sel, poivre, noix de muscade"
      ],
      etapes: [
        "Préchauffer le four à 180°C",
        "Faire revenir les lardons dans une poêle sans matière grasse",
        "Dans un saladier, battre les œufs avec la crème, sel, poivre et muscade",
        "Étaler la pâte dans un moule à tarte, piquer le fond avec une fourchette",
        "Répartir les lardons et le gruyère sur la pâte",
        "Verser l'appareil à quiche et enfourner pour 25 minutes"
      ]
    },
    {
      titre: "Tarte Tatin",
      temps: "1h10 minutes",
      difficulte: "Moyen",
      ingredients: [
        "6 pommes golden",
        "200g de sucre",
        "100g de beurre",
        "1 pâte feuilletée",
        "1 gousse de vanille",
        "Beurre demi-sel pour le moule"
      ],
      etapes: [
        "Préchauffer le four à 180°C",
        "Éplucher et couper les pommes en quartiers",
        "Faire carameliser le sucre dans une poêle, ajouter le beurre",
        "Ajouter les pommes et la gousse de vanille fendue, cuire 15 minutes",
        "Beurrer un moule à manqué, disposer les pommes",
        "Recouvrir de pâte feuilletée, enfourner 30 minutes",
        "Démouler à chaud et servir tiède avec de la crème fraîche"
      ]
    }
  ];

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
      }
    };
    
    checkUser();
  }, [router, supabase]);

  
  const generateRecipe = async () => {
    setLoading(true);

    try {
      // Récupérer le token de l'utilisateur
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        toast.error('Vous devez être connecté pour générer des recettes');
        return;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ ingredients, type })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur API:', errorText);

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error?.includes('Clé API Gemini non configurée')) {
            toast.error('Clé API Gemini non configurée. Allez dans ⚙️ Paramètres pour la configurer.');
          } else {
            toast.error(errorData.error || 'Erreur lors de la génération de la recette');
          }
        } catch {
          toast.error('Erreur lors de la génération de la recette');
        }
        return;
      }

      const data = await response.json();
      console.log('Recette reçue:', data);

      if (data.recipe) {
        localStorage.setItem('recipe', JSON.stringify(data.recipe));
        router.push('/recipe');
      } else {
        toast.error('Aucune recette générée');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const generateStaticRecipe = () => {
    setLoading(true);

    try {
      // Choisir une recette au hasard parmi les recettes de test
      const randomRecipe = testRecipes[Math.floor(Math.random() * testRecipes.length)];

      // Stocker la recette dans localStorage
      localStorage.setItem('recipe', JSON.stringify(randomRecipe));

      toast.success(`Recette statique générée : ${randomRecipe.titre}`);

      // Rediriger vers la page de recette après un court délai
      setTimeout(() => {
        router.push('/recipe');
      }, 1000);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération de la recette statique');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100">
      <Navbar />
      <div className="max-w-2xl mx-auto p-8">
        
        <Card className="p-6 shadow-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Quels ingrédients as-tu ? 🥕
              </label>
              <Input
                placeholder="Ex: poulet, tomates, riz"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Type de plat 🍽️
              </label>
              <Input
                placeholder="Ex: plat principal, dessert, entrée"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={generateRecipe}
                disabled={loading || !ingredients || !type}
                className="w-full"
              >
                <>
              {loading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Génération en cours...' : 'Générer une recette (IA)'}
            </>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <Button
                onClick={generateStaticRecipe}
                disabled={loading}
                variant="outline"
                className="w-full border-dashed"
              >
                <Beaker className="w-4 h-4 mr-2" />
              Générer une recette de test
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}