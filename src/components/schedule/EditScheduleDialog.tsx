import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

interface EditScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: any;
  onSave: (schedule: any) => void;
}

export const EditScheduleDialog = ({ open, onOpenChange, schedule, onSave }: EditScheduleDialogProps) => {
  const { toast } = useToast();
  const [dayShifts, setDayShifts] = useState<string>('');
  const [nightShifts, setNightShifts] = useState<string>('');

  useEffect(() => {
    if (schedule) {
      setDayShifts(schedule.day_shifts?.join(',') || '');
      setNightShifts(schedule.night_shifts?.join(',') || '');
    }
  }, [schedule]);

  const handleSave = async () => {
    try {
      const updatedSchedule = {
        ...schedule,
        day_shifts: dayShifts.split(',').map(s => s.trim()).filter(s => s),
        night_shifts: nightShifts.split(',').map(s => s.trim()).filter(s => s)
      };
      await onSave(updatedSchedule);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać zmian",
        variant: "destructive",
      });
    }
  };

  if (!schedule) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj Grafik</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Zmiany Dzienne (oddzielone przecinkami)</Label>
            <Input
              value={dayShifts}
              onChange={(e) => setDayShifts(e.target.value)}
              placeholder="np. 1,2,3,4"
            />
          </div>
          <div className="space-y-2">
            <Label>Zmiany Nocne (oddzielone przecinkami)</Label>
            <Input
              value={nightShifts}
              onChange={(e) => setNightShifts(e.target.value)}
              placeholder="np. 5,6,7,8"
            />
          </div>
          <Button 
            className="w-full"
            onClick={handleSave}
          >
            Zapisz Zmiany
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};