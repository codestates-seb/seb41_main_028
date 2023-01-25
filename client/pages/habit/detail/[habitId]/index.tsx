import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { DropDown } from '../../../../components/dropDown';
import { AiFillStar } from 'react-icons/ai';
import { useAppSelector } from '../../../../ducks/store';
import { getHabitDetail } from '../../../../module/habitFunctionMoudules';

interface habitDetailOverview {
  habitId: number;
  title: string;
  body: string;
  thumbImgUrl: string;
  score: number;
}

interface habitDetailDetail {
  hostUserId: number;
  subTitle: string;
  authType: string | null;
  authStartTime: string;
  authEndTime: string;
  challengeStatus: string;
  isBooked: boolean;
}

interface habitDetailImage {
  succImgUrl: string | null;
  failImgUrl: string | null;
}

interface habitDataType {
  overview?: habitDetailOverview;
  detail?: habitDetailDetail;
  image?: habitDetailImage;
}

const HabitDetail: React.FC = () => {
  const router = useRouter();
  const habitId = +router.query.habitId;
  const { userId } = useAppSelector((state) => state.loginIdentity);
  const [habitData, setHabitData] = useState<habitDataType>({});
  useEffect(() => {
    console.log(habitId);
    getHabitDetail({ userId, habitId }).then((data) => {
      setHabitData(data);
    });
  }, []);
  console.log(habitId);

  return (
    <div className="habit-detail-container">
      <div className="habit-detail-top">
        <div className="habit-detail-top-image">
          <Image
            src="/image/running.png"
            alt="habit image"
            width={500}
            height={500}
          />
        </div>
        <div className="habit-detail-top-info p-5 border-b border-borderColor">
          <div className="habit-detail-title-container flex justify-between items-center mb-2 pt-5">
            <h2 className="habit-detail-title text-2xl font-bold">
              {habitData?.overview?.title}
            </h2>
            <DropDown dropDownType="habit" boolean={false} />
          </div>
          <div className="habit-detail-metainfo-container flex items-center gap-2.5">
            <div className="habit-detail-postuser">{`게시한 유저 이름`}</div>
            <div className="habit-detail-score-container flex items-center gap-1">
              <AiFillStar className="text-subColor" />
              <span className="text-sm ">{habitData?.overview?.score}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="habit-detail-middle p-5 border-b border-borderColor">
        <div className="habit-detail-body">
          <h3 className="text-lg font-semibold pb-5">상세내용</h3>
          <p className="pb-2.5">{habitData?.overview?.body}</p>
        </div>
      </div>
      <div className="habit-detail-bottom p-5">
        <h3 className="text-lg font-semibold pb-5">인증방법</h3>
        <p className="pb-2.5">
          인증 가능한 시간대는 매일&nbsp;
          <span className="text-subColor font-bold">
            {habitData?.detail?.authStartTime}
          </span>
          부터{' '}
          <span className="text-subColor font-bold">
            {habitData?.detail?.authEndTime}
          </span>
          까지 입니다.
        </p>
        <p>인증 사진의 올바른 예와 잘못된 예는 아래와 같습니다.</p>
        <div className="pt-5 flex gap-5">
          <div className="flex flex-col">
            <Image
              src={
                habitData?.image
                  ? habitData.image.succImgUrl
                  : `/image/running.png`
              }
              alt="correct auth image"
              width={500}
              height={500}
            />
            <div className="text-center text-green-600 pt-2.5 text-sm font-bold">
              {'올바른 인증사진'}
            </div>
          </div>
          <div className="flex flex-col">
            <Image
              src={
                habitData?.image
                  ? habitData.image.failImgUrl
                  : `/image/running.png`
              }
              alt="incorrect auth image"
              width={500}
              height={500}
            />
            <div className="text-center text-rose-600 pt-2.5 text-sm font-bold">
              {'잘못된 인증사진'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitDetail;