import BaseErrorTemplate from '@Components/base/base-error-template';

const AuthErrorTemplate = () => {
  return (
    <BaseErrorTemplate title="認証エラー">認証が必要です。</BaseErrorTemplate>
  );
};

export default AuthErrorTemplate;
