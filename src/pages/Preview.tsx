import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const Preview = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!searchLocation) {
        setSchedules([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/list-calendars?name=${encodeURIComponent(searchLocation)}`);
        if (!response.ok) throw new Error('Failed to fetch schedules');
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
        setSchedules([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [searchLocation]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Podgląd grafiku</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchLocation">Logacja</Label>
                <Input
                  id="searchLocation"
                  placeholder="Wprowadź logację"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>

              {isLoading ? (
                <p className="text-gray-500">Ładowanie grafików...</p>
              ) : schedules && schedules.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Logacja</TableHead>
                        <TableHead>Miesiąc/Rok</TableHead>
                        <TableHead>Zmiany Dzienne</TableHead>
                        <TableHead>Zmiany Nocne</TableHead>
                        <TableHead>Link do kalendarza</TableHead>
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
                            <a
                              href={`http://20.215.224.183/calendars/${schedule.name}_${schedule.month}_${schedule.year}.ics`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600"
                            >
                              Pobierz kalendarz
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : searchLocation ? (
                <p className="text-gray-500">Nie znaleziono grafików dla tej logacji.</p>
              ) : (
                <p className="text-gray-500">Wprowadź logację aby wyświetlić grafiki.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Preview;