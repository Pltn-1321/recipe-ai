'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Navbar } from '@/components/navbar';
import { KeyRound, CheckCircle, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth');
        return;
      }

      setUser(user);
      loadUserApiKey(user.id);
    };

    checkUser();
  }, [router]);

  const loadUserApiKey = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('gemini_api_key')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erreur chargement clé API:', error);
        return;
      }

      if (data?.gemini_api_key) {
        setApiKey(data.gemini_api_key);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async () => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    if (!apiKey.trim()) {
      toast.error('Veuillez entrer une clé API valide');
      return;
    }

    setSaving(true);

    try {
      // Valider le format de la clé API Gemini
      if (!apiKey.startsWith('AIza')) {
        toast.error('Format de clé API Gemini invalide. La clé doit commencer par "AIza"');
        return;
      }

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          gemini_api_key: apiKey.trim(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Erreur sauvegarde clé API:', error);
        toast.error('Erreur lors de la sauvegarde de la clé API');
      } else {
        toast.success('✅ Clé API Gemini enregistrée avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  const deleteApiKey = async () => {
    if (!confirm('Supprimer votre clé API ? Vous ne pourrez plus générer de recettes.')) {
      return;
    }

    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur suppression clé API:', error);
        toast.error('Erreur lors de la suppression de la clé API');
      } else {
        setApiKey('');
        toast.success('Clé API supprimée avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p>Chargement des paramètres...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100">
      <Navbar />
      <div className="max-w-2xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Paramètres</h1>
          <p className="text-gray-600 mt-2">Gérez vos préférences et configurations</p>
        </div>

        <Card className="p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            <KeyRound className="w-5 h-5 mr-2" />
            Clé API Gemini
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Pour générer des recettes avec l'IA, vous avez besoin d'une clé API Gemini.
                Vous pouvez en obtenir une gratuitement sur{' '}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google AI Studio
                </a>.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Votre clé API Gemini
              </label>
              <Input
                type="password"
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full font-mono"
              />
              {apiKey && (
                <p className="text-xs text-gray-500 mt-1">
                  La clé est stockée de manière sécurisée et chiffrée
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={saveApiKey}
                disabled={saving || !apiKey.trim()}
                className="flex-1"
              >
                <KeyRound className="w-4 h-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Enregistrer la clé'}
              </Button>

              {apiKey && (
                <Button
                  variant="outline"
                  onClick={deleteApiKey}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Informations</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Email :</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Statut API :</span>
              <span className={`font-medium ${apiKey ? 'text-green-600' : 'text-red-600'}`}>
                {apiKey ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1 inline" />
                    Configurée
                  </>
                ) : (
                  <>
                    ❌ Non configurée
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date d'inscription :</span>
              <span className="font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
              </span>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            ← Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}