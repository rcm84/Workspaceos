import { Badge } from '@colanode/ui/components/ui/badge';

interface TemplatePillProps {
  templateSlug: string;
}

export const TemplatePill = ({ templateSlug }: TemplatePillProps) => {
  return <Badge variant="secondary">{templateSlug}</Badge>;
};
