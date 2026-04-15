import { Badge } from '@colanode/ui/components/ui/badge';

interface ProjectStatusBadgeProps {
  status: string;
}

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'failed' || normalizedStatus === 'error') {
    return 'destructive';
  }

  if (normalizedStatus === 'completed' || normalizedStatus === 'active') {
    return 'default';
  }

  return 'secondary';
};

export const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
};
