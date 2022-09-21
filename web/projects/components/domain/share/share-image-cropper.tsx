import CenteredProgress from '@Components/case/centered-progress';
import PrimaryButton from '@Components/case/primary-button';
import useProcessing from '@Hooks/useProcessing';
import { Box } from '@mui/material';
import { MouseEventHandler, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

interface Prop {
  src: string;
  onOk: (imageDataUrl: string) => void | Promise<void>;
}

const ShareImageCropper = (prop: Prop) => {
  const [zoom, setZoom] = useState(1);
  const [croppedInfo, setCroppedInfo] = useState<Area | undefined>();
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });
  const { isProcessing, startProcessing } = useProcessing();

  const okHandler: MouseEventHandler<Element> = async () => {
    if (!croppedInfo) {
      return;
    }
    const workCanvas = document.createElement('canvas');
    workCanvas.width = croppedInfo.width;
    workCanvas.height = croppedInfo.height;
    const context = workCanvas.getContext('2d');

    if (!context) {
      throw new Error();
    }

    const src = new Image();
    src.src = prop.src;
    context.drawImage(
      src,
      croppedInfo.x,
      croppedInfo.y,
      croppedInfo.width,
      croppedInfo.height,
      0,
      0,
      croppedInfo.width,
      croppedInfo.height
    );

    prop.onOk(workCanvas.toDataURL('image/png'));
  };

  return (
    <Box>
      <Box
        position="relative"
        overflow="hidden"
        width="100vw"
        height="100vw"
        sx={{
          backgroundImage:
            'linear-gradient(0deg, transparent calc(100% - 1px), #444 calc(100% - 1px)), linear-gradient(90deg, transparent calc(100% - 1px), #444 calc(100% - 1px))',
          backgroundSize: '32px 32px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center center',
        }}
      >
        {isProcessing ? (
          <CenteredProgress />
        ) : (
          <Cropper
            image={prop.src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixel) => {
              setCroppedInfo(areaPixel);
            }}
            objectFit={'vertical-cover'}
            cropSize={{ width: window.innerWidth, height: window.innerWidth }}
          />
        )}
      </Box>
      <PrimaryButton onClick={okHandler}>
        背景を決定してプレビュー
      </PrimaryButton>
    </Box>
  );
};

export default ShareImageCropper;
