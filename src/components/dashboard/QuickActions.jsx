
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus, 
  UtensilsCrossed, 
  UserPlus, 
  FileBarChart,
  Zap
} from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Novo Pedido",
      description: "Criar pedido manual",
      icon: Plus,
      href: createPageUrl("Orders"),
      color: "bg-orange-500 hover:bg-orange-600",
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Adicionar Produto",
      description: "Gerenciar cardápio",
      icon: UtensilsCrossed,
      href: createPageUrl("Menu"),
      color: "bg-emerald-500 hover:bg-emerald-600",
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Novo Entregador",
      description: "Cadastrar entregador",
      icon: UserPlus,
      href: createPageUrl("Deliveries"),
      color: "bg-purple-500 hover:bg-purple-600",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Ver Relatórios",
      description: "Análises detalhadas",
      icon: FileBarChart,
      href: createPageUrl("Reports"),
      color: "bg-indigo-500 hover:bg-indigo-600",
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-orange-600" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Button
                variant="ghost"
                className="w-full justify-start p-4 h-auto hover:bg-slate-50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                  </div>
                  
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">{action.title}</p>
                    <p className="text-xs text-slate-600">{action.description}</p>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
