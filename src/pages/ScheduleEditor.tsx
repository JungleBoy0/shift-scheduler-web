import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { EditScheduleDialog } from "@/components/schedule/EditScheduleDialog";

const ScheduleEditor = () => {
  const [email, setEmail] = useState("");
  const [schedules, setSchedules] = useState<any[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchSchedules = async () => {
    if (!email) return;
    
    try {
      const response = await fetch(`/list-calendars?name=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error('Failed to fetch schedules');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać grafików",
        variant: "destructive",
      });
    }
  };

  const handleSaveSchedule = async (updatedSchedule: any) => {
    try {
      // Create updated ICS content
      const icsContent = generateIcsContent(updatedSchedule);
      
      const response = await fetch('/save-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: `${updatedSchedule.name}_${updatedSchedule.month}_${updatedSchedule.year}.ics`,
          content: icsContent
        })
      });

      if (!response.ok) throw new Error('Failed to save schedule');

      toast({
        title: "Sukces",
        description: "Grafik został zaktualizowany",
      });

      await fetchSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
      throw error;
    }
  };

  const generateIcsContent = (schedule: any) => {
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//hacksw/handcal//NONSGML v1.0//EN',
    ];

    // Add day shifts
    schedule.day_shifts?.forEach((day: string) => {
      const date = new Date(schedule.year, schedule.month - 1, parseInt(day));
      icsLines.push(
        'BEGIN:VEVENT',
        `DTSTART:${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}T070000`,
        `DTEND:${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}T190000`,
        'SUMMARY:Dzienna zmiana',
        'END:VEVENT'
      );
    });

    // Add night shifts
    schedule.night_shifts?.forEach((day: string) => {
      const date = new Date(schedule.year, schedule.month - 1, parseInt(day));
      icsLines.push(
        'BEGIN:VEVENT',
        `DTSTART:${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}T190000`,
        `DTEND:${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(parseInt(day) + 1).padStart(2, '0')}T070000`,
        'SUMMARY:Nocna zmiana',
        'END:VEVENT'
      );
    });

    icsLines.push('END:VCALENDAR');
    return icsLines.join('\n');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Edytor Grafików</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Logacja</Label>
                <div className="flex gap-4">
                  <Input
                    id="email"
                    placeholder="Wprowadź logację"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button onClick={fetchSchedules}>Szukaj</Button>
                </div>
              </div>

              {schedules.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Logacja</TableHead>
                      <TableHead>Miesiąc/Rok</TableHead>
                      <TableHead>Zmiany Dzienne</TableHead>
                      <TableHead>Zmiany Nocne</TableHead>
                      <TableHead>Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule, index) => (
                      <TableRow key={index}>
                        <TableCell>{schedule.name}</TableCell>
                        <TableCell>{schedule.month}/{schedule.year}</TableCell>
                        <TableCell>{schedule.day_shifts?.join(', ') || '-'}</TableCell>
                        <TableCell>{schedule.night_shifts?.join(', ') || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingSchedule(schedule);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : email ? (
                <p className="text-gray-500">Nie znaleziono grafików dla tej logacji.</p>
              ) : (
                <p className="text-gray-500">Wprowadź logację aby wyświetlić grafiki.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <EditScheduleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        schedule={editingSchedule}
        onSave={handleSaveSchedule}
      />
    </div>
  );
};

export default ScheduleEditor;