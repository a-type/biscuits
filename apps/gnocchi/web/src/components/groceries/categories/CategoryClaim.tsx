import { useCategoryClaimPresence } from '@/components/groceries/categories/hooks.js';
import {
  PeopleList,
  PeopleListAvatar,
} from '@/components/sync/people/People.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Category } from '@gnocchi.biscuits/verdant';
import { Button } from '@a-type/ui/components/button';
import classNames from 'classnames';
import { forwardRef, memo, useCallback, useEffect, useState } from 'react';
import { useCanSync } from '@biscuits/client';

export const CategoryClaim = memo(function CategoryClaim({
  category,
}: {
  category: Category;
}) {
  const { isMyClaim, claimer } = useCategoryClaimPresence(category);
  const me = hooks.useSelf();
  const isSubscribed = useCanSync();

  const claim = useCallback(() => {
    if (isMyClaim) {
      category.set('claim', null);
    } else {
      category.set('claim', {
        claimedBy: me.id,
        claimedAt: Date.now(),
      });
    }
  }, [me.id, isMyClaim, category]);

  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    if (claimer) {
      setShowTooltip(true);
    }
  }, [claimer]);
  useEffect(() => {
    if (showTooltip) {
      const timeout = setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showTooltip]);

  const presences = hooks.useFindPeers(
    (peer) =>
      !!peer.presence?.lastInteractedCategory &&
      peer.presence?.lastInteractedCategory === category?.get('id'),
  );

  if (!isSubscribed) {
    return null;
  }

  const people = [...presences];
  if (claimer && !people.some((p) => p.id === claimer?.id)) {
    people.push(claimer);
  }

  const peopleCount = Math.max(1, people.length);

  return (
    <Button color="ghost" size="small" className="p-2px h-30px" onClick={claim}>
      <PeopleList count={peopleCount} size={18}>
        {people.map((person, index) => (
          <PeopleListAvatar
            key={person.id}
            index={index}
            person={person}
            popIn
          />
        ))}
        {!people.length && (
          <PeopleListAvatar
            index={0}
            person={null}
            popIn
            className="opacity-50"
          />
        )}
      </PeopleList>
    </Button>
  );
});
