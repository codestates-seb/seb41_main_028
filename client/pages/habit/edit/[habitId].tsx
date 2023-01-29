import { useForm } from 'react-hook-form';
import { FileUploader } from '../../../components/fileUploader';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../ducks/store';
import { patchHabitDetail } from '../../../module/habitFunctionMoudules';
import { useRouter } from 'next/router';
import { ReactQuillWrapper } from '../../../module/reactQuill';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getHabitDetail } from '../../../module/habitFunctionMoudules';
import type { HabitFormValues } from '../post';
import type { habitDataType } from '../detail/[habitId]';
import { habitCategoryData } from '../../../data/categoryData';

const EditHabit = () => {
  const { userId } = useAppSelector((state) => state.loginIdentity);
  const { register, handleSubmit, getValues, setFocus, watch, reset } =
    useForm<HabitFormValues>();
  const router = useRouter();
  const habitId = +router.query.habitId;
  const [baseData, setBaseData] = useState<habitDataType>({});

  const [bodyData, setBodyData] = useState<string>('');
  const [bodyHTMLData, setBodyHTMLData] = useState<string>('');
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ['bold', 'underline'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
        { align: [] },
      ],
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'align',
    'indent',
    'color',
  ];
  const bodyDataHandle = (
    value: string,
    editor: ReactQuill.UnprivilegedEditor,
  ) => {
    setBodyHTMLData(value);
    setBodyData(editor.getText());
  };

  const { habitImage, successImage, failImage } = watch();
  const [habitImagePreview, setHabitImagePreview] = useState('');
  const [successImagePreview, setSuccessImagePreview] = useState('');
  const [failImagePreview, setFailImagePreview] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    getHabitDetail({ userId, habitId }).then((data) => {
      setBaseData(data);
      setHabitImagePreview(data.overview.thumbImgUrl);
      setSuccessImagePreview(data.image.succImgUrl);
      setFailImagePreview(data.image.failImgUrl);
    });
  }, [router.isReady]);

  useEffect(() => {
    if (habitImage && habitImage.length > 0) {
      setVerify({ ...verify, habitImageVerify: 'success' });
      const file = habitImage[0];
      setHabitImagePreview(URL.createObjectURL(file));
    }
  }, [habitImage]);

  useEffect(() => {
    if (successImage && successImage.length > 0) {
      setVerify({ ...verify, successImageVerify: 'success' });
      const file = successImage[0];
      setSuccessImagePreview(URL.createObjectURL(file));
    }
  }, [successImage]);

  useEffect(() => {
    if (failImage && failImage.length > 0) {
      const file = failImage[0];
      setFailImagePreview(URL.createObjectURL(file));
    }
  }, [failImage]);

  const [verify, setVerify] = useState({
    titleVerify: 'success',
    subtitleVerify: 'success',
    categoryVerify: 'success',
    habitImageVerify: 'success',
    bodyVerify: 'success',
    authTimeVerify: 'success',
    successImageVerify: 'success',
    agreeVerify: 'fail',
  });

  const titleRegExp = /^[A-Za-z0-9가-힇\s]{5,30}$/;
  const subtitleRegExp = /^[A-Za-z0-9가-힇\s]{5,10}$/;
  const bodyRegExp = /^[A-Za-z0-9가-힇\s`~!@#$%^&*()-_=+]{50,}$/;

  const blurHandle = (verifyBoolean: boolean, verifyKey: string): void => {
    if (verifyBoolean) {
      setVerify({ ...verify, [verifyKey]: 'success' });
    } else {
      setVerify({ ...verify, [verifyKey]: 'fail' });
    }
  };

  const postButtonClick = async (data: HabitFormValues) => {
    let {
      title,
      subtitle,
      category,
      authEndTime,
      authStartTime,
      habitImage,
      successImage,
      failImage,
    } = data;

    if (!title.length) {
      title = baseData.overview.title;
    }
    if (!subtitle.length) {
      subtitle = baseData.detail.subTitle;
    }
    if (!authEndTime.length) {
      authEndTime = baseData.detail.authEndTime;
    }
    if (!authStartTime.length) {
      authStartTime = baseData.detail.authStartTime;
    }

    if (titleRegExp.test(title) === false) {
      setVerify({ ...verify, titleVerify: 'fail' });
    } else if (subtitleRegExp.test(subtitle) === false) {
      setVerify({ ...verify, subtitleVerify: 'fail' });
    } else if (category === 'default') {
      setVerify({ ...verify, categoryVerify: 'fail' });
    } else if (bodyRegExp.test(bodyData) === false) {
      setVerify({ ...verify, bodyVerify: 'fail' });
    } else if (authStartTime < authEndTime === false) {
      setVerify({ ...verify, authTimeVerify: 'fail' });
    } else {
      const formData = new FormData();
      const changedData = { authType: 'photo' };
      console.log(changedData);
      if (title !== baseData.overview.title) {
        changedData['title'] = title;
      }
      if (subtitle !== baseData.detail.subTitle) {
        changedData['subTitle'] = subtitle;
      }
      if (bodyData !== baseData.overview.body) {
        changedData['body'] = bodyData;
      }
      if (bodyHTMLData !== baseData.detail.bodyHTML) {
        changedData['bodyHTML'] = bodyHTMLData;
      }
      if (category !== baseData.detail.category) {
        changedData['category'] = category;
      }
      if (authEndTime !== baseData.detail.authEndTime) {
        changedData['authEndTime'] = authEndTime;
      }
      if (authStartTime !== baseData.detail.authStartTime) {
        changedData['authStartTime'] = authStartTime;
      }

      formData.append(
        'data',
        new Blob([JSON.stringify(changedData)], {
          type: 'application/json',
        }),
      );
      if (habitImagePreview !== baseData.overview.thumbImgUrl) {
        formData.append('thumbImg', habitImage[0]);
      }
      if (successImagePreview !== baseData.image.succImgUrl) {
        formData.append('succImg', successImage[0]);
      }
      if (failImagePreview !== baseData.image.failImgUrl) {
        formData.append('failImg', failImage[0]);
      }

      const response = await patchHabitDetail({
        habitId,
        userId,
        data: formData,
      });
      // router.push(`/habit/detail/${response?.overview?.habitId}`);
      reset();
    }
  };

  type nextInput =
    | 'title'
    | 'subtitle'
    | 'category'
    | 'authEndTime'
    | 'authStartTime';

  const InputElKeyEvent = (
    e: React.KeyboardEvent<HTMLElement>,
    nextInput?: nextInput,
  ): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setFocus(nextInput);
    }
  };

  const checkHandle = () => {
    verify.agreeVerify === 'fail'
      ? setVerify({ ...verify, agreeVerify: 'success' })
      : setVerify({ ...verify, agreeVerify: 'fail' });
  };

  const inputDefaultClassName: string =
    'text-base w-full rounded-md px-2 pt-[2px] border focus:border-mainColor duration-500 outline-0 mb-1';

  return (
    <div className="habit-post-container w-full px-[40px] mx-auto flex flex-col mt-[40px]">
      <form
        className="login-form"
        onSubmit={handleSubmit((data) => {
          try {
            postButtonClick(data);
          } catch (err) {
            console.error(err);
          }
        })}
      >
        <div className="title-input-wrapper flex flex-col mb-5 h-[80px]">
          <label htmlFor="title" className="text-base font-semibold mb-1">
            습관명
          </label>
          <input
            type="text"
            id="title"
            className={`h-[35px] ${inputDefaultClassName}`}
            placeholder="습관명을 5~20자 이내로 입력해주세요."
            defaultValue={baseData?.overview?.title}
            onKeyDown={(e) => {
              InputElKeyEvent(e, 'subtitle');
            }}
            {...register('title', {
              onBlur: () => {
                blurHandle(titleRegExp.test(getValues('title')), 'titleVerify');
              },
            })}
          />
          {verify.titleVerify === 'fail' ? (
            <span className="block text-subColor text-[13px] h-[13px] ">
              습관명을 5~20자 이내로 입력해주세요.
            </span>
          ) : null}
        </div>

        <div className="subtitle-input-wrapper flex flex-col mb-5 h-[80px]">
          <label htmlFor="subtitle" className="text-base font-semibold mb-1">
            부제
          </label>
          <input
            type="text"
            id="subtitle"
            className={`h-[35px] ${inputDefaultClassName}`}
            placeholder="부제를 5~10자 이내로 입력해주세요."
            defaultValue={baseData?.detail?.subTitle}
            onKeyDown={(e) => {
              InputElKeyEvent(e, 'category');
            }}
            {...register('subtitle', {
              onBlur: () => {
                blurHandle(
                  subtitleRegExp.test(getValues('subtitle')),
                  'subtitleVerify',
                );
              },
            })}
          />
          {verify.subtitleVerify === 'fail' ? (
            <span className="block text-subColor text-[13px] h-[13px] ">
              부제을 5~10자 이내로 입력해주세요.
            </span>
          ) : null}
        </div>

        <div className="category-input-wrapper flex flex-col mb-5 h-[80px]">
          <label htmlFor="category" className="text-base font-semibold mb-1">
            카테고리
          </label>
          <select
            id="category"
            className={`h-[35px] ${inputDefaultClassName} bg-white`}
            defaultValue={baseData?.detail?.category}
            {...register('category', {
              onBlur: () => {
                blurHandle(
                  getValues('category') !== 'default',
                  'categoryVerify',
                );
              },
            })}
          >
            {habitCategoryData.map((el) => {
              return (
                <option value={el.value} key={el.value}>
                  {el.title}
                </option>
              );
            })}
          </select>
          {verify.categoryVerify === 'fail' ? (
            <span className="block text-subColor text-[13px] h-[13px] ">
              카테고리를 선택해주세요.
            </span>
          ) : null}
        </div>

        <div className="habit-image-input-wrapper flex flex-col mb-5 min-h-[245px]">
          <div className="text-base font-semibold mb-1">습관 메인 사진</div>
          <FileUploader
            imgFilePreview={habitImagePreview}
            register={register('habitImage')}
          />
          <span className="pt-2.5 text-sm text-center font-semibold">
            사진의 가로 ・ 세로의 비율은 1:1이 권장됩니다.
          </span>
          {verify.habitImageVerify === 'fail' ? (
            <span className="block text-subColor text-[13px] h-[13px] ">
              습관을 잘 설명할 수 있는 이미지를 업로드 해주세요.
            </span>
          ) : null}
        </div>

        <div className="body-input-wrapper flex flex-col mb-5 min-h-[195px]">
          <label htmlFor="body" className="text-base font-semibold mb-1">
            습관 소개
          </label>
          <ReactQuillWrapper
            id="body"
            className="[&>div.ql-container]:h-[400px] rounded-md [&>div.ql-toolbar]:rounded-t-md [&>div.ql-container]:rounded-b-md [&>div.ql-container]:text-base"
            placeholder="습관에 대한 소개글을 최소 50자 이상 작성해주세요."
            theme="snow"
            defaultValue={baseData?.detail?.bodyHTML}
            modules={modules}
            formats={formats}
            onChange={(value, delta, source, editor) =>
              bodyDataHandle(value, editor)
            }
            onBlur={(previousSelection, source, editor) => {
              blurHandle(bodyRegExp.test(editor.getText()), 'bodyVerify');
            }}
          />
          {verify.bodyVerify === 'fail' ? (
            <span className="block text-subColor text-[13px] h-[13px] ">
              습관에 대한 설명글을 작성해주세요.
            </span>
          ) : null}
        </div>

        <div className="auth-time-input-wrapper flex flex-col mb-5 min-h-[117px]">
          <label htmlFor="authTime" className="text-base font-semibold mb-1">
            인증 가능 시간
          </label>
          <div className="flex relative">
            <input
              id="authTime"
              type="time"
              className={`h-[70px] text-base w-full rounded-tl-md text-center bg-slate-50 rounded-bl-md px-2 pt-[30px] border border-r-0 focus:border-mainColor focus:border-r outline-0 mb-1`}
              defaultValue={baseData?.detail?.authStartTime}
              onKeyDown={(e) => {
                InputElKeyEvent(e, 'authEndTime');
              }}
              {...register('authStartTime', {
                onBlur: () => {
                  console.log(getValues('authStartTime'));
                  blurHandle(
                    getValues('authStartTime') < getValues('authEndTime'),
                    'authTimeVerify',
                  );
                },
              })}
            ></input>
            <input
              type="time"
              className={`h-[70px] text-base w-full rounded-tr-md text-center bg-slate-50 rounded-br-md px-2 pt-[30px] border focus:border-mainColor outline-0 mb-1`}
              defaultValue={baseData?.detail?.authEndTime}
              onKeyDown={(e) => {
                InputElKeyEvent(e);
              }}
              {...register('authEndTime', {
                onBlur: () => {
                  console.log(getValues('authEndTime'));
                  blurHandle(
                    getValues('authStartTime') < getValues('authEndTime'),
                    'authTimeVerify',
                  );
                },
              })}
            ></input>
            <div className="absolute top-[10px] text-[14px] font-semibold left-0 pl-[12px] ">
              시작시간
            </div>
            <div className="absolute top-[10px] text-[14px] font-semibold left-2/4 pl-[12px]">
              종료시간
            </div>
          </div>
          {verify.authTimeVerify === 'fail' ? (
            <span className="block text-subColor text-[13px] h-[13px] ">
              인증 시작시간은 종료시간 보다 이전이어야 합니다.
            </span>
          ) : null}
        </div>

        <div className="habit-auth-image-input-wrapper flex flex-col mb-5 min-h-[245px]">
          <div className="text-base font-semibold mb-1">습관 인증 사진</div>
          <div className="flex flex-col">
            <div className="text-center text-green-600 py-2.5 text-sm font-bold">
              올바른 인증 사례(필수)
            </div>
            <FileUploader
              imgFilePreview={successImagePreview}
              register={register('successImage')}
            />
            <div className="text-center text-rose-600 pt-5 pb-2.5 text-sm font-bold">
              잘못된 인증 사례(선택)
            </div>
            <FileUploader
              imgFilePreview={failImagePreview}
              register={register('failImage')}
            />
          </div>
          <span className="pt-2.5 text-sm text-center font-semibold">
            사진의 가로 ・ 세로의 비율은 1:1이 권장됩니다.
          </span>
          {verify.successImageVerify === 'fail' ? (
            <span className="block text-subColor text-[13px] h-[13px] ">
              습관 형성을 위한 인증 사진의 올바른 사례와 잘못된 사례에 대한
              이미지를 모두 업로드 해주세요.
            </span>
          ) : null}
        </div>

        <div className="flex w-full mb-6">
          <input
            id="agreeCheck"
            type="checkbox"
            className="w-5 h-5 mr-3 accent-subColor"
            onClick={checkHandle}
          />
          <label
            htmlFor="agreeCheck"
            className="block text-mainColor text-base font-semibold "
          >
            (필수) 본 게시물은 선량한 풍속 및 기타 사회질서를 해치는 내용이
            포함되어 있지 않음을 확인합니다.
          </label>
        </div>

        <div className="button-wrapper flex justify-between pt-[15px]">
          <button
            className="signup-button w-[120px] text-base py-2.5 px-5 border rounded"
            type="button"
          >
            취소하기
          </button>
          <button
            className="login-button w-[120px] text-base bg-[#222222] text-white py-2.5 px-5 border rounded disabled:opacity-20"
            type="submit"
            disabled={!Object.values(verify).every((el) => el === 'success')}
          >
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHabit;