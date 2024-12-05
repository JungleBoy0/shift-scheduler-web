import { useState } from "react";
import { Card } from "@/components/ui/card";
import { createEvents } from 'ics';
import emailjs from '@emailjs/browser';
import { ScheduleForm } from "@/components/schedule/ScheduleForm";
import { CalendarActions } from "@/components/schedule/CalendarActions";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [icsContent, setIcsContent] = useState<string>();
  const [currentData, setCurrentData] = useState<any>(null);

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
    });
  };

  const handleDownload = () => {
    if (!icsContent) return;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `grafik_${currentData.name}_${currentData.year}_${currentData.month}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Sukces",
      description: "Plik kalendarza został wygenerowany i pobrany",
    });
  };

  const handleEmailSend = async () => {
    if (!icsContent || !currentData.email) return;

    try {
      const templateParams = {
        to_email: currentData.email,
        from_name: "Generator Grafików",
        to_name: currentData.name,
        message: "Twój grafik jest w załączniku",
        attachment: icsContent,
      };

      await emailjs.send(
        'service_llllvkr',
        'template_ty7ucjm',
        templateParams,
        '8mFf_0_APIqTSyTKb'
      );

      toast({
        title: "Sukces",
        description: "Grafik został wysłany na twój email",
      });
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać emaila",
        variant: "destructive",
      });
    }
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
          
          {currentData && (
            <CalendarActions
              onDownload={handleDownload}
              onEmailSend={handleEmailSend}
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