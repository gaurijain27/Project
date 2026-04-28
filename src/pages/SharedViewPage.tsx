import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Activity, Clock, ShieldAlert, Droplets } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function SharedViewPage() {
  useParams();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [expired, setExpired] = useState(false);

  // Mock data for the doctor view
  const records = [
    { id: "1", date: "2026-05-10", doctor: "Dr. Aarav Sharma", clinic: "City Health Center", haemoglobin: 14.2, sugar: 95, spo2: 98, type: "Blood Test" },
    { id: "2", date: "2026-06-15", doctor: "Dr. Sneha Iyer", clinic: "Apollo Hospital", haemoglobin: 13.8, sugar: 102, spo2: 99, type: "General Checkup" },
    { id: "3", date: "2026-07-20", doctor: "Dr. Kartik Patel", clinic: "Sanjeevani Clinic", haemoglobin: 14.5, sugar: 88, spo2: 97, type: "Prescription" },
    { id: "4", date: "2026-08-05", doctor: "Dr. Rajesh Gupta", clinic: "Metro Diagnostics", haemoglobin: 14.0, sugar: 90, spo2: 98, type: "Follow-up" },
  ];

  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (expired) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-2">Link Expired</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          This secure medical summary link has expired. The patient must generate a new access link for you.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">PranaLink</span>
            <span className="bg-muted px-2 py-0.5 rounded text-sm text-muted-foreground ml-2 font-medium">Doctor View</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-500/10 text-orange-600 px-4 py-2 rounded-full font-bold">
            <Clock className="h-5 w-5" />
            Expires in {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Patient Health Summary</h1>
          <p className="text-muted-foreground mt-1 text-lg">Secure, read-only access to critical health metrics.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-md border-border/50">
             <CardHeader>
               <CardTitle>Health Overview</CardTitle>
               <CardDescription>Aggregated metrics from recent records</CardDescription>
             </CardHeader>
             <CardContent className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center gap-4">
                   <div className="bg-primary/10 p-3 rounded-full"><Droplets className="h-6 w-6 text-primary" /></div>
                   <div>
                     <p className="text-sm text-muted-foreground font-medium">Avg Haemoglobin</p>
                     <p className="text-2xl font-bold">14.1 <span className="text-sm font-normal text-muted-foreground">g/dL</span></p>
                   </div>
                </div>
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center gap-4">
                   <div className="bg-primary/10 p-3 rounded-full"><Activity className="h-6 w-6 text-primary" /></div>
                   <div>
                     <p className="text-sm text-muted-foreground font-medium">Avg Sugar (F)</p>
                     <p className="text-2xl font-bold">93 <span className="text-sm font-normal text-muted-foreground">mg/dL</span></p>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Card className="shadow-md border-border/50">
          <CardHeader>
            <CardTitle>Health Metrics Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={records}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="date" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line type="monotone" name="Haemoglobin (g/dL)" dataKey="haemoglobin" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" name="Sugar (mg/dL)" dataKey="sugar" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" name="SpO2 (%)" dataKey="spo2" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card className="shadow-md border-border/50">
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-t-lg">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg">Date</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Clinic / Doctor</th>
                    <th className="px-6 py-4">Hb (g/dL)</th>
                    <th className="px-6 py-4">Sugar</th>
                    <th className="px-6 py-4 rounded-tr-lg">SpO2</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="px-6 py-4 font-medium">{rec.date}</td>
                      <td className="px-6 py-4">
                        <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold">{rec.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold">{rec.clinic}</p>
                        <p className="text-xs text-muted-foreground">{rec.doctor}</p>
                      </td>
                      <td className="px-6 py-4">{rec.haemoglobin.toFixed(1)}</td>
                      <td className="px-6 py-4">{Math.round(rec.sugar)}</td>
                      <td className="px-6 py-4">{rec.spo2}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
