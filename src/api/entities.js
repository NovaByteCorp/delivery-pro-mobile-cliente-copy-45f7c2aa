import { supabase } from './supabase';


// Factory genérica para CRUD
const createEntity = (tableName) => ({
  async getAll() {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) throw error;
    return data;
  },


  async getById(id) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },


  // ✅ Adicione este método
  async filter(filters) {
    let query = supabase.from(tableName).select('*');
   
    // Aplicar cada filtro
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
   
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },


  // ✅ Adicione também um método get (alias para getById)
  async get(id) {
    return this.getById(id);
  },


  async create(values) {
    const { data, error } = await supabase
      .from(tableName)
      .insert(values)
      .select()
      .single();
    if (error) throw error;
    return data;
  },


  async update(id, values) {
    const { data, error } = await supabase
      .from(tableName)
      .update(values)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },


  async delete(id) {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) throw error;
    return true;
  },
});




// Agora instanciamos as tuas tabelas reais:
export const User = createEntity('SystemUser');
export const Restaurant = createEntity('Restaurant');
export const Product = createEntity('Product');
export const Category = createEntity('Category');
export const DeliveryPerson = createEntity('DeliveryPerson');
export const Order = createEntity('Order');
export const Support = createEntity('Support');
