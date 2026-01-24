import React, { createContext, useContext, useState, useEffect } from 'react';

// Traduções centralizadas
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
    settings: "Configurações",
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
    settings: "Settings",
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
  },
  
  es: {
    // Welcome Page
    welcomeBack: "¡Bienvenido de nuevo!",
    loginOrSignup: "Inicia sesión o crea tu cuenta para continuar.",
    login: "Entrar",
    signup: "Registrarse",
    email: "Correo electrónico",
    password: "Contraseña",
    fullName: "Nombre Completo",
    phone: "Teléfono",
    passwordMin: "Contraseña (mínimo 6 caracteres)",
    loginButton: "Entrar",
    loggingIn: "Entrando...",
    createAccount: "Crear Cuenta",
    creatingAccount: "Creando cuenta...",
    invalidCredentials: "Correo electrónico o contraseña inválidos.",
    errorOccurred: "Ocurrió un error. Inténtalo de nuevo.",
    passwordLength: "La contraseña debe tener al menos 6 caracteres.",
    emailExists: "Este correo electrónico ya está registrado.",
    signupError: "Ocurrió un error al crear la cuenta. Inténtalo de nuevo.",
    
    // Client Dashboard
    alwaysClose: "Siempre Cerca,",
    alwaysOnTime: "Siempre a Tiempo",
    searchFood: "Buscar comida",
    categories: "Categorías",
    popular: "Popular",
    fastFood: "Comida Rápida",
    
    // Settings
    settings: "Configuración",
    notifications: "Notificaciones",
    orderUpdates: "Actualizaciones de Pedido",
    orderStatus: "Estado de tu pedido",
    promotions: "Promociones",
    specialOffers: "Ofertas especiales",
    newRestaurants: "Nuevos Restaurantes",
    platformNews: "Novedades en la plataforma",
    newsletter: "Newsletter",
    newsByEmail: "Novedades por email",
    preferences: "Preferencias",
    language: "Idioma",
    darkMode: "Modo Oscuro",
    darkTheme: "Tema oscuro",
    soundEffects: "Efectos de Sonido",
    appSounds: "Sonidos de la app",
    security: "Seguridad",
    changePassword: "Cambiar Contraseña",
    changeYourPassword: "Cambia tu contraseña",
    logoutAccount: "Cerrar Sesión",
    confirmLogout: "¿Estás seguro de que deseas salir?",
    allRightsReserved: "© 2024 Todos los derechos reservados",
    
    // Dashboard Comum
    dashboard: "Panel",
    orders: "Pedidos",
    restaurants: "Restaurantes",
    menu: "Menú",
    profile: "Perfil",
    settings: "Configuración",
    logout: "Salir",
    search: "Buscar",
    filter: "Filtrar",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Añadir",
    view: "Ver",
    close: "Cerrar",
    
    // Client Dashboard
    myOrders: "Mis Pedidos",
    orderHistory: "Historial de Pedidos",
    favorites: "Favoritos",
    addresses: "Direcciones",
    paymentMethods: "Métodos de Pago",
    
    // Restaurant Owner Dashboard
    myRestaurant: "Mi Restaurante",
    menuManagement: "Gestionar Menú",
    orderManagement: "Gestionar Pedidos",
    statistics: "Estadísticas",
    revenue: "Ingresos",
    
    // Driver Dashboard
    availableDeliveries: "Entregas Disponibles",
    myDeliveries: "Mis Entregas",
    earnings: "Ganancias",
    status: "Estado",
    
    // Order Status
    pending: "Pendiente",
    confirmed: "Confirmado",
    preparing: "En Preparación",
    ready: "Listo",
    inDelivery: "En Entrega",
    delivered: "Entregado",
    cancelled: "Cancelado",
    
    // Common Messages
    success: "¡Éxito!",
    error: "¡Error!",
    warning: "¡Atención!",
    loading: "Cargando...",
    noData: "No hay datos disponibles",
    confirmAction: "¿Estás seguro de que deseas realizar esta acción?",
  },
  
  fr: {
    // Welcome Page
    welcomeBack: "Bon retour!",
    loginOrSignup: "Connectez-vous ou créez votre compte pour continuer.",
    login: "Connexion",
    signup: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    fullName: "Nom Complet",
    phone: "Téléphone",
    passwordMin: "Mot de passe (minimum 6 caractères)",
    loginButton: "Connexion",
    loggingIn: "Connexion...",
    createAccount: "Créer un Compte",
    creatingAccount: "Création du compte...",
    invalidCredentials: "Email ou mot de passe invalide.",
    errorOccurred: "Une erreur s'est produite. Veuillez réessayer.",
    passwordLength: "Le mot de passe doit contenir au moins 6 caractères.",
    emailExists: "Cet email est déjà enregistré.",
    signupError: "Une erreur s'est produite lors de la création du compte. Veuillez réessayer.",
    
    // Client Dashboard
    alwaysClose: "Toujours Proche,",
    alwaysOnTime: "Toujours à l'Heure",
    searchFood: "Rechercher de la nourriture",
    categories: "Catégories",
    popular: "Populaire",
    fastFood: "Restauration Rapide",
    
    // Settings
    settings: "Paramètres",
    notifications: "Notifications",
    orderUpdates: "Mises à Jour des Commandes",
    orderStatus: "Statut de votre commande",
    promotions: "Promotions",
    specialOffers: "Offres spéciales",
    newRestaurants: "Nouveaux Restaurants",
    platformNews: "Nouveautés de la plateforme",
    newsletter: "Newsletter",
    newsByEmail: "Nouvelles par email",
    preferences: "Préférences",
    language: "Langue",
    darkMode: "Mode Sombre",
    darkTheme: "Thème sombre",
    soundEffects: "Effets Sonores",
    appSounds: "Sons de l'app",
    security: "Sécurité",
    changePassword: "Changer le Mot de Passe",
    changeYourPassword: "Changez votre mot de passe",
    logoutAccount: "Se Déconnecter",
    confirmLogout: "Êtes-vous sûr de vouloir vous déconnecter?",
    allRightsReserved: "© 2024 Tous droits réservés",
    
    // Dashboard Comum
    dashboard: "Tableau de Bord",
    orders: "Commandes",
    restaurants: "Restaurants",
    menu: "Menu",
    profile: "Profil",
    settings: "Paramètres",
    logout: "Déconnexion",
    search: "Rechercher",
    filter: "Filtrer",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    view: "Voir",
    close: "Fermer",
    
    // Client Dashboard
    myOrders: "Mes Commandes",
    orderHistory: "Historique des Commandes",
    favorites: "Favoris",
    addresses: "Adresses",
    paymentMethods: "Méthodes de Paiement",
    
    // Restaurant Owner Dashboard
    myRestaurant: "Mon Restaurant",
    menuManagement: "Gestion du Menu",
    orderManagement: "Gestion des Commandes",
    statistics: "Statistiques",
    revenue: "Revenus",
    
    // Driver Dashboard
    availableDeliveries: "Livraisons Disponibles",
    myDeliveries: "Mes Livraisons",
    earnings: "Gains",
    status: "Statut",
    
    // Order Status
    pending: "En Attente",
    confirmed: "Confirmé",
    preparing: "En Préparation",
    ready: "Prêt",
    inDelivery: "En Livraison",
    delivered: "Livré",
    cancelled: "Annulé",
    
    // Common Messages
    success: "Succès!",
    error: "Erreur!",
    warning: "Attention!",
    loading: "Chargement...",
    noData: "Aucune donnée disponible",
    confirmAction: "Êtes-vous sûr de vouloir effectuer cette action?",
  },
  
  de: {
    // Welcome Page
    welcomeBack: "Willkommen zurück!",
    loginOrSignup: "Melden Sie sich an oder erstellen Sie Ihr Konto, um fortzufahren.",
    login: "Anmelden",
    signup: "Registrieren",
    email: "E-Mail",
    password: "Passwort",
    fullName: "Vollständiger Name",
    phone: "Telefon",
    passwordMin: "Passwort (mindestens 6 Zeichen)",
    loginButton: "Anmelden",
    loggingIn: "Anmeldung...",
    createAccount: "Konto Erstellen",
    creatingAccount: "Konto wird erstellt...",
    invalidCredentials: "Ungültige E-Mail oder Passwort.",
    errorOccurred: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    passwordLength: "Das Passwort muss mindestens 6 Zeichen lang sein.",
    emailExists: "Diese E-Mail ist bereits registriert.",
    signupError: "Beim Erstellen des Kontos ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    
    // Client Dashboard
    alwaysClose: "Immer Nah,",
    alwaysOnTime: "Immer Pünktlich",
    searchFood: "Essen suchen",
    categories: "Kategorien",
    popular: "Beliebt",
    fastFood: "Fast Food",
    
    // Settings
    settings: "Einstellungen",
    notifications: "Benachrichtigungen",
    orderUpdates: "Bestellaktualisierungen",
    orderStatus: "Status Ihrer Bestellung",
    promotions: "Aktionen",
    specialOffers: "Sonderangebote",
    newRestaurants: "Neue Restaurants",
    platformNews: "Plattform-Neuigkeiten",
    newsletter: "Newsletter",
    newsByEmail: "Neuigkeiten per E-Mail",
    preferences: "Einstellungen",
    language: "Sprache",
    darkMode: "Dunkler Modus",
    darkTheme: "Dunkles Thema",
    soundEffects: "Soundeffekte",
    appSounds: "App-Sounds",
    security: "Sicherheit",
    changePassword: "Passwort Ändern",
    changeYourPassword: "Ändern Sie Ihr Passwort",
    logoutAccount: "Abmelden",
    confirmLogout: "Sind Sie sicher, dass Sie sich abmelden möchten?",
    allRightsReserved: "© 2024 Alle Rechte vorbehalten",
    
    // Dashboard Comum
    dashboard: "Dashboard",
    orders: "Bestellungen",
    restaurants: "Restaurants",
    menu: "Menü",
    profile: "Profil",
    settings: "Einstellungen",
    logout: "Abmelden",
    search: "Suchen",
    filter: "Filtern",
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    edit: "Bearbeiten",
    add: "Hinzufügen",
    view: "Ansehen",
    close: "Schließen",
    
    // Client Dashboard
    myOrders: "Meine Bestellungen",
    orderHistory: "Bestellverlauf",
    favorites: "Favoriten",
    addresses: "Adressen",
    paymentMethods: "Zahlungsmethoden",
    
    // Restaurant Owner Dashboard
    myRestaurant: "Mein Restaurant",
    menuManagement: "Menüverwaltung",
    orderManagement: "Bestellverwaltung",
    statistics: "Statistiken",
    revenue: "Umsatz",
    
    // Driver Dashboard
    availableDeliveries: "Verfügbare Lieferungen",
    myDeliveries: "Meine Lieferungen",
    earnings: "Verdienste",
    status: "Status",
    
    // Order Status
    pending: "Ausstehend",
    confirmed: "Bestätigt",
    preparing: "In Vorbereitung",
    ready: "Bereit",
    inDelivery: "In Zustellung",
    delivered: "Zugestellt",
    cancelled: "Storniert",
    
    // Common Messages
    success: "Erfolg!",
    error: "Fehler!",
    warning: "Warnung!",
    loading: "Wird geladen...",
    noData: "Keine Daten verfügbar",
    confirmAction: "Sind Sie sicher, dass Sie diese Aktion ausführen möchten?",
  },
  
  it: {
    // Welcome Page
    welcomeBack: "Bentornato!",
    loginOrSignup: "Accedi o crea il tuo account per continuare.",
    login: "Accedi",
    signup: "Registrati",
    email: "Email",
    password: "Password",
    fullName: "Nome Completo",
    phone: "Telefono",
    passwordMin: "Password (minimo 6 caratteri)",
    loginButton: "Accedi",
    loggingIn: "Accesso...",
    createAccount: "Crea Account",
    creatingAccount: "Creazione account...",
    invalidCredentials: "Email o password non validi.",
    errorOccurred: "Si è verificato un errore. Riprova.",
    passwordLength: "La password deve contenere almeno 6 caratteri.",
    emailExists: "Questa email è già registrata.",
    signupError: "Si è verificato un errore durante la creazione dell'account. Riprova.",
    
    // Client Dashboard
    alwaysClose: "Sempre Vicino,",
    alwaysOnTime: "Sempre in Orario",
    searchFood: "Cerca cibo",
    categories: "Categorie",
    popular: "Popolare",
    fastFood: "Fast Food",
    
    // Settings
    settings: "Impostazioni",
    notifications: "Notifiche",
    orderUpdates: "Aggiornamenti Ordine",
    orderStatus: "Stato del tuo ordine",
    promotions: "Promozioni",
    specialOffers: "Offerte speciali",
    newRestaurants: "Nuovi Ristoranti",
    platformNews: "Novità della piattaforma",
    newsletter: "Newsletter",
    newsByEmail: "Novità via email",
    preferences: "Preferenze",
    language: "Lingua",
    darkMode: "Modalità Scura",
    darkTheme: "Tema scuro",
    soundEffects: "Effetti Sonori",
    appSounds: "Suoni dell'app",
    security: "Sicurezza",
    changePassword: "Cambia Password",
    changeYourPassword: "Cambia la tua password",
    logoutAccount: "Esci",
    confirmLogout: "Sei sicuro di voler uscire?",
    allRightsReserved: "© 2024 Tutti i diritti riservati",
    
    // Dashboard Comum
    dashboard: "Dashboard",
    orders: "Ordini",
    restaurants: "Ristoranti",
    menu: "Menu",
    profile: "Profilo",
    settings: "Impostazioni",
    logout: "Esci",
    search: "Cerca",
    filter: "Filtra",
    save: "Salva",
    cancel: "Annulla",
    delete: "Elimina",
    edit: "Modifica",
    add: "Aggiungi",
    view: "Visualizza",
    close: "Chiudi",
    
    // Client Dashboard
    myOrders: "I Miei Ordini",
    orderHistory: "Storico Ordini",
    favorites: "Preferiti",
    addresses: "Indirizzi",
    paymentMethods: "Metodi di Pagamento",
    
    // Restaurant Owner Dashboard
    myRestaurant: "Il Mio Ristorante",
    menuManagement: "Gestione Menu",
    orderManagement: "Gestione Ordini",
    statistics: "Statistiche",
    revenue: "Ricavi",
    
    // Driver Dashboard
    availableDeliveries: "Consegne Disponibili",
    myDeliveries: "Le Mie Consegne",
    earnings: "Guadagni",
    status: "Stato",
    
    // Order Status
    pending: "In Attesa",
    confirmed: "Confermato",
    preparing: "In Preparazione",
    ready: "Pronto",
    inDelivery: "In Consegna",
    delivered: "Consegnato",
    cancelled: "Annullato",
    
    // Common Messages
    success: "Successo!",
    error: "Errore!",
    warning: "Attenzione!",
    loading: "Caricamento...",
    noData: "Nessun dato disponibile",
    confirmAction: "Sei sicuro di voler eseguire questa azione?",
  },
  
  zh: {
    // Welcome Page
    welcomeBack: "欢迎回来！",
    loginOrSignup: "登录或创建您的账户以继续。",
    login: "登录",
    signup: "注册",
    email: "电子邮件",
    password: "密码",
    fullName: "全名",
    phone: "电话",
    passwordMin: "密码（至少6个字符）",
    loginButton: "登录",
    loggingIn: "登录中...",
    createAccount: "创建账户",
    creatingAccount: "创建账户中...",
    invalidCredentials: "电子邮件或密码无效。",
    errorOccurred: "发生错误。请重试。",
    passwordLength: "密码必须至少为6个字符。",
    emailExists: "此电子邮件已注册。",
    signupError: "创建账户时发生错误。请重试。",
    
    // Client Dashboard
    alwaysClose: "始终靠近，",
    alwaysOnTime: "准时送达",
    searchFood: "搜索食物",
    categories: "类别",
    popular: "热门",
    fastFood: "快餐",
    
    // Settings
    settings: "设置",
    notifications: "通知",
    orderUpdates: "订单更新",
    orderStatus: "您的订单状态",
    promotions: "促销",
    specialOffers: "特别优惠",
    newRestaurants: "新餐厅",
    platformNews: "平台新闻",
    newsletter: "新闻通讯",
    newsByEmail: "通过电子邮件获取新闻",
    preferences: "偏好设置",
    language: "语言",
    darkMode: "暗黑模式",
    darkTheme: "暗黑主题",
    soundEffects: "音效",
    appSounds: "应用声音",
    security: "安全",
    changePassword: "更改密码",
    changeYourPassword: "更改您的密码",
    logoutAccount: "退出账户",
    confirmLogout: "您确定要退出吗？",
    allRightsReserved: "© 2024 版权所有",
    
    // Dashboard Comum
    dashboard: "仪表板",
    orders: "订单",
    restaurants: "餐厅",
    menu: "菜单",
    profile: "个人资料",
    settings: "设置",
    logout: "退出",
    search: "搜索",
    filter: "筛选",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    edit: "编辑",
    add: "添加",
    view: "查看",
    close: "关闭",
    
    // Client Dashboard
    myOrders: "我的订单",
    orderHistory: "订单历史",
    favorites: "收藏",
    addresses: "地址",
    paymentMethods: "支付方式",
    
    // Restaurant Owner Dashboard
    myRestaurant: "我的餐厅",
    menuManagement: "菜单管理",
    orderManagement: "订单管理",
    statistics: "统计",
    revenue: "收入",
    
    // Driver Dashboard
    availableDeliveries: "可用配送",
    myDeliveries: "我的配送",
    earnings: "收入",
    status: "状态",
    
    // Order Status
    pending: "待处理",
    confirmed: "已确认",
    preparing: "准备中",
    ready: "准备好",
    inDelivery: "配送中",
    delivered: "已送达",
    cancelled: "已取消",
    
    // Common Messages
    success: "成功！",
    error: "错误！",
    warning: "警告！",
    loading: "加载中...",
    noData: "无可用数据",
    confirmAction: "您确定要执行此操作吗？",
  },
  
  ja: {
    // Welcome Page
    welcomeBack: "おかえりなさい！",
    loginOrSignup: "ログインまたはアカウントを作成して続行してください。",
    login: "ログイン",
    signup: "登録",
    email: "メール",
    password: "パスワード",
    fullName: "フルネーム",
    phone: "電話",
    passwordMin: "パスワード（最低6文字）",
    loginButton: "ログイン",
    loggingIn: "ログイン中...",
    createAccount: "アカウント作成",
    creatingAccount: "アカウント作成中...",
    invalidCredentials: "メールまたはパスワードが無効です。",
    errorOccurred: "エラーが発生しました。もう一度お試しください。",
    passwordLength: "パスワードは少なくとも6文字である必要があります。",
    emailExists: "このメールは既に登録されています。",
    signupError: "アカウントの作成中にエラーが発生しました。もう一度お試しください。",
    
    // Client Dashboard
    alwaysClose: "いつも近くに、",
    alwaysOnTime: "いつも時間通り",
    searchFood: "食べ物を検索",
    categories: "カテゴリー",
    popular: "人気",
    fastFood: "ファストフード",
    
    // Settings
    settings: "設定",
    notifications: "通知",
    orderUpdates: "注文の更新",
    orderStatus: "注文のステータス",
    promotions: "プロモーション",
    specialOffers: "特別オファー",
    newRestaurants: "新しいレストラン",
    platformNews: "プラットフォームのニュース",
    newsletter: "ニュースレター",
    newsByEmail: "メールでニュース",
    preferences: "設定",
    language: "言語",
    darkMode: "ダークモード",
    darkTheme: "ダークテーマ",
    soundEffects: "サウンドエフェクト",
    appSounds: "アプリの音",
    security: "セキュリティ",
    changePassword: "パスワード変更",
    changeYourPassword: "パスワードを変更する",
    logoutAccount: "ログアウト",
    confirmLogout: "ログアウトしてもよろしいですか？",
    allRightsReserved: "© 2024 全著作権所有",
    
    // Dashboard Comum
    dashboard: "ダッシュボード",
    orders: "注文",
    restaurants: "レストラン",
    menu: "メニュー",
    profile: "プロフィール",
    settings: "設定",
    logout: "ログアウト",
    search: "検索",
    filter: "フィルター",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    edit: "編集",
    add: "追加",
    view: "表示",
    close: "閉じる",
    
    // Client Dashboard
    myOrders: "マイオーダー",
    orderHistory: "注文履歴",
    favorites: "お気に入り",
    addresses: "住所",
    paymentMethods: "支払い方法",
    
    // Restaurant Owner Dashboard
    myRestaurant: "マイレストラン",
    menuManagement: "メニュー管理",
    orderManagement: "注文管理",
    statistics: "統計",
    revenue: "収益",
    
    // Driver Dashboard
    availableDeliveries: "利用可能な配達",
    myDeliveries: "マイ配達",
    earnings: "収入",
    status: "ステータス",
    
    // Order Status
    pending: "保留中",
    confirmed: "確認済み",
    preparing: "準備中",
    ready: "準備完了",
    inDelivery: "配達中",
    delivered: "配達済み",
    cancelled: "キャンセル",
    
    // Common Messages
    success: "成功！",
    error: "エラー！",
    warning: "警告！",
    loading: "読み込み中...",
    noData: "利用可能なデータがありません",
    confirmAction: "この操作を実行してもよろしいですか？",
  }
};

// Criar o contexto
const LanguageContext = createContext();

// Provider do contexto
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt');

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