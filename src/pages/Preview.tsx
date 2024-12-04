import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Preview = () => {
  const [email, setEmail] = useState("");

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['schedules', email],
    queryFn: async () => {
      if (!email) return [];
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('name', email);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!email,
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {isLoading ? (
                <p className="text-gray-500">Loading schedules...</p>
              ) : schedules && schedules.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Month/Year</TableHead>
                      <TableHead>Day Shifts</TableHead>
                      <TableHead>Night Shifts</TableHead>
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
              ) : email ? (
                <p className="text-gray-500">Nie znaleziono zmian do tego adresu email.</p>
              ) : (
                <p className="text-gray-500">Wpisz Email by wyświetlić zmiany.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Preview;