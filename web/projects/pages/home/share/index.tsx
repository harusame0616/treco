import PageContainer from '@Components/container/page-container';
import ShareImageCropper from '@Components/domain/share/share-image-cropper';

import { Box } from '@mui/material';
import { ChangeEventHandler, useEffect, useState } from 'react';

import { PageInjection } from '@/pages/_app';
import CenteredProgress from '@Components/case/centered-progress';
import ReadErrorTemplate from '@Components/case/read-error-template';
import TextButton from '@Components/case/text-button';
import useActivities from '@Hooks/activity/useActivities';
import { Blob } from 'buffer';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import useProcessing from '@Hooks/useProcessing';
const ShareImageEdit = dynamic(
  () => import('../../../components/domain/share/share-image-edit'),
  {
    ssr: false,
  }
);

const PRESET_IMAGE = '/splash_grey.svg';

const ShareIndex: NextPage<PageInjection> = ({ auth, pageTitle }) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [status, setStatus] = useState('select');
  const router = useRouter();
  const date = new Date(router.query.date as string);
  const { isProcessing, startProcessing } = useProcessing();

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
      url,
      files: [
        new File([blob as any], `treco-${new Date().getTime()}.png`, {
          type: blob.type,
        }),
      ],
    });

    await router.push(`/home?date=${router.query.date}`);
  };

  const loadImageHandler: ChangeEventHandler<HTMLInputElement> = async (e) => {
    startProcessing(async () => {
      const file = e?.target?.files?.[0];
      if (!file) {
        return;
      }

      const fileReader = new FileReader();
      const imageDataUrl: string = await new Promise((resolve, inject) => {
        fileReader.onload = () => {
          resolve(fileReader.result as string);
        };
        fileReader.onerror = (e) => {
          inject(e);
        };
        fileReader.readAsDataURL(file);
      });

      setSelectedImage(imageDataUrl);
    });
  };

  return (
    <PageContainer>
      <Box marginTop="-20px" marginX="-20px">
        {status == 'edit' ? (
          <ShareImageEdit
            src={selectedImage ?? PRESET_IMAGE}
            activities={activities}
            onOk={shareActivities}
            onCancel={reselect}
          />
        ) : (
          <ShareImageCropper
            src={selectedImage ?? PRESET_IMAGE}
            onOk={(x) => {
              setStatus('edit');
              if (selectedImage) {
                setSelectedImage(x);
              }
            }}
          />
        )}
      </Box>
      <Box display="flex" flexDirection="column" gap="10px" paddingTop="10px">
        {status == 'select' ? (
          <Box>
            <input type="file" accept="image/*" onChange={loadImageHandler} />
            <TextButton
              onClick={() => router.push(`/home?${router.query.date}`)}
            >
              シェアをキャンセルする
            </TextButton>
          </Box>
        ) : undefined}
      </Box>
    </PageContainer>
  );
};

export default ShareIndex;
