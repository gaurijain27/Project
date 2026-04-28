import { useState, useEffect } from "react";
import { CalendarClock, Plus, MapPin, Bell, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { useLanguage } from "../contexts/LanguageContext";

interface Checkup {
  id: string;
  doctor: string;
  clinic: string;
  datetime: string; // ISO string
  notifiedDayBefore: boolean;
  notifiedHourBefore: boolean;
}

export function CheckupsPage() {
  const { t } = useLanguage();
  const [checkups, setCheckups] = useState<Checkup[]>([]);
  const [doctor, setDoctor] = useState("");
  const [clinic, setClinic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
    
    // Sample data
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setCheckups([
      {
        id: "1",
        doctor: "Dr. Sneha Iyer",
        clinic: "Apollo Hospital",
        datetime: tomorrow.toISOString().slice(0, 16),
        notifiedDayBefore: false,
        notifiedHourBefore: false
      }
    ]);
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      setCheckups(prev => {
        let changed = false;
        const next = prev.map(c => {
          const checkupTime = new Date(c.datetime).getTime();
          const timeDiff = checkupTime - now;
          
          let newDayBefore = c.notifiedDayBefore;
          let newHourBefore = c.notifiedHourBefore;

          // 1 Day before reminder (between 24 and 23.5 hours)
          if (timeDiff <= 24 * 60 * 60 * 1000 && timeDiff > 23.5 * 60 * 60 * 1000 && !c.notifiedDayBefore) {
            if (Notification.permission === "granted") {
              new Notification("Upcoming Checkup Tomorrow", {
                body: `You have an appointment with ${c.doctor} tomorrow at ${new Date(c.datetime).toLocaleTimeString()}`,
              });
            }
            newDayBefore = true;
            changed = true;
          }

          // 1 Hour before reminder (between 60 and 55 mins)
          if (timeDiff <= 60 * 60 * 1000 && timeDiff > 55 * 60 * 1000 && !c.notifiedHourBefore) {
            if (Notification.permission === "granted") {
              new Notification("Checkup in 1 Hour", {
                body: `Your appointment with ${c.doctor} is in 1 hour at ${c.clinic}`,
              });
            }
            newHourBefore = true;
            changed = true;
          }

          return { ...c, notifiedDayBefore: newDayBefore, notifiedHourBefore: newHourBefore };
        });
        return changed ? next : prev;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const addCheckup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || !date || !time) return;

    const datetimeStr = `${date}T${time}`;

    const newCheckup: Checkup = {
      id: Math.random().toString(),
      doctor,
      clinic: clinic || "Not specified",
      datetime: datetimeStr,
      notifiedDayBefore: false,
      notifiedHourBefore: false
    };

    setCheckups([...checkups, newCheckup].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()));
    setDoctor("");
    setClinic("");
    setDate("");
    setTime("");
  };

  const formatDateTime = (isoStr: string) => {
    const d = new Date(isoStr);
    return {
      date: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{t("checkups")}</h1>
          <p className="text-muted-foreground mt-2 text-lg">Schedule appointments and get timely reminders.</p>
        </div>
        {permission !== "granted" && (
          <Button onClick={requestPermission} variant="outline" className="flex gap-2 shadow-sm font-semibold">
            <Bell className="h-4 w-4 text-primary" />
            Enable Notifications
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit shadow-md border-border/50">
          <CardHeader>
            <CardTitle>Schedule Visit</CardTitle>
            <CardDescription>Plan your next doctor appointment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addCheckup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="c-doc">Doctor Name</Label>
                <Input id="c-doc" value={doctor} onChange={e => setDoctor(e.target.value)} required placeholder="Dr. Rajesh Kumar" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-clinic">Clinic / Hospital</Label>
                <Input id="c-clinic" value={clinic} onChange={e => setClinic(e.target.value)} placeholder="Apollo Hospital" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="c-date">Date</Label>
                  <Input type="date" id="c-date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-time">Time</Label>
                  <Input type="time" id="c-time" value={time} onChange={e => setTime(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4 font-semibold shadow-sm">
                <Plus className="h-4 w-4 mr-2" /> Schedule Checkup
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md border-border/50">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled visits</CardDescription>
          </CardHeader>
          <CardContent>
            {checkups.length === 0 ? (
               <div className="text-center py-12 flex flex-col items-center justify-center text-muted-foreground bg-accent/20 rounded-xl border border-dashed border-border">
                 <CalendarClock className="h-12 w-12 mb-4 opacity-20 text-primary" />
                 <p className="text-lg font-medium text-foreground">No checkups scheduled.</p>
               </div>
            ) : (
              <div className="space-y-4">
                {checkups.map((c) => {
                  const { date: fDate, time: fTime } = formatDateTime(c.datetime);
                  const isPast = new Date(c.datetime) < new Date();
                  
                  return (
                    <div key={c.id} className={`flex items-start justify-between p-5 rounded-xl border shadow-sm transition-all ${isPast ? 'bg-muted/30 opacity-70' : 'bg-card hover:shadow-md'}`}>
                      <div className="flex gap-4">
                        <div className={`p-4 rounded-xl flex flex-col items-center justify-center min-w-[80px] ${isPast ? 'bg-muted' : 'bg-primary/10'}`}>
                          <span className={`text-sm font-bold ${isPast ? 'text-muted-foreground' : 'text-primary'}`}>{fDate.split(' ')[1]}</span>
                          <span className={`text-xs uppercase tracking-wider font-semibold ${isPast ? 'text-muted-foreground' : 'text-primary/70'}`}>{fDate.split(' ')[0]}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-xl flex items-center gap-2">
                            {c.doctor}
                            {isPast && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">Completed</span>}
                          </h4>
                          <div className="space-y-1 mt-2">
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" /> {c.clinic}
                            </p>
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                              <Clock className="h-4 w-4" /> {fTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
