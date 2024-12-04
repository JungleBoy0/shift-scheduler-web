import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
        title: "Day Shift",
        description: `Schedule: ${formData.name}`,
        calName: "Work Schedule",
      });
    });

    nightDates.forEach((day: number) => {
      const date = new Date(formData.year, formData.month - 1, day);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      events.push({
        start: [formData.year, formData.month, day, 19, 0],
        end: [nextDay.getFullYear(), nextDay.getMonth() + 1, nextDay.getDate(), 7, 0],
        title: "Night Shift",
        description: `Schedule: ${formData.name}`,
        calName: "Work Schedule",
      });
    });

    createEvents(events, (error, value) => {
      if (error) {
        toast({
          title: "Error",
          description: "Failed to generate calendar file",
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
    link.download = `schedule_${currentData.name}_${currentData.year}_${currentData.month}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Calendar file has been generated and downloaded",
    });
  };

  const handleEmailSend = async () => {
    if (!icsContent || !currentData.email) return;

    try {
      const templateParams = {
        to_email: currentData.email,
        from_name: "Shift Scheduler",
        to_name: currentData.name,
        message: "Your schedule is attached",
        attachment: icsContent,
      };

      await emailjs.send(
        'service_llllvkr',
        'template_ty7ucjm',
        templateParams,
        '8mFf_0_APIqTSyTKb'
      );

      toast({
        title: "Success",
        description: "Schedule has been sent to your email",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold ">Stacja Wizyjna Grafik</h1>
            <p className="mt-2 text-sm ">
             Wpisz zmiany po przecinkach (np. 1, ,5 , 10 , 15)
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