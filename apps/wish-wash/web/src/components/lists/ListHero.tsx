import { hooks } from '@/hooks.js';
import { H1 } from '@a-type/ui/components/typography';
import { List } from '@wish-wash.biscuits/verdant';

export interface ListHeroProps {
  list: List;
}

export function ListHero({ list }: ListHeroProps) {
  const { name } = hooks.useWatch(list);

  return (
    <div className="col items-stretch">
      <H1 className="gutter-bottom">{name}</H1>
    </div>
  );
}
