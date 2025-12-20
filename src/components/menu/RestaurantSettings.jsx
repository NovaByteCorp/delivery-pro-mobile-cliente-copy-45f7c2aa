import React, { useState, useEffect } from 'react';
import { Restaurant } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RestaurantSettings({ restaurant, onUpdate }) {
  const [hours, setHours] = useState({
    monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (restaurant && restaurant.operating_hours) {
      setHours(restaurant.operating_hours);
    }
  }, [restaurant]);

  const handleHourChange = (day, value) => {
    setHours(prev => ({ ...prev, [day]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Restaurant.update(restaurant.id, { operating_hours: hours });
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar horários:', error);
    } finally {
      setSaving(false);
    }
  };

  const daysOfWeek = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Horários de Funcionamento</CardTitle>
        <CardDescription>
          Defina os horários em que seu restaurante está aberto para receber pedidos.
          Use o formato "HH:mm - HH:mm" ou "Fechado".
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {Object.entries(daysOfWeek).map(([dayKey, dayName]) => (
            <div key={dayKey}>
              <Label htmlFor={dayKey} className="font-semibold">{dayName}</Label>
              <Input
                id={dayKey}
                value={hours[dayKey] || ''}
                onChange={e => handleHourChange(dayKey, e.target.value)}
                placeholder="Ex: 10:00 - 22:00"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
            {saving ? 'Salvando...' : 'Salvar Horários'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}