import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Schedule {
  name: string;
  month: number;
  year: number;
  day_shifts: string[];
  night_shifts: string[];
}

const FullSchedule = () => {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/list-calendars?name=`);
      if (!response.ok) throw new Error('Failed to fetch schedules');
      const data = await response.json();
      
      // Filter schedules based on month and year if provided
      const filteredData = data.filter((schedule: Schedule) => {
        if (month && year) {
          return schedule.month === parseInt(month) && schedule.year === parseInt(year);
        }
        if (month) {
          return schedule.month === parseInt(month);
        }
        if (year) {
          return schedule.year === parseInt(year);
        }
        return true;
      });
      
      setSchedules(filteredData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  // Get all days in the month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Pełny Grafik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="month">Miesiąc</Label>
                <Input
                  id="month"
                  type="number"
                  min="1"
                  max="12"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="np. 12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Rok</Label>
                <Input
                  id="year"
                  type="number"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="np. 2024"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch}>Szukaj</Button>
              </div>
            </div>

            {schedules.length > 0 && month && year && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Logacja</TableHead>
                      {Array.from({ length: getDaysInMonth(parseInt(month), parseInt(year)) }, (_, i) => (
                        <TableHead key={i + 1} className="text-center">{i + 1}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{schedule.name}</TableCell>
                        {Array.from({ length: getDaysInMonth(parseInt(month), parseInt(year)) }, (_, i) => {
                          const day = (i + 1).toString();
                          const isDayShift = schedule.day_shifts?.includes(day);
                          const isNightShift = schedule.night_shifts?.includes(day);
                          return (
                            <TableCell key={i + 1} className="text-center">
                              {isDayShift && "D"}
                              {isNightShift && "N"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FullSchedule;