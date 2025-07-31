const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://vmqlhrtnerijjtzhjqpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcWxocnRuZXJpamp0emhqcXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MjA4MjAsImV4cCI6MjA2OTM5NjgyMH0.KQhw2N5PoLkXLiCJTdNe8EHxWpGc9umhfUdHP-URQEQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorageConfiguration() {
  console.log('🧪 Test de la configuration Supabase Storage...\n');

  try {
    // 1. Vérifier les buckets
    console.log('📋 Vérification des buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erreur lors de la récupération des buckets:', bucketsError);
      return;
    }

    console.log('Buckets disponibles:', buckets.map(b => `${b.name} (${b.public ? 'Public' : 'Private'})`));

    const documentsBucket = buckets.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.log('❌ Le bucket "documents" n\'existe pas encore');
      console.log('⚠️  Veuillez créer le bucket selon le guide SUPABASE_SETUP_STEP_BY_STEP.md');
      return;
    }

    console.log('✅ Bucket "documents" trouvé');
    console.log(`   - Public: ${documentsBucket.public ? 'Oui' : 'Non'}`);
    console.log(`   - Taille limite: ${documentsBucket.file_size_limit || 'Non définie'}`);

    // 2. Test de connexion au bucket
    console.log('\n🔗 Test de connexion au bucket...');
    const { data: files, error: listError } = await supabase.storage
      .from('documents')
      .list('', { limit: 10 });

    if (listError) {
      console.log('⚠️  Erreur lors de la lecture du bucket:', listError.message);
      console.log('   Cela peut indiquer un problème avec les politiques RLS');
    } else {
      console.log('✅ Connexion au bucket réussie');
      console.log(`📁 Fichiers dans le bucket: ${files.length}`);
      if (files.length > 0) {
        console.log('   Fichiers:', files.map(f => f.name).join(', '));
      }
    }

    // 3. Test d'upload (simulation)
    console.log('\n📤 Test d\'upload (simulation)...');
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'Test de configuration Supabase Storage';
    
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(testFileName, testContent, {
          contentType: 'text/plain',
          upsert: true
        });

      if (uploadError) {
        console.log('❌ Erreur lors de l\'upload:', uploadError.message);
        console.log('   Vérifiez les politiques RLS pour INSERT');
      } else {
        console.log('✅ Upload réussi');
        console.log(`   Fichier créé: ${uploadData.path}`);

        // Nettoyer le fichier de test
        const { error: deleteError } = await supabase.storage
          .from('documents')
          .remove([testFileName]);

        if (deleteError) {
          console.log('⚠️  Erreur lors de la suppression du fichier de test:', deleteError.message);
        } else {
          console.log('✅ Fichier de test supprimé');
        }
      }
    } catch (error) {
      console.log('❌ Erreur lors du test d\'upload:', error.message);
    }

    // 4. Vérification des politiques RLS
    console.log('\n🔐 Vérification des politiques RLS...');
    console.log('📋 Politiques nécessaires :');
    console.log('   - Users can upload documents (INSERT)');
    console.log('   - Users can view documents (SELECT)');
    console.log('   - Users can delete documents (DELETE)');
    console.log('\n💡 Pour vérifier les politiques :');
    console.log('   1. Allez sur https://supabase.com/dashboard/project/vmqlhrtnerijjtzhjqpd/storage');
    console.log('   2. Cliquez sur le bucket "documents"');
    console.log('   3. Allez dans l\'onglet "Policies"');
    console.log('   4. Vérifiez que les 3 politiques existent');

    // 5. Recommandations
    console.log('\n🎯 Recommandations :');
    
    if (!documentsBucket.public) {
      console.log('⚠️  Le bucket n\'est pas public - assurez-vous que les politiques RLS sont correctes');
    }

    if (listError || uploadError) {
      console.log('⚠️  Des erreurs ont été détectées - vérifiez la configuration');
      console.log('📖 Consultez le guide SUPABASE_SETUP_STEP_BY_STEP.md');
    } else {
      console.log('✅ Configuration semble correcte');
      console.log('🚀 Vous pouvez maintenant tester l\'upload dans l\'application');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testStorageConfiguration(); 