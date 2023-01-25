import React from 'react';
import { SlArrowRight } from 'react-icons/sl';
import { useState } from 'react';
import Link from 'next/link';
import { Modal } from './modal';
import { CertificationModal } from './certificationModal';
import { useAppDispatch } from '../ducks/store';
import { initLoginIdentity } from '../ducks/loginIdentitySlice';

interface ItemProps {
  title: string;
  path: string;
}

// TODO : 실제 데이터 오면 더미데이터를 바꿔야 함
const testSuccess = [
  { challengeId: 45, progressDays: 2, habitId: 1, subTitle: 'Mr', title: 'aa' },
];

export const MyPageMenuList = ({ email }) => {
  const [isCertActive, setIsCertActive] = useState(false);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [certId, setCertId] = useState(null);
  const dispatch = useAppDispatch();

  const CertDropDown = ({ success }): JSX.Element => {
    return (
      <div className="flex flex-col items-stretch">
        {success.map((el) => {
          return (
            <div
              key={el.challengeId}
              className={`flex place-content-between border solid border-black h-8 items-center mb-1 mx-2 rounded-xl ${
                el.title ? '' : 'justify-center'
              }`}
            >
              <span className={`${el.title ? 'ml-5' : 'text-xl'}`}>
                {el.title || '성공 데이터 없음'}
              </span>
              {el.title ? (
                <button
                  className={`border-2 text-sm mr-4`}
                  onClick={(): void => {
                    setCertId(el.habitId);
                    setIsCertOpen(!isCertOpen);
                  }}
                >
                  발급
                </button>
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const handleDropDown = (): void => {
    setIsCertActive(!isCertActive);
  };

  const handleCertOpen = (id: number): void => {};

  const MenuItem = ({ path, title }: ItemProps): JSX.Element => {
    return (
      <Link
        className="pl-5 cursor-pointer flex place-content-between border-black solid border-2 h-10 text-lg items-center mb-1"
        href={path}
      >
        <span>{title}</span>
        <div className="pr-5 ">
          <SlArrowRight className="inline align-middle dark:bg-white" />
        </div>
      </Link>
    );
  };

  const LogOut = ({ path, title }: ItemProps): JSX.Element => {
    return (
      <Link
        className="pl-5 cursor-pointer flex place-content-between border-black solid border-2 h-10 text-lg items-center mb-1"
        href={path}
        onClick={() => {
          dispatch(initLoginIdentity());
        }}
      >
        <span>{title}</span>
        <div className="pr-5 ">
          <SlArrowRight className="inline align-middle dark:bg-white" />
        </div>
      </Link>
    );
  };
  return (
    <div>
      {isCertOpen && (
        <Modal
          isOpen={isCertOpen}
          setIsOpen={setIsCertOpen}
          buttonName="종료"
          onClick={() => {
            console.log(certId);
          }}
          children={<CertificationModal />}
        />
      )}
      <MenuItem title="찜한 습관" path="/user/mypage/savedhabit" />
      <MenuItem title="내가 만든 습관" path="/user/mypage/madehabit" />
      <div
        className="pl-5 cursor-pointer flex place-content-between border-black solid border-2 h-10 text-lg items-center mb-1"
        onClick={handleDropDown}
      >
        <span>인증서 발급</span>
        <div className="pr-5 ">
          <SlArrowRight className="inline align-middle dark:bg-white" />
        </div>
      </div>
      {isCertActive && <CertDropDown success={testSuccess} />}
      {/* TODO : 친구 초대(SNS기능), 고객센터 추가 */}
      <MenuItem title="친구 초대" path="/user/mypage" />
      <MenuItem title="고객 센터" path="/user/mypage" />
      <MenuItem title="회원 정보 수정" path="/user/mypage/edit" />
      <LogOut title="로그아웃" path="/" />
      <MenuItem
        title="회원탈퇴"
        path={`/user/mypage/withdraw?email=${email}`}
      />
    </div>
  );
};