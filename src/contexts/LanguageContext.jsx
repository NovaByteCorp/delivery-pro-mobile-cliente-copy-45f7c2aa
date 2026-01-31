import React, { createContext, useContext, useState, useEffect } from 'react';

// Traduções centralizadas - APENAS PT e EN
const translations = {
  pt: {
    // Welcome Page
    welcomeBack: "Bem-vindo(a) de volta!",
    loginOrSignup: "Faça login ou crie sua conta para continuar.",
    login: "Entrar",
    signup: "Cadastrar",
    email: "Email",
    password: "Senha",
    fullName: "Nome Completo",
    phone: "Telefone",
    passwordMin: "Senha (mínimo 6 caracteres)",
    loginButton: "Entrar",
    loggingIn: "Entrando...",
    createAccount: "Criar Conta",
    creatingAccount: "Criando conta...",
    invalidCredentials: "Email ou senha inválidos.",
    errorOccurred: "Ocorreu um erro. Tente novamente.",
    passwordLength: "A senha deve ter pelo menos 6 caracteres.",
    emailExists: "Este email já está cadastrado.",
    signupError: "Ocorreu um erro ao criar a conta. Tente novamente.",
    
    // Client Dashboard
    alwaysClose: "Sempre Perto,",
    alwaysOnTime: "Sempre a Tempo",
    searchFood: "Buscar comida",
    categories: "Categorias",
    popular: "Popular",
    fastFood: "Comida Rápida",
    
    // Settings
    settings: "Configurações",
    notifications: "Notificações",
    orderUpdates: "Atualizações de Pedido",
    orderStatus: "Status do seu pedido",
    promotions: "Promoções",
    specialOffers: "Ofertas especiais",
    newRestaurants: "Novos Restaurantes",
    platformNews: "Novidades na plataforma",
    newsletter: "Newsletter",
    newsByEmail: "Novidades por email",
    preferences: "Preferências",
    language: "Idioma",
    darkMode: "Modo Escuro",
    darkTheme: "Tema escuro",
    soundEffects: "Efeitos Sonoros",
    appSounds: "Sons do app",
    security: "Segurança",
    changePassword: "Alterar Senha",
    changeYourPassword: "Mude sua senha",
    logoutAccount: "Sair da Conta",
    confirmLogout: "Tem certeza que deseja sair?",
    allRightsReserved: "© 2024 Todos os direitos reservados",
    
    // Dashboard Comum
    dashboard: "Painel",
    orders: "Pedidos",
    restaurants: "Restaurantes",
    menu: "Cardápio",
    profile: "Perfil",
    logout: "Sair",
    search: "Buscar",
    filter: "Filtrar",
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    add: "Adicionar",
    view: "Ver",
    close: "Fechar",
    
    // Client Dashboard
    myOrders: "Meus Pedidos",
    orderHistory: "Histórico de Pedidos",
    favorites: "Favoritos",
    addresses: "Endereços",
    paymentMethods: "Métodos de Pagamento",
    
    // Restaurant Owner Dashboard
    myRestaurant: "Meu Restaurante",
    menuManagement: "Gerenciar Cardápio",
    orderManagement: "Gerenciar Pedidos",
    statistics: "Estatísticas",
    revenue: "Faturamento",
    
    // Driver Dashboard
    availableDeliveries: "Entregas Disponíveis",
    myDeliveries: "Minhas Entregas",
    earnings: "Ganhos",
    status: "Status",
    
    // Order Status
    pending: "Pendente",
    confirmed: "Confirmado",
    preparing: "Em Preparação",
    ready: "Pronto",
    inDelivery: "Em Entrega",
    delivered: "Entregue",
    cancelled: "Cancelado",
    
    // Common Messages
    success: "Sucesso!",
    error: "Erro!",
    warning: "Atenção!",
    loading: "Carregando...",
    noData: "Nenhum dado disponível",
    confirmAction: "Tem certeza que deseja realizar esta ação?",
  },
  
  en: {
    // Welcome Page
    welcomeBack: "Welcome back!",
    loginOrSignup: "Log in or create your account to continue.",
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    phone: "Phone",
    passwordMin: "Password (minimum 6 characters)",
    loginButton: "Login",
    loggingIn: "Logging in...",
    createAccount: "Create Account",
    creatingAccount: "Creating account...",
    invalidCredentials: "Invalid email or password.",
    errorOccurred: "An error occurred. Please try again.",
    passwordLength: "Password must be at least 6 characters.",
    emailExists: "This email is already registered.",
    signupError: "An error occurred while creating the account. Please try again.",
    
    // Client Dashboard
    alwaysClose: "Always Close,",
    alwaysOnTime: "Always On Time",
    searchFood: "Search food",
    categories: "Categories",
    popular: "Popular",
    fastFood: "Fast Food",
    
    // Settings
    settings: "Settings",
    notifications: "Notifications",
    orderUpdates: "Order Updates",
    orderStatus: "Your order status",
    promotions: "Promotions",
    specialOffers: "Special offers",
    newRestaurants: "New Restaurants",
    platformNews: "Platform news",
    newsletter: "Newsletter",
    newsByEmail: "News by email",
    preferences: "Preferences",
    language: "Language",
    darkMode: "Dark Mode",
    darkTheme: "Dark theme",
    soundEffects: "Sound Effects",
    appSounds: "App sounds",
    security: "Security",
    changePassword: "Change Password",
    changeYourPassword: "Change your password",
    logoutAccount: "Logout",
    confirmLogout: "Are you sure you want to logout?",
    allRightsReserved: "© 2024 All rights reserved",
    
    // Dashboard Comum
    dashboard: "Dashboard",
    orders: "Orders",
    restaurants: "Restaurants",
    menu: "Menu",
    profile: "Profile",
    logout: "Logout",
    search: "Search",
    filter: "Filter",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    view: "View",
    close: "Close",
    
    // Client Dashboard
    myOrders: "My Orders",
    orderHistory: "Order History",
    favorites: "Favorites",
    addresses: "Addresses",
    paymentMethods: "Payment Methods",
    
    // Restaurant Owner Dashboard
    myRestaurant: "My Restaurant",
    menuManagement: "Menu Management",
    orderManagement: "Order Management",
    statistics: "Statistics",
    revenue: "Revenue",
    
    // Driver Dashboard
    availableDeliveries: "Available Deliveries",
    myDeliveries: "My Deliveries",
    earnings: "Earnings",
    status: "Status",
    
    // Order Status
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready",
    inDelivery: "In Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    
    // Common Messages
    success: "Success!",
    error: "Error!",
    warning: "Warning!",
    loading: "Loading...",
    noData: "No data available",
    confirmAction: "Are you sure you want to perform this action?",
  }
};

// Criar o contexto
const LanguageContext = createContext();

// ✅ Provider do contexto - VERSÃO CORRIGIDA
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt');
  const [, forceUpdate] = useState(0); // ✅ ADICIONADO - Força re-render

  useEffect(() => {
    // Carregar idioma salvo ao iniciar
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
      // ✅ ADICIONADO - Força todos os componentes que usam o contexto a re-renderizar
      forceUpdate(prev => prev + 1);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;