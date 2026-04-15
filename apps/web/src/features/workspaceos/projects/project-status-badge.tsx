import { Badge } from '@colanode/ui/components/ui/badge';

interface ProjectStatusBadgeProps {
  status: string;
}

const getStatusStyles = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'READY':
      return 'bg-emerald-600 text-white';
    case 'ERROR':
      return 'bg-destructive text-white';
    case 'PROVISIONING':
      return 'bg-amber-500 text-black animate-pulse';
    case 'ARCHIVED':
      return 'bg-slate-500 text-white';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

export const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  const normalizedStatus = status.toUpperCase();

  return (
    <Badge className={getStatusStyles(normalizedStatus)} variant="secondary">
      {normalizedStatus}
    </Badge>
  );
};
