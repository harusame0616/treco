import { Box, Dialog, IconButton, Input, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
  Category,
  CategoryDto,
} from '../../../contexts/record/domains/category/category';
import { ParameterError } from '../../../custom-error/parameter-error';
import BaseCard from '../../base/base-card';
import PrimaryButton from '../../case/primary-button';
import SecondaryButton from '../../case/secondary-button';
import SectionContainer from '../../container/section-container';
import TrainingMark from '../training-mark';

export type CategoryEditInfo = Omit<Omit<CategoryDto, 'categoryId'>, 'userId'>;

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
}

const DEFAULT_COLOR = '#FFFFFF';
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
            <PrimaryButton
              onClick={() => {
                if (!categoryName.length) {
                  prop.onError(new ParameterError('カテゴリ名は必須です。'));
                  return;
                }
                if (categoryName.length > Category.CATEGORY_NAME_MAX_LENGTH) {
                  prop.onError?.(
                    new ParameterError(
                      `カテゴリ名は${Category.CATEGORY_NAME_MAX_LENGTH}文字以内で入力してください`
                    )
                  );
                  return;
                }

                if (!color.length) {
                  prop.onError(new ParameterError(`カラーは必須です。`));
                  return;
                }
                if (!new RegExp(Category.COLOR_PATTERN).test(color)) {
                  prop.onError(
                    new ParameterError(`カラーのフォーマットが不正です。`)
                  );
                  return;
                }

                prop.onPirmaryClick(category, reset);
              }}
            >
              作成する
            </PrimaryButton>
          </Box>
        </SectionContainer>
      </BaseCard>
    </Dialog>
  );
};

export default CategoryEditPopup;
