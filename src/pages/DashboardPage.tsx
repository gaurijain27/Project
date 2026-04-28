import { useState } from "react";
import { UploadCloud, FileText, CheckCircle, Calendar, Droplets, Activity, FileDown, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';


interface MedicalRecord {
  id: string;
  date: string;
  doctor: string;
  clinic: string;
  haemoglobin: number;
  sugar: number;
  spo2: number;
  expiryDate?: string;
  type: string;
  sourceFile?: string;
}

const sampleData: MedicalRecord[] = [
  { id: "1", date: "2026-05-10", doctor: "Dr. Aarav Sharma", clinic: "City Health Center", haemoglobin: 14.2, sugar: 95, spo2: 98, type: "Blood Test" },
  { id: "2", date: "2026-06-15", doctor: "Dr. Sneha Iyer", clinic: "Apollo Hospital", haemoglobin: 13.8, sugar: 102, spo2: 99, type: "General Checkup", expiryDate: "2026-12-15", sourceFile: "checkup_report.pdf" },
  { id: "3", date: "2026-07-20", doctor: "Dr. Kartik Patel", clinic: "Sanjeevani Clinic", haemoglobin: 14.5, sugar: 88, spo2: 97, type: "Prescription", expiryDate: "2026-05-05", sourceFile: "scan_001.jpg" }, // Soon to expire
  { id: "4", date: "2026-08-05", doctor: "Dr. Rajesh Gupta", clinic: "Metro Diagnostics", haemoglobin: 14.0, sugar: 90, spo2: 98, type: "Follow-up", expiryDate: "2026-04-20" }, // Expired
];

export function DashboardPage() {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "completed">("idle");
  const [records, setRecords] = useState<MedicalRecord[]>(sampleData);
  const [linkCopied, setLinkCopied] = useState(false);

  const simulateUpload = (fileName: string) => {
    setUploadState("uploading");
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState("completed");
          
          // Simulate extracted data from uploaded file
          const newRecord: MedicalRecord = {
            id: Math.random().toString(),
            date: new Date().toISOString().split('T')[0],
            doctor: "Dr. AI Analysis",
            clinic: "Uploaded Report",
            haemoglobin: 13.5 + Math.random() * 2,
            sugar: 90 + Math.random() * 20,
            spo2: 96 + Math.floor(Math.random() * 4),
            type: "Lab Report",
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // expires in 30 days
            sourceFile: fileName
          };
          setRecords(prevRecs => [...prevRecs, newRecord]);
          
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUpload(e.dataTransfer.files[0].name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload(e.target.files[0].name);
    }
  };

  const exportPdf = () => {
    window.print();
  };

  const generateLink = () => {
    const id = Math.random().toString(36).substring(7);
    const url = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const isExpired = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const isExpiringSoon = (dateString?: string) => {
    if (!dateString) return false;
    const days = (new Date(dateString).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return days > 0 && days <= 14;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 print:m-0 print:p-0">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{t("my_records")}</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage, analyze, and share your medical health history.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={generateLink} className="shadow-sm font-semibold flex gap-2">
            {linkCopied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
            {linkCopied ? "Link Copied!" : t("generate_link")}
          </Button>
          <Button onClick={exportPdf} className="shadow-sm font-semibold flex gap-2">
            <FileDown className="h-4 w-4" />
            {t("export_pdf")}
          </Button>
        </div>
      </div>

      {/* Upload Section - Hidden on print */}
      <div className="grid gap-6 md:grid-cols-2 print:hidden">
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle>{t("upload_report")}</CardTitle>
            <CardDescription>Drag and drop your PDF or image files to extract vitals automatically</CardDescription>
          </CardHeader>
          <CardContent>
            {uploadState === "idle" && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-4
                  ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-accent/50"}`}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <div className="bg-primary/10 p-4 rounded-full">
                  <UploadCloud className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <p className="text-base font-semibold">{t("drag_drop")}</p>
                  <p className="text-sm text-muted-foreground mt-1">PDF, JPG, PNG (max. 10MB)</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".pdf,image/*"
                />
              </div>
            )}

            {uploadState === "uploading" && (
              <div className="py-12 flex flex-col items-center justify-center space-y-6">
                <FileText className="h-12 w-12 text-primary animate-pulse" />
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Extracting health keywords...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {uploadState === "completed" && (
              <div className="py-10 flex flex-col items-center justify-center space-y-4">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full shadow-lg shadow-green-500/20"
                >
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </motion.div>
                <p className="font-bold text-xl">Data Extracted & Stored!</p>
                <button
                  onClick={() => setUploadState("idle")}
                  className="text-sm text-primary font-semibold hover:underline mt-2"
                >
                  Upload another file
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-md flex flex-col justify-center">
           <CardHeader>
             <CardTitle>Health Overview</CardTitle>
             <CardDescription>Your aggregated metrics from recent records</CardDescription>
           </CardHeader>
           <CardContent className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center gap-4">
                 <div className="bg-primary/10 p-3 rounded-full"><Droplets className="h-6 w-6 text-primary" /></div>
                 <div>
                   <p className="text-sm text-muted-foreground font-medium">Avg Haemoglobin</p>
                   <p className="text-2xl font-bold">{records.length ? (records.reduce((a, b) => a + b.haemoglobin, 0) / records.length).toFixed(1) : "--"} <span className="text-sm font-normal text-muted-foreground">g/dL</span></p>
                 </div>
              </div>
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center gap-4">
                 <div className="bg-primary/10 p-3 rounded-full"><Activity className="h-6 w-6 text-primary" /></div>
                 <div>
                   <p className="text-sm text-muted-foreground font-medium">Avg Sugar (F)</p>
                   <p className="text-2xl font-bold">{records.length ? (records.reduce((a, b) => a + b.sugar, 0) / records.length).toFixed(0) : "--"} <span className="text-sm font-normal text-muted-foreground">mg/dL</span></p>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Card className="border-border/50 shadow-md print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle>Health Metrics Trends</CardTitle>
          <CardDescription>Historical data collected from your uploads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={records}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="date" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                />
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
      <Card className="border-border/50 shadow-md print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle>Detailed Medical Records</CardTitle>
          <CardDescription>All your checkups, prescriptions, and lab reports</CardDescription>
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
                  <th className="px-6 py-4">SpO2</th>
                  <th className="px-6 py-4">Source File</th>
                  <th className="px-6 py-4 rounded-tr-lg text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => {
                  const expired = isExpired(rec.expiryDate);
                  const expiringSoon = isExpiringSoon(rec.expiryDate);

                  return (
                    <tr key={rec.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
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
                      <td className="px-6 py-4">
                        {rec.sourceFile ? (
                          <div className="flex items-center gap-1.5 text-primary text-xs font-semibold bg-primary/10 px-2.5 py-1 rounded-md w-fit">
                            <FileText className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[100px]" title={rec.sourceFile}>{rec.sourceFile}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs font-medium pl-4">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {expired ? (
                          <div className="flex items-center justify-end gap-1.5 text-destructive font-semibold bg-destructive/10 px-2 py-1 rounded-md inline-flex">
                            <AlertTriangle className="h-4 w-4" /> Expired
                          </div>
                        ) : expiringSoon ? (
                          <div className="flex items-center justify-end gap-1.5 text-orange-500 font-semibold bg-orange-500/10 px-2 py-1 rounded-md inline-flex">
                            <Calendar className="h-4 w-4" /> Renew Soon
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
