import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Home,
  Menu,
  ShoppingCart,
  User
} from "lucide-react";
import { createPageUrl } from "@/utils";

export default function ChangePasswordPage() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (passwords.new !== passwords.confirm) {
      setError("New passwords don't match");
      return;
    }

    if (passwords.new.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const testUser = localStorage.getItem('testUser');
      if (testUser) {
        const userData = JSON.parse(testUser);
        
        const allUsers = await SystemUser.list();
        const currentUser = allUsers.find(u => u.email === userData.email);
        
        if (currentUser && currentUser.password !== passwords.current) {
          setError("Current password is incorrect");
          setLoading(false);
          return;
        }

        await SystemUser.update(currentUser.id, {
          password: passwords.new
        });

        setSuccess(true);
        setPasswords({ current: "", new: "", confirm: "" });
        
        setTimeout(() => {
          window.location.href = createPageUrl('AccountPage');
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setError("Error updating password. Please try again.");
    }
    setLoading(false);
  };

  const navigate = (url) => {
    window.location.href = url;
  };

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Bar */}
      <div className="bg-white px-6 py-2 text-center text-sm font-semibold">
        8:30 PM
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <Button 
          onClick={() => navigate(createPageUrl('AccountPage'))} 
          variant="ghost" 
          size="icon"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Change Password</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-6 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Password updated successfully! Redirecting...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <p className="text-gray-600 mb-2 font-medium">Current Password</p>
            <div className="relative">
              <Input
                type={showPasswords.current ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                placeholder="Enter current password"
                className="bg-white border border-gray-200 h-12 rounded-xl pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={() => toggleShowPassword('current')}
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <p className="text-gray-600 mb-2 font-medium">New Password</p>
            <div className="relative">
              <Input
                type={showPasswords.new ? "text" : "password"}
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                placeholder="Enter new password"
                className="bg-white border border-gray-200 h-12 rounded-xl pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={() => toggleShowPassword('new')}
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <p className="text-gray-600 mb-2 font-medium">Confirm New Password</p>
            <div className="relative">
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                placeholder="Confirm new password"
                className="bg-white border border-gray-200 h-12 rounded-xl pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={() => toggleShowPassword('confirm')}
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-8">
            <Button 
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 rounded-xl font-semibold"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 shadow-lg">
        <div className="flex items-center justify-around">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1"
            onClick={() => navigate(createPageUrl('ClientDashboard'))}
          >
            <Home className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1">
            <Menu className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Menu</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1"
            onClick={() => navigate(createPageUrl('Cart'))}
          >
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Cart</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1 text-orange-500"
            onClick={() => navigate(createPageUrl('AccountPage'))}
          >
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs">Account</span>
          </Button>
        </div>
      </div>
    </div>
  );
}