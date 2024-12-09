import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const TosDialog = () => {
  const [open, setOpen] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(false);
  const { admin } = useAuth();

  useEffect(() => {
    const checkTosAcceptance = async () => {
      if (!admin?.uuid) return;

      const { data } = await supabase
        .from('tos_acceptance')
        .select('*')
        .eq('admin_id', admin.uuid)
        .single();

      if (!data) {
        setOpen(true);
      }
    };

    checkTosAcceptance();
  }, [admin?.uuid]);

  const handleAccept = async () => {
    if (!admin?.uuid) return;

    await supabase
      .from('tos_acceptance')
      .insert({
        admin_id: admin.uuid,
        remember_choice: rememberChoice
      });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Regulamin Usługi SchedFlow</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
          <div className="space-y-4">
            <h2 className="text-lg font-bold">1. Wstęp</h2>
            <p>
              Niniejszy Regulamin („Regulamin") określa zasady korzystania z usługi generatora harmonogramu („Usługa"), 
              która umożliwia synchronizację harmonogramów z urządzeniami mobilnymi. Korzystając z Usługi, akceptujesz 
              wszystkie warunki i zasady określone w tym Regulaminie. Jeśli nie zgadzasz się z warunkami, prosimy o 
              niekorzystanie z Usługi.
            </p>
            <h2 className="text-lg font-bold">2. Korzystanie z Usługi</h2>
            <p>
              Użytkownik zobowiązuje się do korzystania z Usługi zgodnie z obowiązującym prawem oraz niniejszym Regulaminem.
            </p>
            <h2 className="text-lg font-bold">3. Odpowiedzialność</h2>
            <p>
              Usługodawca nie ponosi odpowiedzialności za jakiekolwiek szkody wynikłe z korzystania z Usługi.
            </p>
            <h2 className="text-lg font-bold">4. Zmiany w Regulaminie</h2>
            <p>
              Usługodawca zastrzega sobie prawo do wprowadzania zmian w Regulaminie. Użytkownik zostanie poinformowany o wszelkich zmianach.
            </p>
            <h2 className="text-lg font-bold">5. Kontakt</h2>
            <p>
              W przypadku pytań dotyczących Regulaminu, prosimy o kontakt z obsługą klienta.
            </p>
          </div>
        </ScrollArea>
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="remember"
            checked={rememberChoice}
            onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
          />
          <label htmlFor="remember" className="text-sm">
            Zapamiętaj mój wybór
          </label>
        </div>
        <Button onClick={handleAccept} className="w-full">
          Akceptuję Regulamin
        </Button>
      </DialogContent>
    </Dialog>
  );
};
