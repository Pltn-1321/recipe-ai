import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { createServerClient } from '@/lib/supabase-server';

// Définir le schéma de notre recette
const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    titre: {
      type: Type.STRING,
    },
    temps: {
      type: Type.STRING,
    },
    difficulte: {
      type: Type.STRING,
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
    etapes: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
  },
  propertyOrdering: ["titre", "temps", "difficulte", "ingredients", "etapes"],
};

export async function POST(req: NextRequest) {
  try {
    const { ingredients, type } = await req.json();

    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers.get('authorization');
    const userToken = authHeader?.replace('Bearer ', '');

    console.log('🔑 Token reçu depuis Authorization header:', userToken ? 'Oui' : 'Non');

    // Vérifier l'authentification de l'utilisateur
    if (!userToken) {
      return NextResponse.json(
        { error: 'Non authentifié - Token manquant' },
        { status: 401 }
      );
    }

    // Récupérer la clé API de l'utilisateur depuis Supabase
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(userToken);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Erreur d\'authentification' },
        { status: 401 }
      );
    }

    // Récupérer la clé API Gemini de l'utilisateur
    console.log('🔍 Recherche clé API pour user_id:', user.id);
    console.log('🔍 Table user_settings accessible ?');

    // D'abord tester si la table existe et est accessible
    const { data: testTable, error: tableError } = await supabase
      .from('user_settings')
      .select('count')
      .limit(1);

    console.log('📊 Test accès table:', { testTable, tableError });

    if (tableError) {
      console.error('❌ Erreur accès table user_settings:', tableError);
      return NextResponse.json(
        { error: 'Table user_settings non accessible. Erreur: ' + tableError.message },
        { status: 500 }
      );
    }

    // Debug : Vérifier toutes les entrées dans la table
    console.log('🔍 User ID authentifié:', user.id);
    console.log('🔍 Email utilisateur:', user.email);

    // D'abord voir toutes les entrées de la table
    const { data: allEntries, error: allEntriesError } = await supabase
      .from('user_settings')
      .select('*')
      .limit(10); // Voir toutes les entrées

    console.log('📊 Toutes les entrées de user_settings:', { allEntries, allEntriesError });

    // Maintenant chercher spécifiquement pour cet utilisateur
    const { data: userSettings, error: userError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id);

    console.log('📊 Settings pour cet utilisateur:', { userSettings, userError });

    if (userError) {
      console.error('❌ Erreur récupération settings utilisateur:', userError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des paramètres: ' + userError.message },
        { status: 500 }
      );
    }

    // Debug détaillé
    console.log('📊 Debug détaillé:');
    console.log('- Nombre total d\'entrées dans table:', allEntries?.length || 0);
    console.log('- Entrées pour cet utilisateur:', userSettings?.length || 0);
    console.log('- user_id cherché:', user.id);

    if (userSettings && userSettings.length > 0) {
      console.log('- user_id trouvé:', userSettings[0].user_id);
      console.log('- clé API présente:', !!userSettings[0].gemini_api_key);
      console.log('- premiers caractères clé:', userSettings[0].gemini_api_key?.substring(0, 10) + '...');
    }

    // Si on a plusieurs résultats, prendre le premier
    const settings = userSettings && userSettings.length > 0 ? userSettings[0] : null;

    if (!settings?.gemini_api_key) {
      console.error('❌ Aucune clé API trouvée pour user:', user.id);
      console.error('❌ userSettings:', userSettings);
      return NextResponse.json(
        { error: `Clé API Gemini non configurée. user_id: ${user.id}, entrées trouvées: ${userSettings?.length || 0}` },
        { status: 403 }
      );
    }

    console.log('✅ Clé API trouvée pour utilisateur:', user.email);
    console.log('✅ Clé API (premiers caractères):', settings.gemini_api_key.substring(0, 10) + '...');

    const apiKey = settings.gemini_api_key;
    const ai = new GoogleGenAI({ apiKey });

    console.log('📤 Génération de la recette pour utilisateur:', user.email);
    
        const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Génère une délicieuse recette de cuisine de type "${type}" en utilisant ces ingrédients : ${ingredients}. La difficulté doit être "facile", "moyen" ou "difficile".`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipeSchema,
      },
    });
    
      const recipe = JSON.parse(response.text || '{}');
    
    console.log('✅ Recette générée:', recipe);
    return NextResponse.json({ recipe });
    
  } catch (error) {
    console.error('💥 Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: String(error) },
      { status: 500 }
    );
  }
}