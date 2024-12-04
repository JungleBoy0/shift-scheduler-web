import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

const ScheduleEditor = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const { data: schedules, isLoading, refetch } = useQuery({
    queryKey: ['schedules', email],
    queryFn: async () => {
      if (!email) return [];
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('email', email);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!email,
  });

  const deleteSchedule = async (id: string) => {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete schedule",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Schedule deleted successfully",
    });
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Editor</CardTitle>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.name}</TableCell>
                        <TableCell>{schedule.month}/{schedule.year}</TableCell>
                        <TableCell>{schedule.day_shifts?.join(', ') || '-'}</TableCell>
                        <TableCell>{schedule.night_shifts?.join(', ') || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteSchedule(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : email ? (
                <p className="text-gray-500">No schedules found for this email.</p>
              ) : (
                <p className="text-gray-500">Enter an email to view and edit schedules.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleEditor;