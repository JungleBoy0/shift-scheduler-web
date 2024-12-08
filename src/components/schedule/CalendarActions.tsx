import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CalendarActionsProps {
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

export const CalendarActions = ({ calendarData, icsFileContent }: CalendarActionsProps) => {
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
    <div className="flex justify-center mt-4">
      {icsFileContent && (
        <Button
          className="w-full sm:w-auto"
          onClick={saveCalendarToServer}
        >
          <Phone className="mr-2 h-4 w-4" />
          Synchronizuj z Telefonem
        </Button>
      )}
    </div>
  );
};