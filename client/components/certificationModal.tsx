import React from 'react';

export const CertificationModal = ({ data }) => {
  console.log(data);
  const today = new Date();
  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1; // 월
  let date = today.getDate(); // 날짜

  return (
    <div className="w-full h-full flex-columns text-center p-2.5 mt-2.5 border-black border rounded-2xl">
      <img
        src="../image/prizeborder.jpg"
        className="bg-cover bg-no-repeat inline-block my-3"
        alt="prizetemplit"
        width={300}
      />

      <div className="absolute left-[1%] top-[25%] w-full flex-col">
        <h2 className="text-base font-bold mb-6">인증서</h2>
        <div className="mb-6 text-[10px]">
          <div>
            성공한 습관:{' '}
            <span className="text-footerMemberTextColor">{data.title}</span>
          </div>

          <div>
            시작일자:{' '}
            <span className="text-footerMemberTextColor">
              {data.createdAt.substr(0, 4)}년 {data.createdAt.substr(5, 2)}월{' '}
              {data.createdAt.substr(8, 2)}일
            </span>
          </div>
          <div>
            성공일자:{' '}
            <span className="text-footerMemberTextColor">
              {data.completedAt.substr(0, 4)}년 {data.completedAt.substr(5, 2)}
              월 {data.completedAt.substr(8, 2)}일
            </span>
          </div>
        </div>

        <div className="mb-4 text-[13px]">
          <span className="text-footerMemberTextColor">{data.username}</span>{' '}
          님은
          <p>성공적으로 습관 체득에 성공하셨음을</p>
          <p>66 Challenge에서 인증합니다.</p>
        </div>

        <div className="flex justify-center mb-2">
          <img
            src="../image/logo/LogoVertical.svg"
            alt="66ChagllengeLogo"
            width={100}
          />
        </div>
        <p>
          {year}년 {month}월 {date}일
        </p>
      </div>
    </div>
  );
};
