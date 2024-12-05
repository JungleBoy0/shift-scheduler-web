import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Preview = () => {
  const [searchLocation, setSearchLocation] = useState("");

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['schedules', searchLocation],
    queryFn: async () => {
      if (!searchLocation) return [];
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('name', searchLocation);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!searchLocation,
  });

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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Logacja</TableHead>
                      <TableHead>Miesiąc/Rok</TableHead>
                      <TableHead>Zmiany Dzienne</TableHead>
                      <TableHead>Zmiany Nocne</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.name}</TableCell>
                        <TableCell>{schedule.month}/{schedule.year}</TableCell>
                        <TableCell>{schedule.day_shifts?.join(', ') || '-'}</TableCell>
                        <TableCell>{schedule.night_shifts?.join(', ') || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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