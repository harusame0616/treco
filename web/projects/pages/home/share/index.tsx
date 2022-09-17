import PageContainer from '@Components/container/page-container';
import ShareImageCropper from '@Components/domain/share/share-image-cropper';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { PageInjection } from '@/pages/_app';
import CenteredProgress from '@Components/case/centered-progress';
import ReadErrorTemplate from '@Components/case/read-error-template';
import TextButton from '@Components/case/text-button';
import useActivities from '@Hooks/activity/useActivities';
import { Blob } from 'buffer';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
const ShareImageEdit = dynamic(
  () => import('../../../components/domain/share/share-image-edit'),
  {
    ssr: false,
  }
);

const ShareIndex: NextPage<PageInjection> = ({ auth, pageTitle }) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [status, setStatus] = useState('select');
  const router = useRouter();
  const date = new Date(router.query.date as string);

  const { activities, isLoading, isError } = useActivities({
    date,
    userId: auth.auth.authId,
  });

  useEffect(() => {
    pageTitle.setTitle('シェア');
  }, []);

  if (isLoading) {
    return <CenteredProgress />;
  }
  if (isError) {
    return <ReadErrorTemplate />;
  }

  if (navigator.share == null) {
    router.push('/home');
  }
  const reselect = () => {
    setStatus('select');
  };

  const shareActivities = async (blob: Blob) => {
    const title = 'TRECo - BESIDE YOUR WORKOUT-';
    const url = `${location.protocol}//${location.hostname}/`;

    await navigator.share({
      title,
      url: url,
      text: 'test, #treco.fit',
      files: [
        new File([blob as any], `treco-${new Date().getTime()}.png`, {
          type: blob.type,
        }),
      ],
    });
  };

  return (
    <PageContainer>
      <Box marginTop="-20px" marginX="-20px">
        {status == 'edit' && selectedImage ? (
          <ShareImageEdit
            src={selectedImage}
            activities={activities}
            onOk={shareActivities}
          />
        ) : (
          <ShareImageCropper
            src={selectedImage}
            onOk={(x) => {
              setStatus('edit');
              setSelectedImage(x);
            }}
          />
        )}
      </Box>
      {status == 'edit' ? (
        <TextButton onClick={reselect}>画像選び直す</TextButton>
      ) : (
        <TextButton onClick={() => router.push(`/home?${router.query.date}`)}>
          シェアをキャンセルする
        </TextButton>
      )}
    </PageContainer>
  );
};

export default ShareIndex;
