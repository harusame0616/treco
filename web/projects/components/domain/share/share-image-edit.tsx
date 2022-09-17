import PrimaryButton from '@Components/case/primary-button';
import ReadErrorTemplate from '@Components/case/read-error-template';
import { Box } from '@mui/material';
import { ActivityQueryDetail } from '@Usecases/activity-query-usecase';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Image, Label, Layer, Stage, Tag, Text } from 'react-konva';

interface Prop {
  src: string;
  activities?: ActivityQueryDetail[];
  onOk: (blob: Blob) => void;
}

const BASE_SIZE = 1080;
const PADDING_SIZE = 20;
const FONT_SIZE = 35;
const LINE_HEIGHT = 1.5;

const LOGO_WIDTH = 140;
const LOGO_HEIGHT = 40;

const MARGIN = 20;

const ShareImageEdit = (prop: Prop) => {
  const [displayWidth, setDisplayWidth] = useState(window.innerWidth);
  const backImage = new window.Image();
  backImage.src = prop.src;
  const logoImage = new window.Image();
  logoImage.src = '/logo2.svg';
  const scale = displayWidth / BASE_SIZE;
  const stageRef = useRef<Konva.Stage>(null!);

  useEffect(() => {
    const updateWidth = () => {
      setDisplayWidth(window.innerWidth);
    };
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  });

  if (prop.activities == null) {
    return <ReadErrorTemplate />;
  }

  const trainingLabels = prop.activities.map(
    (activity) =>
      `${activity.trainingEventName} : T.${activity.totalLoad}${activity.loadUnit}  ${activity.maxRM}${activity.loadUnit}/RM`
  );

  return (
    <Box>
      <Stage width={displayWidth} height={displayWidth} ref={stageRef}>
        <Layer>
          <Image image={backImage} width={displayWidth} height={displayWidth} />
        </Layer>
        <Layer
          draggable={true}
          y={
            displayWidth -
            (PADDING_SIZE * 2 * scale + // padding
              FONT_SIZE * scale * LINE_HEIGHT * trainingLabels?.length + // rows
              MARGIN * scale) // margin
          }
          x={MARGIN * scale}
        >
          <Label>
            <Tag
              fill={'#aaa'}
              shadowEnabled={true}
              shadowColor={'#000'}
              shadowOffsetX={1 * scale}
              shadowOffsetY={1 * scale}
              shadowBlur={4 * scale}
              opacity={0.3}
              cornerRadius={10 * scale}
            />
            <Text
              text={trainingLabels.join('\n')}
              lineHeight={LINE_HEIGHT}
              padding={PADDING_SIZE * scale}
              stroke={'#fff'}
              fill={'#fff'}
              shadowEnabled={true}
              shadowColor={'#000'}
              shadowOffsetX={1 * scale}
              shadowOffsetY={1 * scale}
              shadowBlur={4 * scale}
              strokeWidth={1 * scale}
              fontSize={FONT_SIZE * scale}
              fontFamily={'"M PLUS Rounded 1c"'}
            ></Text>
          </Label>
        </Layer>
        <Layer>
          <Image
            image={logoImage}
            width={LOGO_WIDTH * 2 * scale}
            height={LOGO_HEIGHT * 2 * scale}
            x={displayWidth - LOGO_WIDTH * 2 * scale - 10 * scale}
            y={displayWidth - (LOGO_HEIGHT + 55) * scale}
            shadowEnabled={true}
            shadowColor={'#000'}
            shadowOffsetX={1 * scale}
            shadowOffsetY={1 * scale}
            shadowBlur={5 * scale}
            opacity={0.8}
          />
        </Layer>
      </Stage>
      <PrimaryButton
        onClick={async () => {
          prop.onOk(
            await new Promise((resolve) => {
              stageRef.current.toBlob({
                mimeType: 'image/png',
                callback: resolve,
              });
            })
          );
        }}
      >
        シェア先を選択する
      </PrimaryButton>
    </Box>
  );
};

export default ShareImageEdit;
