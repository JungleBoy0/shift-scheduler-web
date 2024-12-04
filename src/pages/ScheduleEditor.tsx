import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ScheduleEditor = () => {
  const [email, setEmail] = useState("");
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
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

  const updateSchedule = async (id: string, updatedData: any) => {
    const { error } = await supabase
      .from('schedules')
      .update({
        name: updatedData.name,
        day_shifts: updatedData.day_shifts,
        night_shifts: updatedData.night_shifts,
      })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update schedule",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Schedule updated successfully",
    });
    setEditingSchedule(null);
    refetch();
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
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
                        <TableCell className="space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingSchedule(schedule)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Schedule</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Name</Label>
                                  <Input
                                    value={editingSchedule?.name || ''}
                                    onChange={(e) => setEditingSchedule({
                                      ...editingSchedule,
                                      name: e.target.value
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Day Shifts (comma-separated)</Label>
                                  <Input
                                    value={editingSchedule?.day_shifts?.join(',') || ''}
                                    onChange={(e) => setEditingSchedule({
                                      ...editingSchedule,
                                      day_shifts: e.target.value.split(',').map(s => s.trim())
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Night Shifts (comma-separated)</Label>
                                  <Input
                                    value={editingSchedule?.night_shifts?.join(',') || ''}
                                    onChange={(e) => setEditingSchedule({
                                      ...editingSchedule,
                                      night_shifts: e.target.value.split(',').map(s => s.trim())
                                    })}
                                  />
                                </div>
                                <Button 
                                  className="w-full"
                                  onClick={() => updateSchedule(editingSchedule.id, editingSchedule)}
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
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