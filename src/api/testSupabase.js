import { supabase } from './supabase';

export async function testSupabaseConnection() {
  const { data, error } = await supabase.from('Category').select('*').limit(1);

  if (error) {
    console.error("❌ Erro ao conectar ao Supabase:", error.message);
  } else {
    console.log("✅ Conexão Supabase bem-sucedida! Exemplo de dado:", data);
  }
}
