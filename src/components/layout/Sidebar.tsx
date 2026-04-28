import { NavLink } from "react-router-dom"
import { FileText, Bell, User, Activity, Syringe, CalendarClock, Globe } from "lucide-react"
import { cn } from "../../lib/utils"
import { useLanguage } from "../../contexts/LanguageContext"

export function Sidebar() {
  const { t, language, setLanguage } = useLanguage();

  const links = [
    { name: t("my_records"), path: "/dashboard", icon: FileText },
    { name: t("vaccinations"), path: "/vaccinations", icon: Syringe },
    { name: t("checkups"), path: "/checkups", icon: CalendarClock },
    { name: t("reminders"), path: "/scheduler", icon: Bell },
    { name: t("profile"), path: "/profile", icon: User },
  ]

  return (
    <div className="w-72 border-r border-border bg-card/80 backdrop-blur-md min-h-screen p-5 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-center space-x-3 mb-10 px-2 mt-4">
        <div className="bg-gradient-to-br from-primary to-primary/80 p-2.5 rounded-xl shadow-lg shadow-primary/20">
          <Activity className="h-7 w-7 text-primary-foreground" />
        </div>
        <span className="text-3xl font-extrabold tracking-tight text-primary">PranaLink</span>
      </div>
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]"
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{link.name}</span>
            </NavLink>
          )
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-border/50">
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground bg-muted/50 rounded-xl">
          <Globe className="h-4 w-4" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
            className="bg-transparent border-none outline-none font-medium w-full cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
        <div className="px-4 py-3 text-xs text-muted-foreground/60 text-center mt-2">
          &copy; 2026 PranaLink
        </div>
      </div>
    </div>
  )
}
