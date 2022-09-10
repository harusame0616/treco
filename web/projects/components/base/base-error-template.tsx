import PageContainer from '@Components/container/page-container';
import SectionContainer from '@Components/container/section-container';
import { ErrorRounded } from '@mui/icons-material';
import { Box } from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Prop {
  title: string;
  children: ReactNode;
}

const BaseErrorTemplate = (prop: Prop) => {
  return (
    <PageContainer>
      <SectionContainer>
        <Box
          display="flex"
          alignItems="center"
          sx={{ fontSize: '2rem', color: 'red' }}
          gap="5px"
        >
          <ErrorRounded sx={{ fontSize: '2.5rem' }} />
          {prop.title}
        </Box>
      </SectionContainer>
      <SectionContainer>{prop.children}</SectionContainer>
      <SectionContainer>
        <Link href="/home" passHref>
          <a>トップページへ戻る </a>
        </Link>
      </SectionContainer>
    </PageContainer>
  );
};

export default BaseErrorTemplate;
