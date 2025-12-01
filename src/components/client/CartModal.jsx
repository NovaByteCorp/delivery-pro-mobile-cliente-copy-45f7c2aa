import React, { useState } from "react";
import { Order } from "@/api/entities";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Menu,
  CheckCircle,
  Clock,
  Home,
  ShoppingCart,
  CreditCard,
  User
} from "lucide-react";

export default function CartModal({ cart, onClose, onUpdateQuantity, onRemoveItem, totalPrice, user }) {
  const [step, setStep] = useState("checkout"); // "checkout", "success"
  const [orderData, setOrderData] = useState({
    address: {
      street: "",
      number: "",
      neighborhood: "",
      complement: "",
      reference: ""
    },
    paymentMethod: "paypal",
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  const deliveryFee = 5.0;
  const taxesAndFees = 10.0;
  const subtotal = totalPrice;
  const finalTotal = subtotal + deliveryFee + taxesAndFees;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const testUser = JSON.parse(localStorage.getItem('testUser') || '{}');
      
      // Agrupar itens por restaurante
      const ordersByRestaurant = cart.reduce((acc, item) => {
        const restaurantId = item.restaurant.id;
        if (!acc[restaurantId]) {
          acc[restaurantId] = {
            restaurant: item.restaurant,
            items: []
          };
        }
        acc[restaurantId].items.push(item);
        return acc;
      }, {});

      // Criar pedido para cada restaurante
      for (const [restaurantId, orderGroup] of Object.entries(ordersByRestaurant)) {
        const orderItems = orderGroup.items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.image_url,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity
        }));

        const orderSubtotal = orderItems.reduce((sum, item) => sum + item.total_price, 0);

        await Order.create({
          customer_id: testUser.id || "cliente_teste",
          restaurant_id: restaurantId,
          order_number: `ORD${Date.now()}${Math.random().toString(36).substring(2, 5)}`,
          items: orderItems,
          subtotal: orderSubtotal,
          delivery_fee: deliveryFee,
          total_amount: orderSubtotal + deliveryFee + taxesAndFees,
          payment_method: orderData.paymentMethod,
          delivery_address: orderData.address,
          customer_notes: orderData.notes,
          status: "pendente"
        });
      }

      setStep("success");
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    }
    setLoading(false);
  };

  if (step === "success") {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[100vh] overflow-hidden p-0 m-0 rounded-t-3xl">
          <div className="text-center py-8 px-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your order has been placed and is being prepared.
            </p>
            <Button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[100vh] overflow-hidden p-0 m-0 rounded-t-3xl">
        {/* Status Bar */}
        <div className="bg-white px-6 py-2 text-center text-sm font-semibold">
          8:30 PM
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white">
          <Button onClick={onClose} variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Map Area */}
        <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 relative mx-4 rounded-2xl mb-6">
          <div className="absolute inset-0 bg-green-50 opacity-50 rounded-2xl"></div>
          <div className="absolute inset-4 bg-white rounded-xl shadow-sm flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-xs text-gray-600">Delivery Location</p>
            </div>
          </div>
          
          {/* Delivery Time */}
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Delivery Time</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold">15 Minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <span className="font-medium text-gray-900">PayPal</span>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        </div>

        {/* Order Summary */}
        <div className="px-6 space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Payment</span>
            <Button variant="ghost" className="text-orange-500 text-sm p-0 h-auto">
              + Add Items
            </Button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Sub Total</span>
              <span className="font-medium">${subtotal.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes & Fees</span>
              <span className="font-medium">${taxesAndFees.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">${deliveryFee.toFixed(1)}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${finalTotal.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="px-6 pb-6">
          <Button
            onClick={handlePlaceOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl h-12"
            disabled={loading}
          >
            {loading ? "Processing..." : "Checkout"}
          </Button>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-100 px-6 py-3">
          <div className="flex items-center justify-around">
            <Button variant="ghost" className="flex flex-col items-center gap-1">
              <Home className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400">Home</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1">
              <Menu className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400">Menu</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1 text-orange-500">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs">Cart</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400">Payment</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400">Account</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}