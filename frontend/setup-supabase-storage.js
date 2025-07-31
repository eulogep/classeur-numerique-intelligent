const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://vmqlhrtnerijjtzhjqpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcWxocnRuZXJpamp0emhqcXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MjA4MjAsImV4cCI6MjA2OTM5NjgyMH0.KQhw2N5PoLkXLiCJTdNe8EHxWpGc9umhfUdHP-URQEQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSupabaseStorage() {
  console.log('🚀 Configuration du bucket Supabase Storage...\n');

  try {
    // 1. Vérifier les buckets existants
    console.log('📋 Vérification des buckets existants...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erreur lors de la récupération des buckets:', bucketsError);
      return;
    }

    console.log('Buckets existants:', buckets.map(b => b.name));

    // 2. Vérifier si le bucket "documents" existe
    const documentsBucket = buckets.find(bucket => bucket.name === 'documents');
    
    if (documentsBucket) {
      console.log('✅ Le bucket "documents" existe déjà');
    } else {
      console.log('❌ Le bucket "documents" n\'existe pas');
      console.log('⚠️  Vous devez créer le bucket manuellement dans le dashboard Supabase');
      console.log('   - Allez sur https://supabase.com/dashboard/project/vmqlhrtnerijjtzhjqpd/storage');
      console.log('   - Cliquez sur "New bucket"');
      console.log('   - Nom: documents');
      console.log('   - Public bucket: ✅ Cochez');
      console.log('   - File size limit: 50MB');
      console.log('   - Allowed MIME types: (laissez vide)\n');
    }

    // 3. Créer les politiques RLS
    console.log('🔐 Configuration des politiques RLS...');
    
    const policies = [
      {
        name: 'Users can upload documents',
        definition: `
          CREATE POLICY "Users can upload documents" ON storage.objects
          FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
        `
      },
      {
        name: 'Users can view documents',
        definition: `
          CREATE POLICY "Users can view documents" ON storage.objects
          FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
        `
      },
      {
        name: 'Users can delete documents',
        definition: `
          CREATE POLICY "Users can delete documents" ON storage.objects
          FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
        `
      }
    ];

    console.log('📝 Politiques RLS à créer :');
    policies.forEach((policy, index) => {
      console.log(`${index + 1}. ${policy.name}`);
    });

    console.log('\n📋 Instructions pour créer les politiques :');
    console.log('1. Allez sur https://supabase.com/dashboard/project/vmqlhrtnerijjtzhjqpd/storage');
    console.log('2. Cliquez sur le bucket "documents"');
    console.log('3. Allez dans l\'onglet "Policies"');
    console.log('4. Cliquez sur "New Policy" pour chaque politique ci-dessus');
    console.log('5. Copiez-collez le code SQL correspondant');

    console.log('\n🔧 Politique simple pour les tests (optionnel) :');
    console.log('CREATE POLICY "Allow all" ON storage.objects FOR ALL USING (true);');

    // 4. Test de connexion
    console.log('\n🧪 Test de connexion au bucket...');
    if (documentsBucket) {
      try {
        const { data: testFiles, error: testError } = await supabase.storage
          .from('documents')
          .list('', { limit: 1 });
        
        if (testError) {
          console.log('⚠️  Erreur de connexion au bucket:', testError.message);
          console.log('   Cela peut être normal si les politiques RLS ne sont pas encore configurées');
        } else {
          console.log('✅ Connexion au bucket réussie');
          console.log('📁 Fichiers dans le bucket:', testFiles.length);
        }
      } catch (error) {
        console.log('⚠️  Erreur lors du test:', error.message);
      }
    }

    console.log('\n🎯 Prochaines étapes :');
    console.log('1. Créez le bucket "documents" dans le dashboard Supabase');
    console.log('2. Configurez les politiques RLS');
    console.log('3. Testez l\'upload dans l\'application');
    console.log('4. Vérifiez que les fichiers apparaissent dans le bucket');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
  }
}

// Exécuter le script
setupSupabaseStorage(); 