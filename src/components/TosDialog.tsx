import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const TosDialog = () => {
  const [open, setOpen] = useState(false);
  const [agreedToTos, setAgreedToTos] = useState(false); // State for agreement checkbox
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
        admin_id: admin.uuid
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
              Niniejszy Regulamin („Regulamin") określa zasady korzystania z usługi generatora harmonogramu („Usługa”),
              która umożliwia synchronizację harmonogramów z urządzeniami mobilnymi. Korzystając z Usługi, akceptujesz
              wszystkie warunki i zasady określone w tym Regulaminie. Jeśli nie zgadzasz się z warunkami, prosimy o
              niekorzystanie z Usługi.
            </p>

            <h2 className="text-lg font-bold">2. Definicje</h2>
            <p><strong>Usługa:</strong> Generator harmonogramu umożliwiający tworzenie, edytowanie i synchronizowanie harmonogramów z urządzeniami mobilnymi.</p>
            <p><strong>Użytkownik:</strong> Osoba korzystająca z Usługi, która zaakceptowała niniejszy Regulamin.</p>

            <h2 className="text-lg font-bold">3. Korzystanie z Usługi</h2>
            <p>
              Użytkownik zobowiązuje się do korzystania z Usługi zgodnie z jej przeznaczeniem i nie wykorzystywać jej do działań niezgodnych z prawem.
            </p>
            <p>
              Usługa umożliwia synchronizację danych harmonogramu z urządzeniami mobilnymi, jednak Użytkownik ponosi odpowiedzialność
              za wszelkie dane, które wprowadza do systemu.
            </p>
            <p>
              Usługa może wymagać dostępu do internetu oraz odpowiednich uprawnień na urządzeniu mobilnym, co jest poza kontrolą operatora Usługi.
            </p>

            <h2 className="text-lg font-bold">4. Ograniczenie odpowiedzialności</h2>
            <p>
              Usługa jest świadczona „tak jak jest” i „w miarę dostępności”. Operator Usługi nie gwarantuje, że będzie ona wolna od błędów, awarii,
              przerw w działaniu ani innych problemów technicznych.
            </p>
            <p>
              Operator Usługi nie ponosi odpowiedzialności za jakiekolwiek szkody, straty lub nieprawidłowości związane z korzystaniem z Usługi,
              w tym, ale nie wyłącznie, utratę danych, szkody wynikłe z opóźnień w synchronizacji, błędów w generowaniu harmonogramu, ani
              za problemy związane z kompatybilnością z urządzeniami mobilnymi.
            </p>
            <p>
              Operator Usługi nie ponosi odpowiedzialności za jakiekolwiek szkody powstałe na skutek niewłaściwego użytkowania Usługi
              lub jej nieautoryzowanego wykorzystania przez osoby trzecie.
            </p>
            <p>
              Operator Usługi nie ponosi odpowiedzialności za naruszenie bezpieczeństwa danych użytkownika, w tym za przypadki włamania do systemu
              i kradzieży danych, mimo stosowania odpowiednich środków ochrony.
            </p>

            <h2 className="text-lg font-bold">5. Ochrona danych osobowych</h2>
            <p>
              Użytkownik wyraża zgodę na przetwarzanie swoich danych osobowych w zakresie niezbędnym do świadczenia Usługi, zgodnie z obowiązującymi przepisami prawa.
            </p>
            <p>
              Operator Usługi podejmuje odpowiednie środki w celu ochrony danych użytkowników przed nieautoryzowanym dostępem, utratą lub uszkodzeniem. Niemniej jednak, Operator Usługi nie ponosi odpowiedzialności za przypadki kradzieży danych,
              ataki hakerskie, czy inne nieautoryzowane zdarzenia mogące naruszyć bezpieczeństwo przechowywanych danych.
            </p>
            <p>
              Jeśli Użytkownik chce całkowicie usunąć swoje dane z systemu, musi skontaktować się z Operatorem Usługi poprzez adres e-mail: jimmypogo@proton.me. Operator podejmie działania w celu usunięcia danych w możliwie najkrótszym czasie, zgodnie
              z obowiązującymi przepisami prawa dotyczącymi ochrony danych osobowych.
            </p>

            <h2 className="text-lg font-bold">6. Zmiany w Regulaminie</h2>
            <p>
              Operator Usługi zastrzega sobie prawo do zmiany niniejszego Regulaminu w dowolnym czasie. O wszelkich zmianach Użytkownicy zostaną
              poinformowani za pośrednictwem odpowiednich kanałów komunikacji.
            </p>
            <p>
              Zmiany w Regulaminie wchodzą w życie w dniu ich opublikowania, chyba że postanowiono inaczej.
            </p>

            <h2 className="text-lg font-bold">7. Zakończenie korzystania z Usługi</h2>
            <p>
              Użytkownik może zakończyć korzystanie z Usługi w każdej chwili poprzez zaprzestanie jej używania. Operator Usługi może także zawiesić
              lub zakończyć dostęp do Usługi w przypadku naruszenia warunków Regulaminu przez Użytkownika.
            </p>

            <h2 className="text-lg font-bold">8. Prawo właściwe i rozstrzyganie sporów</h2>
            <p>
              Niniejszy Regulamin podlega prawu polskiemu.
            </p>
            <p>
              Wszelkie spory wynikające z korzystania z Usługi będą rozstrzygane przez sąd właściwy dla siedziby operatora Usługi.
            </p>

            <h2 className="text-lg font-bold">Podsumowanie</h2>
            <p>
              Korzystając z Usługi, akceptujesz, że operator nie ponosi odpowiedzialności za jakiekolwiek problemy techniczne, straty danych
              ani inne szkody związane z używaniem generatora harmonogramów.
            </p>
            <p>
              Operator nie ponosi odpowiedzialności za kradzież danych użytkownika w wyniku ataków hakerskich, włamań, ani innych problemów
              związanych z bezpieczeństwem.
            </p>
            <p>
              Jeśli chcesz usunąć swoje dane z systemu, musisz skontaktować się z Operatorem Usługi pod adresem e-mail jimmypogo@proton.me.
            </p>
          </div>
        </ScrollArea>
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="agree"
            checked={agreedToTos}
            onCheckedChange={(checked) => setAgreedToTos(checked as boolean)}
          />
          <label htmlFor="agree" className="text-sm">
            Przeczytałem regulamin i zgadzam się z jego warunkami.
          </label>
        </div>
        <Button 
          onClick={handleAccept} 
          className="w-full"
          disabled={!agreedToTos} // Disable the button if the checkbox is not checked
        >
          Akceptuję Regulamin
        </Button>
      </DialogContent>
    </Dialog>
  );
};
