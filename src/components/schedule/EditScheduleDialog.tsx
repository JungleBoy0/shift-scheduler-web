import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface EditScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: any;
  onSave: (schedule: any) => void;
}

export const EditScheduleDialog = ({ open, onOpenChange, schedule, onSave }: EditScheduleDialogProps) => {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await onSave(schedule);
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
              value={schedule.day_shifts?.join(',') || ''}
              onChange={(e) => schedule.day_shifts = e.target.value.split(',').map(s => s.trim())}
            />
          </div>
          <div className="space-y-2">
            <Label>Zmiany Nocne (oddzielone przecinkami)</Label>
            <Input
              value={schedule.night_shifts?.join(',') || ''}
              onChange={(e) => schedule.night_shifts = e.target.value.split(',').map(s => s.trim())}
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