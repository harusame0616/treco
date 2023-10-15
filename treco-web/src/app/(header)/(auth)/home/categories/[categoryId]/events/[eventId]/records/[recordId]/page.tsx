import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PrismaTrainingRecordQuery } from "@/domains/training-record/infrastructures/prisma.query";
import { TrainingRecordQueryOneForTrainingRecordEditUsecase } from "@/domains/training-record/usecases/query-one-for-training-record-edit.usecase";
import { getSignedInTraineeId } from "@/lib/trainee";
import { TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { addSetAction, editSetAction } from "./actions";
import { CancelButton } from "./cancel-button";
import { SubmitButton } from "./submit-button";

async function queryTrainingRecordEdit(trainingRecordId: string) {
  const queryUsecase = new TrainingRecordQueryOneForTrainingRecordEditUsecase(
    new PrismaTrainingRecordQuery(),
  );

  return await queryUsecase.execute(trainingRecordId);
}

type Props = {
  params: {
    categoryId: string;
    eventId: string;
    recordId: string;
  };
  searchParams: {
    edit?: string;
  };
};

export default async function TrainingRecordEditPage({
  params,
  searchParams,
}: Props) {
  const signedInTraineeId = await getSignedInTraineeId();
  const { sets, trainingCategory, trainingEvent } =
    await queryTrainingRecordEdit(params.recordId);
  const activeSetIndex = searchParams.edit
    ? parseInt(searchParams.edit, 10)
    : null;

  const {
    load: loadDefaultValue,
    note: noteDefaultValue,
    value: valueDefaultValue,
  } = activeSetIndex != null
    ? sets[activeSetIndex]
    : { load: "", note: "", value: "" };

  const isEditing = activeSetIndex != null;

  return (
    <div className="w-full flex flex-col h-full">
      <div className="w-full px-4 shrink-0">
        <span className="mr-2" style={{ color: trainingCategory.color }}>
          ●
        </span>
        <span>{trainingCategory.name}</span>
        <span className="mx-2">&gt;</span>
        <span>{trainingEvent.name}</span>
      </div>
      <div className="flex top-11 p-2 shrink-0 text-xs text-muted-foreground">
        <div className="w-12">セット</div>
        <div className="w-12 ml-1">負荷</div>
        <div className="w-10 ml-4">値</div>
        <div className="flex-grow">備考</div>
      </div>
      <div className="bg-muted px-4 h-full overflow-y-scroll py-4">
        {sets.length ? (
          <ul className="">
            {sets.map(({ load, note, value }, index) => (
              <li
                className="flex border-b border-b-muted-foreground border-solid last:border-b-0 h-16"
                key={index}
              >
                <Link
                  className={`flex w-full no-underline text-foreground ${
                    activeSetIndex === index
                      ? "text-primary rounded-sm font-bold important"
                      : ""
                  }`}
                  href={`/home/categories/${params.categoryId}/events/${params.eventId}/records/${params.recordId}?edit=${index}`}
                >
                  <div
                    className={`w-4 text-xs flex justify-end items-center  mr-1 ${
                      activeSetIndex === index
                        ? "text-primary text-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="w-12 flex items-center justify-end mr-1">
                    {load}
                  </div>
                  <div className="w-12 flex items-center justify-end mr-8">
                    {value}
                  </div>
                  <div className="flex items-center grow">
                    <div className="w-12 flex-grow text-xs whitespace-pre p-3 max-h-10 overflow-y-auto">
                      {note || "-"}
                    </div>
                  </div>
                </Link>
                <div className="flex items-center">
                  <Button size="icon" variant="ghost">
                    <TrashIcon />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="break-word">
            <span className="block">まだ記録がありません。</span>
            <span className="block">
              下部のフォームから記録を追加してください。
            </span>
          </p>
        )}
      </div>
      <form
        action={isEditing ? editSetAction : addSetAction}
        className="shrink-0 p-4 gap-1 flex flex-col"
      >
        <input
          name="trainingCategoryId"
          type="hidden"
          value={params.categoryId}
        />
        <input name="trainingEventId" type="hidden" value={params.eventId} />
        <input name="trainingRecordId" type="hidden" value={params.recordId} />
        <input name="traineeId" type="hidden" value={signedInTraineeId} />
        {isEditing && (
          <input name="index" type="hidden" value={activeSetIndex} />
        )}
        <div className="flex gap-4">
          <label className="flex items-center">
            <div className="mr-2 shrink-0">負荷</div>
            <Input
              autoFocus
              defaultValue={loadDefaultValue}
              inputMode="decimal"
              name="load"
              required
              step="0.01"
              type="number"
            />
          </label>
          <label className="flex items-center">
            <div className="mr-2 shrink-0">値</div>
            <Input
              defaultValue={valueDefaultValue}
              inputMode="decimal"
              name="value"
              required
              step="0.01"
              type="number"
            />
          </label>
        </div>
        <label className="flex">
          <div className="shrink-0 mr-2">備考</div>
          <Textarea
            className="grow h-1"
            defaultValue={noteDefaultValue}
            name="note"
          />
        </label>
        <div className="flex justify-end gap-2">
          {isEditing && <CancelButton />}
          <SubmitButton>{isEditing ? "変更する" : "追加する"}</SubmitButton>
        </div>
      </form>
    </div>
  );
}
