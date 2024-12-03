import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Download, Mail } from "lucide-react";
import { createEvents } from 'ics';
import emailjs from '@emailjs/browser';

const Index = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dayShifts, setDayShifts] = useState("");
  const [nightShifts, setNightShifts] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const generateCalendarFiles = async (sendEmail = false) => {
    if (!name || (!dayShifts && !nightShifts)) {
      toast({
        title: "Error",
        description: "Please fill in at least the name and one shift type",
        variant: "destructive",
      });
      return;
    }

    if (sendEmail && !email) {
      toast({
        title: "Error",
        description: "Please provide an email address",
        variant: "destructive",
      });
      return;
    }

    const dayDates = dayShifts
      .split(",")
      .map((d) => parseInt(d.trim()))
      .filter((d) => !isNaN(d));
    const nightDates = nightShifts
      .split(",")
      .map((d) => parseInt(d.trim()))
      .filter((d) => !isNaN(d));

    const events = [];

    dayDates.forEach((day) => {
      const date = new Date(year, month - 1, day);
      events.push({
        start: [year, month, day, 7, 0],
        end: [year, month, day, 19, 0],
        title: "Day Shift",
        description: `Schedule: ${name}`,
        calName: "Work Schedule",
      });
    });

    nightDates.forEach((day) => {
      const date = new Date(year, month - 1, day);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      events.push({
        start: [year, month, day, 19, 0],
        end: [nextDay.getFullYear(), nextDay.getMonth() + 1, nextDay.getDate(), 7, 0],
        title: "Night Shift",
        description: `Schedule: ${name}`,
        calName: "Work Schedule",
      });
    });

    createEvents(events, async (error, value) => {
      if (error) {
        toast({
          title: "Error",
          description: "Failed to generate calendar file",
          variant: "destructive",
        });
        return;
      }

      if (sendEmail) {
        try {
          const templateParams = {
            to_email: email,
            from_name: "Shift Scheduler",
            to_name: name,
            message: "Your schedule is attached",
            attachment: value,
          };

          await emailjs.send(
            'service_llllvkr', // Replace with your EmailJS service ID
            'template_ty7ucjm', // Replace with your EmailJS template ID
            templateParams,
            '8mFf_0_APIqTSyTKb' // Replace with your EmailJS public key
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
      } else {
        const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `schedule_${name}_${year}_${month}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Success",
          description: "Calendar file has been generated and downloaded",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Stacja Wizyjna Grafik</h1>
            <p className="mt-2 text-sm text-gray-600">
              Wprowadź zmiany po przecinku(e.g., 1, 5, 10, 15)
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Logacja</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Pogdaj logacje"
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
              <Label htmlFor="dayShifts">Zmiany Dzienne (7:00 - 19:00)</Label>
              <Input
                id="dayShifts"
                value={dayShifts}
                onChange={(e) => setDayShifts(e.target.value)}
                placeholder="Wpisz daty (e.g., 1, 5, 10)"
              />
            </div>

            <div>
              <Label htmlFor="nightShifts">Zmiany Nocne (19:00 - 7:00)</Label>
              <Input
                id="nightShifts"
                value={nightShifts}
                onChange={(e) => setNightShifts(e.target.value)}
                placeholder="Wpisz daty (e.g., 2, 6, 11)"
              />
            </div>

            <div className="flex gap-4">
              <Button
                className="flex-1"
                onClick={() => generateCalendarFiles(false)}
                disabled={!name || (!dayShifts && !nightShifts)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Calendar
              </Button>
              <Button
                className="flex-1"
                onClick={() => generateCalendarFiles(true)}
                disabled={!name || !email || (!dayShifts && !nightShifts)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send by Email
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;