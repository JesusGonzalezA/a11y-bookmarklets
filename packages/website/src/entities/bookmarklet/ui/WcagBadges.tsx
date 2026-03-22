import { Badge } from "@/shared/ui/badge";

interface WcagBadgesProps {
  criteria: string[];
}

export function WcagBadges({ criteria }: WcagBadgesProps) {
  return (
    <ul className="flex flex-wrap gap-1.5 list-none p-0" aria-label="WCAG criteria">
      {criteria.map((criterion) => (
        <li key={criterion}>
          <Badge variant="secondary">WCAG {criterion}</Badge>
        </li>
      ))}
    </ul>
  );
}
