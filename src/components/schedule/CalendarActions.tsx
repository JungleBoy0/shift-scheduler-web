import { Button } from "@/components/ui/button";
import { Download, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

  const saveCalendarToServer = async () => {
    if (!icsFileContent) return;

    try {
      const filename = `${calendarData.name}_${calendarData.month}_${calendarData.year}.ics`;
      
      const response = await fetch('/save-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          content: icsFileContent
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Sukces",
          description: "Kalendarz został zapisany na serwerze",
        });
      } else {
        throw new Error(data.message);
      }
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
        onClick={onDownload}
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