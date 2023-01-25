import React from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../ducks/store';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { getUserInfo } from '../../../module/userFunctionMoudules';
import { MyPageMenuList } from '../../../components/myPageMenuList';

const MyPage = () => {
  const userId = useAppSelector((state) => state.loginIdentity.userId);
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getUserInfo({ userId }).then((data) => {
      if (data) {
        setUserInfo(data);
      } else {
        router.push('/user/login');
      }
    });
  }, []);

  const handleHabitDetail = (id: number): void => {
    router.push(`/habit/detail/${id}`);
  };

  const ProgressBar = styled.div`
    width: ${(props) => `${props.width}%`};
  `;

  const Profile = () => {
    return (
      <div className="flex flex-row items-center justify-center solid border-b-black border-b border-t-black border-t">
        <div className="absolute left-0 ml-10 w-16 h-16 rounded-full border">
          {' '}
          {/* TODO : 프로필 사진 추가 */}
          <img
            src="https://s3.ap-northeast-2.amazonaws.com/challenge66.file.bucket/images/3cb6c7f7-8af9-4957-92d4-eb46785277de.jpeg"
            className="w-full h-full rounded-full"
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="mt-2 text-[0.6rem] text-right">
            반가워요!{' '}
            <span className="text-green-600 text-[0.8rem]">
              {userInfo.biggestProgressDays}
            </span>
            일째 개근중인
          </div>
          <div className="text-2xl">{userInfo.username} 님</div>
          <div className="text-[0.7rem] text-gray-400 mb-2 ">
            Email : {userInfo.email}
          </div>
        </div>
      </div>
    );
  };

  const ActiveChallenges = () => {
    return (
      <div className="border mx-1 pb-1 mt-2 mb-2 solid border-black rounded-xl">
        <div className="mt-2 ml-4 mb-1 font-semibold w-max border-y border-gray-400 ">
          나의 습관 진행현황
        </div>
        <div className=" mx-2 h-12 rounded-xl flex flex-nowrap overflow-x-auto">
          {userInfo.activeChallenges.map((e) => {
            const progress = Math.ceil((e.authDays / 66) * 100);
            return (
              <button
                onClick={() => handleHabitDetail(e.challengeId)}
                className="h-[36px] mx-2 rounded-xl my-1 w-36 shrink-0 border p-px border-mainColor flex items-center justify-center max-h-min bg-white relative overflow-hidden z-20"
              >
                <ProgressBar
                  className={`absolute h-[34px] ${
                    progress <= 10
                      ? 'bg-red-700'
                      : progress <= 20
                      ? 'bg-red-500'
                      : progress <= 30
                      ? 'bg-orange-600'
                      : progress <= 40
                      ? 'bg-orange-400'
                      : progress <= 50
                      ? 'bg-yellow-500'
                      : progress <= 60
                      ? 'bg-yellow-400'
                      : progress <= 70
                      ? 'bg-green-500'
                      : progress <= 80
                      ? 'bg-green-600'
                      : progress <= 90
                      ? 'bg-green-700'
                      : 'bg-green-800'
                  }  rounded-r-xl left-0 animate-gage z-10 anim`}
                  width={progress}
                ></ProgressBar>
                <div className="z-30">
                  <span className="text-center ">
                    {e.habitSubTitle}
                    <span className="text-xs">{` (${e.authDays}/66)`}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <>
      {userInfo && (
        <main className="flex flex-col items-stretch">
          <Profile />
          <ActiveChallenges />
          <MyPageMenuList email={userInfo.email} />
        </main>
      )}
    </>
  );
};

export default MyPage;