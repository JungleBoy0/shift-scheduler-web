import { Button } from "@/components/ui/button";
import { Download, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import fs from 'fs';
import path from 'path';

interface CalendarActionsProps {
  onDownload: () => void;
  calendarData: {
    name: string;
    email: string;
    month: number;
    year: number;
    dayShifts: string[];
    nightShifts: string[];
  };
  icsFileContent?: string;
}

export const CalendarActions = ({ onDownload, calendarData, icsFileContent }: CalendarActionsProps) => {
  const { toast } = useToast();

  const saveToDatabase = async () => {
    const { error } = await supabase.from('schedules').insert({
      id: crypto.randomUUID(),
      name: calendarData.name,
      email: calendarData.email,
      month: calendarData.month,
      year: calendarData.year,
      day_shifts: calendarData.dayShifts,
      night_shifts: calendarData.nightShifts,
    });

    if (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać grafiku w bazie danych",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sukces",
      description: "Grafik został zapisany w bazie danych",
    });
  };

  const handleAction = async (action: () => void) => {
    await saveToDatabase();
    action();
  };

  const saveCalendarToServer = async () => {
    if (!icsFileContent) return;

    try {
      const filename = `${calendarData.name}_${calendarData.month}_${calendarData.year}.ics`;
      const filePath = path.join('/calendars', filename);

      // Write file to server
      fs.writeFileSync(filePath, icsFileContent);

      toast({
        title: "Sukces",
        description: "Kalendarz został zapisany na serwerze",
      });
    } catch (error) {
      console.error('Error saving calendar:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać kalendarza na serwerze",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <Button
        className="flex-1"
        onClick={() => handleAction(onDownload)}
        disabled={!calendarData.name}
      >
        <Download className="mr-2 h-4 w-4" />
        Pobierz Kalendarz
      </Button>

      {icsFileContent && (
        <Button
          className="flex-1"
          onClick={saveCalendarToServer}
        >
          <Phone className="mr-2 h-4 w-4" />
          Synchronizuj z Telefonem
        </Button>
      )}
    </div>
  );
};