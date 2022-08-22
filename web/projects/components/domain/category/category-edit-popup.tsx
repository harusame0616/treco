import { Box, Dialog, IconButton, Input, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { CategoryDto } from '../../../contexts/record/domains/category/category';
import BaseCard from '../../base/base-card';
import PrimaryButton from '../../case/primary-button';
import SecondaryButton from '../../case/secondary-button';
import SectionContainer from '../../container/section-container';
import TrainingMark from '../training-mark';

export type CategoryEditInfo = Omit<Omit<CategoryDto, 'categoryId'>, 'userId'>;

interface Prop {
  open: boolean;
  onPirmaryClick: (
    data: CategoryEditInfo,
    reset: () => void
  ) => Promise<void> | void;
  onSecondaryClick: (
    data: CategoryEditInfo,
    reset: () => void
  ) => Promise<void> | void;
}

const DEFAULT_COLOR = '#ffffff';
const DEFAULT_CATEGORY_NAME = '';
const CategoryEditPopup = (prop: Prop) => {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [categoryName, setCategoryName] = useState(DEFAULT_CATEGORY_NAME);

  const colorInputRef = useRef<HTMLInputElement>(null);
  const category = { categoryName, color };

  const reset = () => {
    setCategoryName(DEFAULT_CATEGORY_NAME);
    setColor(DEFAULT_COLOR);
  };

  return (
    <Dialog open={prop.open}>
      <BaseCard>
        <SectionContainer>
          <Box>カテゴリ作成</Box>
          <Box></Box>
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={() => {
                // PCだとclick、スマホだとfocusでカラーピッカーが表示される
                colorInputRef.current?.click();
                colorInputRef.current?.focus();
              }}
            >
              <TrainingMark color={color} size="3rem" />
            </IconButton>
            <Input
              inputRef={colorInputRef}
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              sx={{
                width: '0px',
                height: '0px',
                opacity: '0',
              }}
            />
            <TextField
              autoFocus
              variant="filled"
              size="small"
              sx={{ background: '#ddd' }}
              value={categoryName}
              label="カテゴリ名"
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Box>
        </SectionContainer>
        <SectionContainer>
          <Box display="flex" flexDirection="column" gap="10px">
            <SecondaryButton
              onClick={() => prop.onSecondaryClick(category, reset)}
            >
              破棄する
            </SecondaryButton>
            <PrimaryButton onClick={() => prop.onPirmaryClick(category, reset)}>
              作成する
            </PrimaryButton>
          </Box>
        </SectionContainer>
      </BaseCard>
    </Dialog>
  );
};

export default CategoryEditPopup;
