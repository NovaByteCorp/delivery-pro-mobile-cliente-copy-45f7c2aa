import React, { useState } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import {
  Key,
  Mail,
  User as UserIcon,
  ArrowRight
} from 'lucide-react';

export default function Welcome() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { t } = useLanguage();

  const navigate = (url) => {
    window.location.href = url;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const allUsers = await User.getAll();
      const user = allUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (user) {
        localStorage.setItem('simulatedRole', user.user_type);
        localStorage.setItem('testUser', JSON.stringify(user));

        if (user.user_type === 'cliente') {
          navigate(createPageUrl('ClientDashboard'));
        } else if (user.user_type === 'dono_restaurante') {
          navigate(createPageUrl('RestaurantOwnerDashboard'));
        } else if (user.user_type === 'entregador') {
          navigate(createPageUrl('DriverDashboard'));
        } else if (user.user_type === 'super_admin' || user.user_type === 'admin') {
          navigate(createPageUrl('Dashboard'));
        } else {
          navigate(createPageUrl('ClientDashboard'));
        }
      } else {
        setError(t('invalidCredentials'));
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError(t('passwordLength'));
      setLoading(false);
      return;
    }

    try {
      const allUsers = await User.getAll();
      const existingUser = allUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        setError(t('emailExists'));
        setLoading(false);
        return;
      }
      
      const newUser = await User.create({
        full_name: fullName,
        email: email,
        phone: phone,
        password: password,
        user_type: "cliente",
        is_active: true
      });

      localStorage.setItem('simulatedRole', 'cliente');
      localStorage.setItem('testUser', JSON.stringify(newUser));
      navigate(createPageUrl('ClientDashboard'));
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError(t('signupError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
      {/* Seletor de Idioma */}
      <LanguageSelector />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c86d65c4f51add45f7c2aa/6e6e29b85_MATERIAL_DE_APRESENTAO-08-removebg-preview.png" 
            alt="ChegouDelivery Logo" 
            className="h-24 mx-auto mb-4" 
          />
          <h1 className="text-3xl font-bold text-gray-900">{t('welcomeBack')}</h1>
          <p className="text-gray-600 mt-2">{t('loginOrSignup')}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-2 gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <Button 
              onClick={() => setActiveTab('login')}
              variant={activeTab === 'login' ? 'default' : 'ghost'}
              className={`w-full ${activeTab === 'login' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
            >
              {t('login')}
            </Button>
            <Button 
              onClick={() => setActiveTab('signup')}
              variant={activeTab === 'signup' ? 'default' : 'ghost'}
              className={`w-full ${activeTab === 'signup' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
            >
              {t('signup')}
            </Button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full h-12 bg-orange-500 hover:bg-orange-600 flex items-center gap-2">
                {loading ? t('loggingIn') : t('loginButton')}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder={t('fullName')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder={t('passwordMin')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full h-12 bg-orange-500 hover:bg-orange-600 flex items-center gap-2">
                {loading ? t('creatingAccount') : t('createAccount')}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}