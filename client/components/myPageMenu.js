// <------  사용하시기 전에 꼭 읽어주세요! ------>
// ToDo 1. 버튼을 클릭했을 때의 Click Event를 onClick={}으로 넣어주셔야 합니다.
// ToDo 2. 버튼의 이름을 buttonName으로 넣어주셔야 합니다.

// <예시> 아래의 코드를 주석 해제하고 중괄호를 제거한 뒤 사용해보세요

{
  /* <WantedHabit
  onClick={() => console.log('버튼의 클릭이벤트로 전해지는 함수')}
/> */
}

// <------  사용하시기 전에 꼭 읽어주세요! ------>

import { SlArrowRight } from 'react-icons/sl';

export const MyPageMenuList = (props) => {
  const MyPageUserInfo = (props) => {
    return (
      <div>
        <div className="w-80 cursor-pointer" onClick={props.onClick}>
          <div className="p-2 font-bold  w-full only:flex place-content-between border-x-2 border-t-2 border-black dark:text-white dark:border-white">
            회원 정보 수정
            <div className="pr-5">
              <SlArrowRight className="inline align-middle dark:bg-white" />
            </div>
          </div>
        </div>
        <div className="w-80 cursor-pointer" onClick={props.onClick}>
          <div className="p-2 font-bold  w-full only:flex place-content-between border-x-2 border-t-2 border-black dark:text-white dark:border-white">
            로그아웃
            <div className="pr-5">
              <SlArrowRight className="inline align-middle dark:bg-white" />
            </div>
          </div>
        </div>
        <div className="w-80 cursor-pointer" onClick={props.onClick}>
          <div className="p-2 font-bold  w-full only:flex place-content-between border-x-2 border-t-2 border-black dark:text-white dark:border-white">
            회원탈퇴
            <div className="pr-5">
              <SlArrowRight className="inline align-middle dark:bg-white" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="w-80 cursor-pointer" onClick={props.onClick}>
        <div className="p-2 font-bold  w-full only:flex place-content-between border-x-2 border-t-2 border-black dark:text-white dark:border-white">
          찜한 습관
          <div className="pr-5">
            <SlArrowRight className="inline align-middle dark:bg-white" />
          </div>
        </div>
      </div>
      <div className="w-80 cursor-pointer" onClick={props.onClick}>
        <div className="p-2 font-bold  w-full only:flex place-content-between border-x-2 border-t-2 border-black dark:text-white dark:border-white">
          내가 만든 습관
          <div className="pr-5">
            <SlArrowRight className="inline align-middle dark:bg-white" />
          </div>
        </div>
      </div>
      <div className="w-80 cursor-pointer" onClick={props.onClick}>
        <div className="p-2 font-bold  w-full only:flex place-content-between border-x-2 border-t-2 border-black dark:text-white dark:border-white">
          인증서 발급
          <div className="pr-5">
            <SlArrowRight className="inline align-middle dark:bg-white" />
          </div>
        </div>
      </div>
      <div className="w-80 cursor-pointer" onClick={props.onClick}>
        <div className="p-2 font-bold  w-full only:flex place-content-between border-x-2 border-t-2 border-black dark:text-white dark:border-white">
          친구 초대
          <div className="pr-5">
            <SlArrowRight className="inline align-middle dark:bg-white" />
          </div>
        </div>
      </div>
      <div className="w-80 cursor-pointer" onClick={props.onClick}>
        <div className="p-2 font-bold  w-full only:flex place-content-between border-x-2 border-t-2 border-black dark:text-white dark:border-white">
          고객센터
          <div className="pr-5">
            <SlArrowRight className="inline align-middle dark:bg-white" />
          </div>
        </div>
      </div>

      <MyPageUserInfo />
    </div>
  );
};
