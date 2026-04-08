import { Badge } from "@/components/ui/badge";
import type { Skill } from "@/core/types";

interface SkillTagsProps {
  skills: Skill[];
}

/**
 * Renders a list of the candidate's technical skills as UI badges.
 * Handles the empty state gracefully if no skills are present.
 * 
 * @param props - Component props containing the candidate's skill list.
 */
export function SkillTags({ skills }: SkillTagsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-start border-b pb-4 gap-2">
        <h3 className="font-semibold text-lg">
          Technical Skills
        </h3>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
          {skills.length}
        </span>
      </div>
      
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-1">
          {skills.map((skill) => (
            <Badge 
              key={skill.id} 
              variant="default" 
              className="px-3 py-1 font-medium text-sm transition-colors"
            >
              {skill.name}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No technical skills have been recorded for this candidate yet.
        </div>
      )}
    </div>
  );
}