import { useState } from "react";
import { Card } from "@/components/ui/card";
import { createEvents } from 'ics';
import { ScheduleForm } from "@/components/schedule/ScheduleForm";
import { CalendarActions } from "@/components/schedule/CalendarActions";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [icsContent, setIcsContent] = useState<string>();
  const [currentData, setCurrentData] = useState<any>(null);
  const [calendarUrl, setCalendarUrl] = useState<string>();

  const generateCalendarFiles = async (formData: any) => {
    const dayDates = formData.dayShifts
      .split(",")
      .map((d: string) => parseInt(d.trim()))
      .filter((d: number) => !isNaN(d));
    
    const nightDates = formData.nightShifts
      .split(",")
      .map((d: string) => parseInt(d.trim()))
      .filter((d: number) => !isNaN(d));

    const events = [];

    dayDates.forEach((day: number) => {
      events.push({
        start: [formData.year, formData.month, day, 7, 0],
        end: [formData.year, formData.month, day, 19, 0],
        title: "Zmiana Dzienna",
        description: `Grafik: ${formData.name}`,
        calName: "Grafik Pracy",
      });
    });

    nightDates.forEach((day: number) => {
      const date = new Date(formData.year, formData.month - 1, day);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      events.push({
        start: [formData.year, formData.month, day, 19, 0],
        end: [nextDay.getFullYear(), nextDay.getMonth() + 1, nextDay.getDate(), 7, 0],
        title: "Zmiana Nocna",
        description: `Grafik: ${formData.name}`,
        calName: "Grafik Pracy",
      });
    });

    createEvents(events, (error, value) => {
      if (error) {
        toast({
          title: "Błąd",
          description: "Nie udało się wygenerować pliku kalendarza",
          variant: "destructive",
        });
        return;
      }

      setIcsContent(value);
      setCurrentData({
        ...formData,
        dayShifts: dayDates,
        nightShifts: nightDates,
      });
      
      // Set calendar URL
      const filename = `${formData.name}_${formData.month}_${formData.year}.ics`;
      setCalendarUrl(`http://20.215.224.183/calendars/${filename}`);
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Stacja Wizyjna Grafik</h1>
            <p className="mt-2 text-sm">
              Wpisz zmiany po przecinkach (np. 1, 5, 10, 15)
            </p>
          </div>

          <ScheduleForm onGenerateCalendar={generateCalendarFiles} />
          
          {calendarUrl && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Link do kalendarza:</p>
              <a 
                href={calendarUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 break-all"
              >
                {calendarUrl}
              </a>
            </div>
          )}

          {currentData && (
            <CalendarActions
              calendarData={currentData}
              icsFileContent={icsContent}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;