import { useRouter } from 'next/router';
import ListItemCard from '../../../../components/case/list-item-card';
import SecondaryButton from '../../../../components/case/secondary-button';
import ListContainer from '../../../../components/container/list-container';
import PageContainer from '../../../../components/container/page-container';
import SectionContainer from '../../../../components/container/section-container';
import CategoryLabel from '../../../../components/domain/category-label';
import useEvents from '../../../../hooks/useEvents';

const NewEvent = () => {
  const router = useRouter();
  const categoryId = router.query['categoryId'];

  const { isLoading, events } = useEvents({
    categoryId: typeof categoryId == 'string' ? parseInt(categoryId) : null,
  });

  const goToBack = () => {
    router.push({
      pathname: '/home/activities/new',
      query: router.query,
    });
  };

  const goToNext = async (eventId: number) => {
    await router.push({
      pathname: '/home/activities/new/record',
      query: {
        ...router.query,
        eventId,
      },
    });
  };

  return (
    <PageContainer>
      {isLoading ? (
        <div>now loading</div>
      ) : (
        <>
          <SectionContainer>
            <CategoryLabel color="red">胸</CategoryLabel>
            記録する種目を選択してください。
          </SectionContainer>
          <SectionContainer>
            <ListContainer>
              {events.map((event) => (
                <ListItemCard
                  onClick={() => goToNext(event.eventId)}
                  key={event.eventId}
                >
                  {event.eventName}
                </ListItemCard>
              ))}
            </ListContainer>
          </SectionContainer>
        </>
      )}
      <SectionContainer>
        <SecondaryButton onClick={goToBack}>カテゴリ選択に戻る</SecondaryButton>
      </SectionContainer>
    </PageContainer>
  );
};

export default NewEvent;
