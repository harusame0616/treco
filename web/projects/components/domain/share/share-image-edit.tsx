import CenteredProgress from '@Components/case/centered-progress';
import PrimaryButton from '@Components/case/primary-button';
import ReadErrorTemplate from '@Components/case/read-error-template';
import TextButton from '@Components/case/text-button';
import { Box } from '@mui/material';
import { ActivityQueryDetail } from '@Usecases/activity-query-usecase';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Image, Label, Layer, Stage, Tag, Text } from 'react-konva';

interface Prop {
  src: string;
  activities?: ActivityQueryDetail[];
  onOk: (blob: Blob) => void;
  onCancel: () => void;
}

const BASE_SIZE = 1080;
const PADDING_SIZE = 20;
const FONT_SIZE = 35;
const LINE_HEIGHT = 1.5;

const LOGO_WIDTH = 140;
const LOGO_HEIGHT = 40;

const MARGIN = 20;

const ShareImageEdit = (prop: Prop) => {
  const backImage = new window.Image();
  backImage.src = prop.src;
  const logoImage = new window.Image();
  logoImage.src = '/logo2.svg';
  const stageRef = useRef<Konva.Stage>(null!);
  const backImageRef = useRef<Konva.Image>(null!);
  const logoImageRef = useRef<Konva.Image>(null!);
  const trainingTextRef = useRef<Konva.Text>(null!);
  const trainingTextBackRef = useRef<Konva.Tag>(null!);
  const trainingTextLayerRef = useRef<Konva.Layer>(null!);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      scalize(window.innerWidth / BASE_SIZE);
    };
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  });

  useEffect(() => {
    scalize(window.innerWidth / BASE_SIZE);
  }, []);

  if (prop.activities == null) {
    return <ReadErrorTemplate />;
  }

  const trainingLabels = prop.activities.map(
    (activity) =>
      `${activity.trainingEventName} : T.${activity.totalLoad}${activity.loadUnit}  ${activity.maxRM}${activity.loadUnit}/RM`
  );

  const scalize = (scale: number) => {
    stageRef.current.width(BASE_SIZE * scale);
    stageRef.current.height(BASE_SIZE * scale);
    stageRef.current.x(0);
    stageRef.current.y(0);
    backImageRef.current.width(BASE_SIZE * scale);
    backImageRef.current.height(BASE_SIZE * scale);
    backImageRef.current.x(0);
    backImageRef.current.y(0);

    trainingTextLayerRef.current.y(
      BASE_SIZE * scale -
        (PADDING_SIZE * 2 * scale + // padding
          FONT_SIZE * scale * LINE_HEIGHT * trainingLabels?.length + // rows
          MARGIN * scale) // margin
    );
    trainingTextLayerRef.current.x(MARGIN * scale);

    trainingTextBackRef.current.fill('#aaa');
    trainingTextBackRef.current.shadowOffsetX(1 * scale);
    trainingTextBackRef.current.shadowOffsetY(1 * scale);
    trainingTextBackRef.current.shadowBlur(4 * scale);
    trainingTextBackRef.current.cornerRadius(10 * scale);

    trainingTextRef.current.padding(PADDING_SIZE * scale);
    trainingTextRef.current.x(PADDING_SIZE * scale);
    trainingTextRef.current.y(PADDING_SIZE * scale);
    trainingTextRef.current.shadowOffsetX(scale);
    trainingTextRef.current.shadowOffsetY(scale);
    trainingTextRef.current.shadowBlur(4 * scale);
    trainingTextRef.current.strokeWidth(scale);
    trainingTextRef.current.fontSize(FONT_SIZE * scale);

    logoImageRef.current.width(LOGO_WIDTH * 2 * scale);
    logoImageRef.current.height(LOGO_HEIGHT * 2 * scale);
    logoImageRef.current.x(
      BASE_SIZE * scale - LOGO_WIDTH * 2 * scale - 10 * scale
    );
    logoImageRef.current.y(BASE_SIZE * scale - (LOGO_HEIGHT + 55) * scale);
    logoImageRef.current.shadowOffsetX(scale);
    logoImageRef.current.shadowOffsetY(scale);
    logoImageRef.current.shadowBlur(5 * scale);
  };

  return (
    <Box>
      {isShared ? (
        <Box width="100vw" height="100vw">
          <CenteredProgress />
        </Box>
      ) : undefined}
      <Box
        sx={{
          visibility: isShared ? 'hidden' : 'visible',
          transform: isShared ? 'scale(0)' : 'scale(1)',
          position: isShared ? 'absolute' : 'relative',
        }}
      >
        <Stage
          width={window.innerWidth}
          height={window.innerWidth}
          ref={stageRef}
        >
          <Layer>
            <Image image={backImage} ref={backImageRef} />
          </Layer>
          <Layer draggable={true} ref={trainingTextLayerRef}>
            <Label>
              <Tag
                fill={'#aaa'}
                shadowEnabled={true}
                shadowColor={'#000'}
                opacity={0.3}
                ref={trainingTextBackRef}
              />
              <Text
                text={trainingLabels.join('\n')}
                lineHeight={LINE_HEIGHT}
                stroke={'#fff'}
                fill={'#fff'}
                shadowEnabled={true}
                shadowColor={'#000'}
                fontFamily={'"M PLUS Rounded 1c"'}
                ref={trainingTextRef}
              ></Text>
            </Label>
          </Layer>
          <Layer>
            <Image
              image={logoImage}
              shadowEnabled={true}
              shadowColor={'#000'}
              opacity={0.8}
              ref={logoImageRef}
            />
          </Layer>
        </Stage>
        <PrimaryButton
          isLoading={isShared}
          onClick={async () => {
            setIsShared(true);
            scalize(1);
            prop.onOk(
              await new Promise((resolve) => {
                stageRef.current.toBlob({
                  mimeType: 'image/jpeg',
                  callback: resolve,
                  quality: 1,
                });
              })
            );
            setIsShared(false);
            scalize(window.innerWidth / BASE_SIZE);
          }}
        >
          シェア先を選択してシェア
        </PrimaryButton>
        <TextButton onClick={prop.onCancel}>画像選び直す</TextButton>
      </Box>
    </Box>
  );
};

export default ShareImageEdit;
