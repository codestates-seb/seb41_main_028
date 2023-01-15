/* 
* <------  사용하시기 전에 꼭 읽어주세요! ------> *
※ 네트워크 통신을 통해 데이터를 받아오는 방식이 결정되면 아래 코드는 수정될 수 있습니다.
  현재의 코드는 한 번의 네트워크 통신으로 객체 형태의 각 habit에 대한 데이터들이 배열 형태로 server로부터 전달받는 통신 구조를 가정했습니다.

ToDo 1. HabitWrapperVetical은 Horizontal과 달리 Title과 Data에 대한 컴포넌트가 분리되어 있습니다.
        HabitWrapper를 사용하고자 하는 컴포넌트에서 위 두 컴포넌트를 각각 사용햐주셔야 합니다.
ToDo 2. HabitWrapper를 사용하는 컴포넌트에서 habitWrapperTitle, habitWrapperData를 props로 넘겨주셔야 합니다.
        (habitWrapperData는 각 habit들에 대한 데이터를 담고 있는 배열이며,
          각각의 배열 요소들은 해당 Habit에 대한 habitImage(이미지), habitTitle, habitBody를 담고 있는 객체입니다.)

< example >
<HabitWrapperVertical habitWrapperTitle="" habitWrapperData={habitWrapperData} />
* <------  사용하시기 전에 꼭 읽어주세요! ------> *
*/

import { HabitElement } from './habitElement';

export const HabitWrapperVertical = ({
  habitWrapperTitle,
  habitWrapperData,
}) => {
  return (
    <div className="habit-wrapper-Vertical p-4">
      <h3 className="habit-wrapper-title mb-5 text-xl font-semibold">
        {habitWrapperTitle}
      </h3>
      <div className="habit-wrapper-content">
        <ul className="habit-wrapper-list grid gap-4 grid-cols-2">
          {habitWrapperData.map((el) => {
            return (
              <li className="habit-element" key={el.habitId}>
                <HabitElement {...el} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
