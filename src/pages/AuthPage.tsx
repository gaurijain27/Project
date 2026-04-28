import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { Activity, CheckCircle2, ArrowRight, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export function AuthPage() {
  const { t, language, setLanguage } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [otpMode, setOtpMode] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  
  const [regData, setRegData] = useState({
    name: "", username: "", email: "", phone: "", age: "", gender: "", password: ""
  });

  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pranaLinkUser", JSON.stringify(regData));
    
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setIsLogin(true);
    }, 2000);
  };

  const handleNormalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const requestOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpMode(true);
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp === generatedOtp) {
      navigate("/dashboard");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Globe className="h-5 w-5 text-muted-foreground" />
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
          className="bg-background border border-border rounded-md px-2 py-1 text-sm outline-none"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>

      <div className="w-full max-w-md relative">
        <div className="flex justify-center mb-8 flex-col items-center gap-3">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-primary p-4 rounded-2xl shadow-lg shadow-primary/20"
          >
            <Activity className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">PranaLink</h1>
        </div>
        
        <Card className="shadow-xl border-border/50 backdrop-blur-sm bg-card/95 relative overflow-hidden">
          
          <AnimatePresence>
            {registerSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-0 left-0 right-0 bg-green-500 text-white p-3 text-center text-sm font-medium flex items-center justify-center gap-2 z-10"
              >
                <CheckCircle2 className="h-4 w-4" />
                Profile successfully created! Redirecting to login...
              </motion.div>
            )}
          </AnimatePresence>

          <CardHeader className="text-center pb-2 pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {isLogin ? (otpMode ? "Enter OTP" : t("welcome_back")) : t("create_account")}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {isLogin 
                ? (otpMode ? "We've generated a code for you" : t("enter_credentials")) 
                : t("enter_details")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-8">
            {!otpMode && (
              <div className="flex bg-muted/50 p-1 rounded-xl mb-8">
                <button
                  className={`flex-1 text-sm font-semibold py-2.5 rounded-lg transition-all ${isLogin ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setIsLogin(true)}
                >
                  {t("login")}
                </button>
                <button
                  className={`flex-1 text-sm font-semibold py-2.5 rounded-lg transition-all ${!isLogin ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setIsLogin(false)}
                >
                  {t("register")}
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? (otpMode ? "otp" : "login") : "register"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {isLogin && otpMode ? (
                  <form onSubmit={verifyOtp} className="space-y-5 text-center">
                    <div className="bg-primary/10 p-5 rounded-xl border border-primary/20 mb-6 shadow-inner">
                      <p className="text-sm font-medium text-foreground/80 mb-3">Your PranaLink verification code is:</p>
                      <p className="text-4xl font-mono tracking-[0.2em] font-bold text-primary">{generatedOtp}</p>
                    </div>
                    <div className="space-y-2 text-left">
                      <Label htmlFor="otp">Enter 6-digit verification code</Label>
                      <Input 
                        id="otp" 
                        placeholder="••••••" 
                        required 
                        maxLength={6}
                        className="h-12 text-center text-xl tracking-widest"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full h-11 text-base mt-4 font-semibold">
                      Verify & Login
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setOtpMode(false)}
                      className="w-full mt-2"
                    >
                      Back to password login
                    </Button>
                  </form>
                ) : isLogin ? (
                  <form onSubmit={handleNormalLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="identifier">{t("email_phone_username")}</Label>
                      <Input id="identifier" placeholder="m@example.com" required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">{t("password")}</Label>
                        <a href="#" className="text-xs text-primary hover:underline">{t("forgot_password")}</a>
                      </div>
                      <Input id="password" type="password" required className="h-11" />
                    </div>
                    <div className="flex flex-col space-y-4 pt-4">
                      <Button type="submit" className="w-full h-11 text-base font-semibold">
                        {t("login_with_password")}
                      </Button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-3 text-muted-foreground font-medium">
                            {t("or_continue_with")}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" type="button" onClick={requestOtp} className="w-full h-11 text-base font-semibold">
                        {t("login_with_otp")}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-name">{t("full_name")}</Label>
                        <Input id="reg-name" placeholder="Rahul Verma" required value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-username">{t("username")}</Label>
                        <Input id="reg-username" placeholder="rahulv123" required value={regData.username} onChange={e => setRegData({...regData, username: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">{t("email")}</Label>
                      <Input id="reg-email" type="email" placeholder="m@example.com" required value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-phone">{t("phone")}</Label>
                        <Input id="reg-phone" type="tel" placeholder="+91 98765 00000" value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-age">{t("age")}</Label>
                        <Input id="reg-age" type="number" placeholder="25" min="1" max="120" value={regData.age} onChange={e => setRegData({...regData, age: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-gender">{t("gender")}</Label>
                      <select id="reg-gender" value={regData.gender} onChange={e => setRegData({...regData, gender: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">{t("password")}</Label>
                      <Input id="reg-password" type="password" required value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} />
                    </div>
                    <Button type="submit" className="w-full h-11 text-base mt-2 flex gap-2 items-center justify-center font-semibold">
                      {t("create_account")} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
