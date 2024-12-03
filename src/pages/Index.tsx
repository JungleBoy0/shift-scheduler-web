import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [dayShifts, setDayShifts] = useState("");
  const [nightShifts, setNightShifts] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const generateCalendarFiles = () => {
    if (!name || (!dayShifts && !nightShifts)) {
      toast({
        title: "Error",
        description: "Please fill in at least the name and one shift type",
        variant: "destructive",
      });
      return;
    }

    // Parse comma-separated dates
    const dayDates = dayShifts
      .split(",")
      .map((d) => parseInt(d.trim()))
      .filter((d) => !isNaN(d));
    const nightDates = nightShifts
      .split(",")
      .map((d) => parseInt(d.trim()))
      .filter((d) => !isNaN(d));

    // Create CSV content
    let csvContent = "Subject,Start Date,Start Time,End Date,End Time,Description,Location\n";

    // Add day shifts
    dayDates.forEach((day) => {
      csvContent += `"Day Shift",${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")},07:00,${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")},19:00,"Schedule: ${name}",\n`;
    });

    // Add night shifts
    nightDates.forEach((day) => {
      csvContent += `"Night Shift",${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")},19:00,${year}-${month.toString().padStart(2, "0")}-${(day + 1).toString().padStart(2, "0")},07:00,"Schedule: ${name}",\n`;
    });

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `schedule_${name}_${year}_${month}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Calendar file has been generated and downloaded",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Shift Schedule Generator</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter dates as comma-separated values (e.g., 1, 5, 10, 15)
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter employee name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="month">Month</Label>
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
                <Label htmlFor="year">Year</Label>
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
              <Label htmlFor="dayShifts">Day Shifts (7:00 - 19:00)</Label>
              <Input
                id="dayShifts"
                value={dayShifts}
                onChange={(e) => setDayShifts(e.target.value)}
                placeholder="Enter dates (e.g., 1, 5, 10)"
              />
            </div>

            <div>
              <Label htmlFor="nightShifts">Night Shifts (19:00 - 7:00)</Label>
              <Input
                id="nightShifts"
                value={nightShifts}
                onChange={(e) => setNightShifts(e.target.value)}
                placeholder="Enter dates (e.g., 2, 6, 11)"
              />
            </div>

            <Button
              className="w-full"
              onClick={generateCalendarFiles}
              disabled={!name || (!dayShifts && !nightShifts)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Generate Calendar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;