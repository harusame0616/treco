import {
  AccountMenuItem,
  HomeMenuItem,
  NewTrainingRecordMenuItem,
} from './menu-item';

export function MainMenu() {
  return (
    <nav
      aria-label="メインメニュー"
      className="border-t border-t-accent bg-background px-4"
    >
      <ul aria-label="メニュー" className="flex justify-evenly">
        <HomeMenuItem />
        <NewTrainingRecordMenuItem />
        <AccountMenuItem />
      </ul>
    </nav>
  );
}
