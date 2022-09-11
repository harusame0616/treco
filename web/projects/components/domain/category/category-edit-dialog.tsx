import { Box, IconButton, Input, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { CategoryDto } from '../../../contexts/record/domains/category/category';
import BaseDialog from '../../base/base-dialog';
import BaseDialogTitle from '../../base/base-dialog-title';
import TrainingMark from '../training-mark';

export type CategoryEditInfo = Omit<
  CategoryDto,
  'categoryId' | 'userId' | 'order'
>;

interface Prop {
  open: boolean;
  category?: CategoryDto;
  onPirmaryClick: (
    data: CategoryEditInfo,
    reset: () => void
  ) => Promise<void> | void;
  onSecondaryClick: (
    data: CategoryEditInfo,
    reset: () => void
  ) => Promise<void> | void;
  onError: (error: Error) => void;
  isLoading?: boolean;
}

const DEFAULT_COLOR = '#ffffff';
const DEFAULT_NAME = '';

const CategoryEditPopup = (prop: Prop) => {
  const [color, setColor] = useState(prop.category?.color ?? DEFAULT_COLOR);
  const [categoryName, setCategoryName] = useState(
    prop.category?.categoryName ?? DEFAULT_NAME
  );

  const colorInputRef = useRef<HTMLInputElement>(null);
  const category = { categoryName, color };

  const reset = () => {
    setCategoryName(prop.category?.categoryName ?? DEFAULT_NAME);
    setColor(prop.category?.color ?? DEFAULT_COLOR);
  };

  useEffect(() => {
    setColor(prop.category?.color ?? DEFAULT_COLOR);
    setCategoryName(prop.category?.categoryName ?? DEFAULT_NAME);
  }, [prop.category]);

  return (
    <BaseDialog
      open={prop.open}
      onSecondaryClick={() => prop.onSecondaryClick(category, reset)}
      onPrimaryClick={() => prop.onPirmaryClick(category, reset)}
      primaryLabel="作成する"
      isLoading={prop.isLoading}
    >
      <BaseDialogTitle>カテゴリ作成</BaseDialogTitle>
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
          disabled={prop.isLoading}
        />
        <TextField
          autoFocus
          variant="filled"
          size="small"
          sx={{ background: '#ddd' }}
          value={categoryName}
          label="カテゴリ名"
          onChange={(e) => setCategoryName(e.target.value)}
          fullWidth
          disabled={prop.isLoading}
        />
      </Box>
    </BaseDialog>
  );
};

export default CategoryEditPopup;
