## 2021-12-21
값에 수정사항이 있을때마다 계속 전체를 생성하는 방법에 대해서 어떻게 작성을 할 것인지.

수정이 발생한 내용만 추가하는 방법이 뭐가 있을까.
수정이 발생한 요소의 인덱스는 알고있음.
그러면 innerHTML을 이용해서 내부의 값만 수정하면 될 것 같은데.
선택한 요소.
e.target
선택한 요소의 인덱스
event_idx
선택한 요소의 인덱스와 같은 로컬스토리지의 배열
list_value
로컬스토리지를 수정하는 부분
해당 인덱스의 innerHTML을 수정하는 함수

내부의 값 수정과 리스트를 삭제하는 두 경우.
내부의 값 수정은 innerHTML로 수정할 수 있도록 하고

삭제버튼을 클릭했을 경우는 전체를 리셋.


set_list에서 박스별로 분리해서 값을 적용하고 마지막에 하나로 합치기?

## 2021-12-17
[HTML]
1차 구조 완성
[CSS]
header 와 todo_wrap의 기초적인 스타일 작성(미완성)
[JS]
-

해야 할 일
1. 기초적인 CSS 완성하기
2. JS 시작하기.
3. 정렬할 때 위치를 어떻게 바꿀 것인지 생각해보기.
4. 버튼의 모양 수정하기.

################################################################
<li class="item normal">
  <div class="btn_box">
    <!-- 호버시 출력될 X 버튼, 배경도 변해야 함. -->
    <button class="delete_item">❌</button>
    <!-- 삭제버튼 클릭시 출력될 체크박스 값을 어떻게 처리할 것인지.-->
    <!-- checkbox를 js를 통해서 생성할 때 name 값에 어떤걸 넣어야 할 것인지 생각을 해봐야 할 것 같음.value 값 또한 마찬가지삭제버튼, 정렬버튼 클릭 시 보여야 함.하나를 놓을지, 두 개를 놓을지 또한 고민해봐야 함.하나를 놓고, 버튼을 눌렀을 때 받은 값은 어떤 값이 체크되었는지만가져오고 받은 값을 이용해서 동작만 다르게 하는 방향으로 제작하기.텍스트 부분을 label로 묶어서 input을 눌렀을 때 css로 line-through 처리하는 방향으로 생각해봐도 좋을 것 같음. -->
    <input type="checkbox" name="" class="remove_item">
    <input type="radio" name="sort" class="sort_item">
  </div>
  <div class="text_box">
    <h4 class="input_text">AM 10:00 오전 빌드</h4>
    <p>work / 2020/01/02 15:35:40</p>
  </div>
  <div class="icon_box">
    <!-- 오른쪽 영역을 클릭했을 때 출력될 박스 - 빈 공간에서 클릭했을 때 보여야 함. 아이템의 순서를 변경할 수 있도록 만들기. 가장 상단의 박스는 올리기 버튼 숨기기 가장 하단의 박스는 내리기 버튼 숨기기 어떻게 만들어야 할까? item을 통째로 빼서 위쪽 인덱스로 옮겨야 함. 어떻게? 클릭한 인덱스와 근접한 인덱스의 내용 전체를 교체할 방법. nextElementSiblings와 prevElementSiblings를 이용해서 li.item의 요소 사이를 확인하는 방법을 통해서 움직이면 될 것 같음. -->
    <button class="up_item">🔺</button>
    <button class="down_item">🔻</button>
    <button class="check_item">✅</button>
  </div>
</li>
<!-- ######### list Frame ######### -->