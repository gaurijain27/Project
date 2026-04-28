import { useState, useEffect } from "react";
import { Bell, Plus, Clock, Pill, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";

interface Medication {
  id: string;
  name: string;
  time: string;
  notified: boolean;
}

export function SchedulerPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };

  const playPing = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTimeString = now.toTimeString().slice(0, 5); // HH:MM

      setMedications(prev => {
        let changed = false;
        const next = prev.map(med => {
          if (med.time === currentTimeString && !med.notified) {
            changed = true;
            if (Notification.permission === "granted") {
              new Notification("Medication Reminder", {
                body: `It's time to take your medication: ${med.name}`,
              });
            }
            playPing();
            return { ...med, notified: true };
          }
          if (med.time !== currentTimeString && med.notified) {
              changed = true;
              return { ...med, notified: false };
          }
          return med;
        });
        return changed ? next : prev;
      });
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  const addMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !time) return;

    const newMed: Medication = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      time,
      notified: false
    };

    setMedications([...medications, newMed].sort((a, b) => a.time.localeCompare(b.time)));
    setName("");
    setTime("");
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Health Scheduler</h1>
          <p className="text-muted-foreground mt-2 text-lg">Set reminders for your medications.</p>
        </div>
        {permission !== "granted" && (
          <Button onClick={requestPermission} variant="outline" className="flex gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Enable Notifications
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit shadow-md border-border/50">
          <CardHeader>
            <CardTitle>Add Medication</CardTitle>
            <CardDescription>Enter details for your new reminder</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addMedication} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="med-name">Medication Name</Label>
                <Input 
                  id="med-name" 
                  placeholder="e.g. Amoxicillin" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-time">Reminder Time</Label>
                <Input 
                  id="med-time" 
                  type="time" 
                  value={time} 
                  onChange={e => setTime(e.target.value)} 
                  required 
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full mt-2 gap-2 h-11 text-base">
                <Plus className="h-5 w-5" /> Add Reminder
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md border-border/50">
          <CardHeader>
            <CardTitle>Your Schedule</CardTitle>
            <CardDescription>Upcoming medication reminders</CardDescription>
          </CardHeader>
          <CardContent>
            {medications.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center text-muted-foreground bg-accent/20 rounded-xl border border-dashed border-border">
                <Pill className="h-16 w-16 mb-4 opacity-20 text-primary" />
                <p className="text-lg font-medium text-foreground">No medications scheduled yet.</p>
                <p className="text-sm mt-1">Add one using the form to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {medications.map(med => (
                  <div key={med.id} className="flex items-center justify-between p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-5">
                      <div className="bg-primary/10 p-4 rounded-full">
                        <Pill className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-xl">{med.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1.5 gap-1.5 font-medium">
                          <Clock className="h-4 w-4" />
                          <span>{med.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeMedication(med.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
