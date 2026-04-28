import { useState } from "react";
import { Syringe, Plus, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { useLanguage } from "../contexts/LanguageContext";

interface Vaccine {
  id: string;
  name: string;
  dateGiven: string;
  nextDue: string;
  provider: string;
}

export function VaccinationsPage() {
  const { t } = useLanguage();
  const [vaccines, setVaccines] = useState<Vaccine[]>([
    { id: "1", name: "COVID-19 Booster", dateGiven: "2025-10-15", nextDue: "2026-10-15", provider: "Apollo Hospital" },
    { id: "2", name: "Flu Shot", dateGiven: "2025-09-01", nextDue: "2026-09-01", provider: "Sanjeevani Clinic" },
    { id: "3", name: "Tetanus (Tdap)", dateGiven: "2018-05-20", nextDue: "2028-05-20", provider: "Dr. Sharma's Office" }
  ]);
  
  const [name, setName] = useState("");
  const [dateGiven, setDateGiven] = useState("");
  const [nextDue, setNextDue] = useState("");
  const [provider, setProvider] = useState("");

  const addVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dateGiven) return;
    
    const newVac: Vaccine = {
      id: Math.random().toString(),
      name,
      dateGiven,
      nextDue,
      provider: provider || "Unknown Provider"
    };
    
    setVaccines([newVac, ...vaccines]);
    setName("");
    setDateGiven("");
    setNextDue("");
    setProvider("");
  };

  const isDueSoon = (dateString?: string) => {
    if (!dateString) return false;
    const days = (new Date(dateString).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return days > 0 && days <= 30; // within 30 days
  };

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{t("vaccinations")}</h1>
        <p className="text-muted-foreground mt-2 text-lg">Keep track of your immunization records and upcoming doses.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit shadow-md border-border/50">
          <CardHeader>
            <CardTitle>Log Vaccine</CardTitle>
            <CardDescription>Add a new immunization record</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addVaccine} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="v-name">Vaccine Name</Label>
                <Input id="v-name" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Hepatitis B" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-date">Date Administered</Label>
                <Input type="date" id="v-date" value={dateGiven} onChange={e => setDateGiven(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-due">Next Due Date (Optional)</Label>
                <Input type="date" id="v-due" value={nextDue} onChange={e => setNextDue(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-provider">Healthcare Provider</Label>
                <Input id="v-provider" value={provider} onChange={e => setProvider(e.target.value)} placeholder="Clinic or Doctor name" />
              </div>
              <Button type="submit" className="w-full mt-4 font-semibold shadow-sm">
                <Plus className="h-4 w-4 mr-2" /> Add Record
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md border-border/50">
          <CardHeader>
            <CardTitle>Immunization History</CardTitle>
            <CardDescription>Your logged vaccines and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vaccines.map((v) => {
                const overdue = isOverdue(v.nextDue);
                const dueSoon = isDueSoon(v.nextDue);
                return (
                  <div key={v.id} className="flex items-start justify-between p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className="bg-primary/10 p-3.5 rounded-full h-fit">
                        <Syringe className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{v.name}</h4>
                        <p className="text-sm text-muted-foreground font-medium mb-2">{v.provider}</p>
                        <div className="flex gap-4 text-sm bg-muted/50 px-3 py-1.5 rounded-lg w-fit">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            Given: {v.dateGiven}
                          </span>
                        </div>
                      </div>
                    </div>
                    {v.nextDue && (
                      <div className="text-right flex flex-col items-end">
                        <p className="text-sm text-muted-foreground font-medium mb-1">Next Due</p>
                        {overdue ? (
                          <div className="bg-destructive/10 text-destructive px-3 py-1 rounded-md text-sm font-bold flex items-center gap-1.5">
                            <AlertCircle className="h-4 w-4" /> {v.nextDue} (Overdue)
                          </div>
                        ) : dueSoon ? (
                          <div className="bg-orange-500/10 text-orange-600 px-3 py-1 rounded-md text-sm font-bold flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" /> {v.nextDue} (Soon)
                          </div>
                        ) : (
                          <div className="bg-primary/5 text-foreground px-3 py-1 rounded-md text-sm font-semibold">
                            {v.nextDue}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
