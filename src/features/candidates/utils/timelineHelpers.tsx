import type { JSX } from "react";
import { 
  CheckCircle2, 
  FileText, 
  PhoneCall, 
  Users, 
  MonitorPlay, 
  Briefcase,
  Search,
  Circle,
  SquarePen,
} from "lucide-react";

/**
 * Normalizes DB string types format by removing spaces/dashes and making lowercase.
 * This guarantees safe visual mapping execution for any API casing format.
 * 
 * @param type - Raw timeline event type from the database.
 */
const normalizeType = (type: string) => type.toLowerCase().replace(/[_\- ]/g, "");

/**
 * Returns a corresponding Lucide React Icon element based on the given event type.
 * 
 * @param type - Normalizable timeline event type string.
 */
export const getEventIcon = (type: string) => {
  const normalized = normalizeType(type);
  
  const iconMap: Record<string, JSX.Element> = {
    applied: <FileText className="h-4 w-4 text-blue-500" />,
    phonescreen: <PhoneCall className="h-4 w-4 text-purple-500" />,
    screening: <Search className="h-4 w-4 text-indigo-500" />,
    resumescreen: <Search className="h-4 w-4 text-indigo-500" />,
    onsiteinterview: <Users className="h-4 w-4 text-orange-500" />,
    technicalinterview: <MonitorPlay className="h-4 w-4 text-pink-500" />,
    portfolioreview: <Briefcase className="h-4 w-4 text-amber-500" />,
    offeraccepted: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    noteadded: <FileText className="h-4 w-4 text-blue-400" />,
    followupadded: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    statuschanged: <SquarePen  className="h-4 w-4 text-orange-400" />,
  };

  return iconMap[normalized] || <Circle className="h-4 w-4 text-muted-foreground" />;
};

/**
 * Outputs a nicely formatted, human-readable Title string based on an event type identifier.
 * 
 * @param type - Normalizable timeline event type string.
 */
export const getEventTitle = (type: string) => {
  const normalized = normalizeType(type);
  
  const titleMap: Record<string, string> = {
    applied: "Application Received",
    phonescreen: "Phone Screen",
    screening: "Screening",
    resumescreen: "Resume Review",
    onsiteinterview: "On-site Interview",
    technicalinterview: "Technical Interview",
    portfolioreview: "Portfolio Review",
    offeraccepted: "Offer Accepted",
    noteadded: "Note Added",
    followupadded: "Task Created",
    statuschanged: "Status Changed",
  };

  return titleMap[normalized] || type; // Fallback to original string if not mapped
};