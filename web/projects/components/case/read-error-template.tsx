import BaseErrorTemplate from '@Components/base/base-error-template';

const ReadErrorTemplate = () => {
  return (
    <BaseErrorTemplate title="読み込みエラー">
      再読み込みを行うか、トップページからやり直してください。
    </BaseErrorTemplate>
  );
};

export default ReadErrorTemplate;
