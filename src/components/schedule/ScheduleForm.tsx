import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScheduleFormProps {
  onGenerateCalendar: (data: {
    name: string;
    email: string;
    month: number;
    year: number;
    dayShifts: string;
    nightShifts: string;
  }) => void;
}

export const ScheduleForm = ({ onGenerateCalendar }: ScheduleFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dayShifts, setDayShifts] = useState("");
  const [nightShifts, setNightShifts] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || (!dayShifts && !nightShifts)) {
      toast({
        title: "Błąd",
        description: "Proszę wypełnić przynajmniej logację i jeden typ zmian",
        variant: "destructive",
      });
      return;
    }

    onGenerateCalendar({
      name,
      email,
      month,
      year,
      dayShifts,
      nightShifts,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Logacja</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Wprowadź logację"
        />
      </div>

      <div>
        <Label htmlFor="email">Email (opcjonalnie)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Wprowadź adres email"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="month">Miesiąc</Label>
          <Input
            id="month"
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="year">Rok</Label>
          <Input
            id="year"
            type="number"
            min="2024"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="dayShifts">Zmiany dzienne (7:00 - 19:00)</Label>
        <Input
          id="dayShifts"
          value={dayShifts}
          onChange={(e) => setDayShifts(e.target.value)}
          placeholder="Wprowadź daty (np. 1, 5, 10)"
        />
      </div>

      <div>
        <Label htmlFor="nightShifts">Zmiany nocne (19:00 - 7:00)</Label>
        <Input
          id="nightShifts"
          value={nightShifts}
          onChange={(e) => setNightShifts(e.target.value)}
          placeholder="Wprowadź daty (np. 2, 6, 11)"
        />
      </div>

      <Button type="submit" className="w-full">
        Generuj Grafik
      </Button>
    </form>
  );
};