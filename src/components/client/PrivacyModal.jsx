import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyModal({ onClose }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            Política de Privacidade
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-96">
          <div className="space-y-6 pr-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                  <Database className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Coleta de Dados</h3>
                  <p className="text-gray-600 text-sm">
                    Coletamos informações que você nos fornece diretamente, como nome, email, 
                    telefone e endereço de entrega. Também coletamos dados de uso do aplicativo 
                    para melhorar nossos serviços.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                  <Lock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Uso das Informações</h3>
                  <p className="text-gray-600 text-sm">
                    Utilizamos suas informações para processar pedidos, melhorar nossos serviços, 
                    enviar notificações importantes e comunicações promocionais (quando autorizado).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                  <Eye className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Compartilhamento</h3>
                  <p className="text-gray-600 text-sm">
                    Não vendemos suas informações pessoais. Compartilhamos dados apenas com 
                    parceiros necessários para completar suas entregas e processar pagamentos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                  <Shield className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Segurança</h3>
                  <p className="text-gray-600 text-sm">
                    Implementamos medidas de segurança técnicas e administrativas para proteger 
                    suas informações contra acesso não autorizado, alteração ou destruição.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Seus Direitos</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Acessar suas informações pessoais</li>
                  <li>• Corrigir dados incorretos</li>
                  <li>• Solicitar exclusão de dados</li>
                  <li>• Retirar consentimento</li>
                  <li>• Portabilidade de dados</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Contato:</strong> Para questões sobre privacidade, entre em contato 
                  através do email: privacidade@chegoudelivery.com
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-purple-500 hover:bg-purple-600">
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}