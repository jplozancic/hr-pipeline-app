import { format } from "date-fns";
import type { TimelineEvent } from "@/core/types"; 
import { getEventIcon, getEventTitle } from "../../utils/timelineHelpers";

interface TimelineProps {
  events: TimelineEvent[];
}

/**
 * Renders the vertical chronological activity timeline for a candidate.
 * Sorts events descending (newest on top) and relies on timelineHelpers for visual styling.
 * 
 * @param props - Component props containing the list of timeline events.
 */
export function Timeline({ events }: TimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (!sortedEvents.length) {
    return (
      <div className="text-sm text-muted-foreground italic p-4 text-center border rounded-lg">
        No timeline events recorded.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-lg border-b pb-4">Activity Timeline</h3>
      
      <div className="relative pl-6 border-l-2 border-muted ml-3 mt-2 space-y-8 pb-4">
        {sortedEvents.map((event) => (
          <div key={event.id} className="relative">
            <span className="absolute -left-8.75 bg-background border-2 p-1.5 rounded-full flex items-center justify-center">
              {getEventIcon(event.type)}
            </span>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-1">
                <span className="font-medium text-sm">
                  {getEventTitle(event.type)}
                </span>
                <span className="text-xs text-muted-foreground px-2 py-0.5 w-fit">
                  {format(new Date(event.date), "MMM d, yyyy • h:mm a")}
                </span>
              </div>
              
              {event.note && (
                <p className="text-sm text-muted-foreground mt-1 bg-muted/20 p-2.5 rounded-md border border-border/50">
                  {event.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}