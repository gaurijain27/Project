import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Calendar, LogOut, Edit2, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";

export function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    const data = localStorage.getItem("pranaLinkUser");
    if (data) {
      try {
        setProfile(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse profile data");
        setProfile({});
      }
    } else {
      setProfile({});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pranaLinkUser");
    navigate("/auth");
  };

  const handleEdit = () => {
    setEditForm(profile || {});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(editForm);
    localStorage.setItem("pranaLinkUser", JSON.stringify(editForm));
    setIsEditing(false);
  };

  if (!profile) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your personal information.</p>
        </div>
        <Button variant="destructive" onClick={handleLogout} className="flex gap-2 shadow-sm">
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your details used across PranaLink</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit} className="flex gap-2">
                <Edit2 className="h-4 w-4" /> Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input id="edit-name" value={editForm.name || ""} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-username">Username</Label>
                    <Input id="edit-username" value={editForm.username || ""} onChange={e => setEditForm({...editForm, username: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input id="edit-email" type="email" value={editForm.email || ""} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input id="edit-phone" type="tel" value={editForm.phone || ""} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-age">Age</Label>
                    <Input id="edit-age" type="number" value={editForm.age || ""} onChange={e => setEditForm({...editForm, age: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-gender">Gender</Label>
                    <select id="edit-gender" value={editForm.gender || ""} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
                  <Button variant="outline" onClick={handleCancel} className="flex gap-2">
                    <X className="h-4 w-4" /> Cancel
                  </Button>
                  <Button onClick={handleSave} className="flex gap-2">
                    <Check className="h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                    <span className="text-3xl font-bold text-primary">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{profile.name || "Unknown User"}</h3>
                    <p className="text-muted-foreground">@{profile.username || "user"}</p>
                  </div>
                </div>

                <div className="grid gap-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="font-medium">{profile.email || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{profile.phone || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Age & Gender</p>
                      <p className="font-medium">
                        {profile.age ? `${profile.age} years` : "Age not provided"} • {profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "Gender not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
