import { Button } from "@/components/ui/button";
import { Download, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CalendarActionsProps {
  onDownload: () => void;
  onEmailSend: () => void;
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

export const CalendarActions = ({ onDownload, onEmailSend, calendarData, icsFileContent }: CalendarActionsProps) => {
  const { toast } = useToast();

  const saveToDatabase = async () => {
    const { error } = await supabase.from('schedules').insert({
      id: crypto.randomUUID(), // Generate UUID here
      name: calendarData.name,
      email: calendarData.email,
      month: calendarData.month,
      year: calendarData.year,
      day_shifts: calendarData.dayShifts,
      night_shifts: calendarData.nightShifts,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save schedule to database",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Schedule saved to database",
    });
  };

  const handleAction = async (action: () => void) => {
    await saveToDatabase();
    action();
  };

  const generateCalendarUrl = () => {
    if (!icsFileContent) return "";
    
    const blob = new Blob([icsFileContent], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
  };

  return (
    <div className="flex gap-4 mt-4">
      <Button
        className="flex-1"
        onClick={() => handleAction(onDownload)}
        disabled={!calendarData.name}
      >
        <Download className="mr-2 h-4 w-4" />
        Download Calendar
      </Button>
      
      <Button
        className="flex-1"
        onClick={() => handleAction(onEmailSend)}
        disabled={!calendarData.name || !calendarData.email}
      >
        <Mail className="mr-2 h-4 w-4" />
        Send by Email
      </Button>

      {icsFileContent && (
        <Button
          className="flex-1"
          onClick={() => {
            const url = generateCalendarUrl();
            if (url) {
              window.open(url, '_blank');
              toast({
                title: "Calendar Link Generated",
                description: "Open this link on your phone to sync with your calendar",
              });
            }
          }}
        >
          <Phone className="mr-2 h-4 w-4" />
          Sync with Phone
        </Button>
      )}
    </div>
  );
};