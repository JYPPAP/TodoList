document.addEventListener("DOMContentLoaded", function () {
  {/* 필요한 전역 변수들
  # 특이사항 :
  $todo_list = 로컬스토리지에서 getItem으로 가져올 값
  $list_value = todo_list를 배열로 변환한 결과
  */}
  var doc = document,
    todo_text = doc.getElementById("todo_text"),
    insert_btn = doc.getElementById("insert_btn"),
    remove_btn = doc.getElementById("remove_btn"),
    sort_btn = doc.getElementById("sort_btn"),
    sort_btn_on = doc.getElementById("sort_btn_on"),
    list = doc.getElementById("list"),
    item = list.children,
    icon_box = doc.getElementsByClassName("icon_box"),
    sort_area = (doc.getElementsByClassName("sort_area"))[0],
    sort_num = doc.getElementById("sort_num"),
    todo_list,
    list_value,
    changed_value = "",
    btn_flag = false,
    icon_flag = false,
    sort_flag = false;

  {/* # 역할 : Todo-List 아이템의 구조 생성

  # 동작하는 경우 :
  1. 추가버튼을 클릭했을 때
  2. 리스트를 생성 / 초기화 할 때

  # 동작 순서 :
  1. 아이템의 구조 (input에 입력한 텍스트, 추가한 시간, 텍스트의 line-through 유무(on/off) )를 받아와
  아이템의 프레임에 값을 입력
  2. 결과물인 set_text를 반환
   */}
  function set_list(text, time, flag) {
    var set_text = '<li class="item normal"><div class="btn_box"><button class="delete_item">❌</button><input type="checkbox" class="remove_item"><input type="radio" name="sort" class="sort_item"></div><div class="text_box '+flag+'"><h4 class="input_text">'+text+'</h4><p>'+time+'</p></div><div class="icon_box"><button class="up_item">🔺</button><button class="down_item">🔻</button><button class="check_item">✅</button></div></li>';

    return set_text;
  }

  {/* 리스트 생성 및 초기화
  # 역할 : 
  1. localStorage가 수정되면 리스트를 새롭게 출력.
  2. 추가, 삭제, 정렬 버튼 초기화

  # 동작하는 경우 : 
  1. X버튼을 클릭했을 때
  2. 텍스트를 클릭했을 때
  3. 정렬 아이콘을 클릭해서 정렬했을 때
  4. 추가버튼을 클릭했을 때
  5. 삭제버튼을 클릭했을 때 삭제할 아이템이 있는 경우
  6. 정렬버튼을 클릭했을 때 정렬할 아이템이 있는 경우

  # 동작 순서
  1. 버튼의 상태 초기화
  2. todo_list에서 값 가져오기
  3. todo_list에 값이 있을 경우 배열로 변경
  4. 가져온 값이 Null이거나 ""일 경우 todo_list에 빈 문자열 저장, #list 초기화 후 함수 종료
  5. 가져온 값이 정상일 경우 반복문을 이용해 총 량/ 속성의 수 만큼 추가
  6. 이전에 icon_box가 활성화 되어있었다면 icon_box에 on클래스 부여.
  7. item이 2개 이상일 때 정렬버튼 활성화
  */}
  function init_page() {
    var init_text = "",
      item_value;

    insert_btn.className = "btn";
    remove_btn.className = "btn";
    sort_btn.className = "btn off";
    todo_text.focus();
    btn_flag = false;
    todo_list = localStorage.getItem('todo_list');
    
    if (todo_list) {
      list_value = todo_list.split(/[\;]/g);

    } else {
      list.innerHTML = "";
      return;
    }
    
    /* item_value
    time|text(input)|flag 을 |로 분리한 배열
    */
    for(var i = 0; i < list_value.length; i++) {
      item_value = list_value[i].split(/[\|]/g);
      init_text += set_list(item_value[1], item_value[0], item_value[2]);
    }
    
    list.innerHTML = init_text;

    if (icon_flag) {
      for (var i = 0; i < icon_box.length; i++) {
        icon_box[i].className = "icon_box on";
      }
    }

    if (sort_flag) {
      btn_flag = true;
      insert_btn.className = "btn off";
      remove_btn.className = "btn off";
      sort_area.className = "sort_area on";
      sort_num.focus();
      for (var i = 0; i < item.length; i++) {
        item[i].className = "item sort";
      }
    }

    if(item.length > 1) {
      sort_btn.className = "btn";
    }
    /* 테스트용 clear */
    // localStorage.clear("todo_list");
  };
  init_page();

  {/* # 역할 : 클릭한 아이템을 point에 따라서 위치를 변경

  # 동작하는 경우 : up_item과 down_item을 클릭했을 때 실행

  # 동작 순서 :
  1. 임시 리스트에 클릭한 아이템의 속성들을 저장
  2. icon_flag를 true로 변경
  3. 이동할 아이템의 값을 클릭한 아이템의 값에 저장
  4. 임시로 저장한 값을 이동할 아이템에 저장
  */}
  function move_list(target, point) {
    var temp_list = list_value[target];

    icon_flag = true;
    list_value[target] = list_value[target + point];
    list_value[target + point] = temp_list;
  }

  {/* # 역할 : 텍스트 토글

  # 동작하는 경우 : text에 클릭이벤트가 발생했을 때 동작

  # 동작 순서
  1. list_value의 클릭한 인덱스 값을 배열로 변환
  2. icon_flag 변경, text_box의 클래스 변경, 속성 변경
  3. 배열을 문자열로 변경
  4. 변경한 값 갱신
  */}
  function text_toggle(text_box, target, toggle) {
    var target_item = list_value[target].split(/[\|]/g);

    icon_flag = false;
    text_box.className = "text_box " + toggle;
    target_item[2] = toggle;
    target_item = target_item.join("|");
    list_value[target] = target_item;
  }

  {/* LIST 클릭시 동작.
  # 역할 :
  1. #list에 클릭이벤트가 발생했을 때의 동작
  2. 로컬스토리지 수정 후 init_page 호출

  # 동작하는 경우 : #list에 클릭이벤트가 발생했을 때 동작

  # 동작 순서
  1. 클릭한 아이템을 e.target으로 지정
  2. event_item에 클릭한 아이템 저장
  3. event_item이 normal 상태가 아닐경우 함수 종료
    - normal 상태는 init_page 함수가 실행된 직후의 상태
    - 그 외의 상태는 삭제, 정렬버튼을 클릭한 상태이며 이 상태에서는 X버튼과 line-through, 정렬 아이콘이 출력되면 안됌
  4. 클릭한 요소의 인덱스 찾기
  5. 텍스트를 클릭했을 경우
    - text_toggle 함수 실행;
  6. 버튼을 클릭했을 경우
    - 클릭한 요소가 delete_item 일 경우
      - 배열에서 속성값들 제거
    - 클릭한 요소가 icon_box 일 경우
      - icon_flag를 true로 변경
        - init_page에서 icon_flag를 통해 on클래스가 추가됨
    - 클릭한 요소가 up_item 일 경우
      - 위에 있는 아이템과 위치가 바뀜
    - 클릭한 요소가 down_item 일 경우
      - 아래에 있는 아이템과 위치가 바뀜
  7. 로컬 스토리지에 배열 list_value를 문자열로 변환 후 저장
  8. init_page를 호출
  */}
  list.addEventListener("click", function (e) {
    var click_item = e.target,
      event_item = click_item.parentNode.parentNode,
      text_box = click_item.parentNode,
      event_idx = 0;

    /*
    todo 
    1. item remove 일 때, 텍스트를 클릭해도 check하는 기능 추가하기
    2. 정렬도 그렇게 만들기
    */

    if (event_item.className !== "item normal") {
      return;
    }

    /* 클릭한 요소의 인덱스 */
    while ((event_item = event_item.previousElementSibling) != null) {
      event_idx++;
    }
    /* 텍스트 클릭 토글 */
    switch (text_box.className) {
      case "text_box on":
        text_toggle(text_box, event_idx, "off");
        break;
      case "text_box off":
        text_toggle(text_box, event_idx, "on");
        break;
    }

    /* 버튼 클릭시 동작 */
    switch (click_item.className) {
      case "delete_item":
        list_value.splice((event_idx), 1);
        break;

      case "icon_box":
        /* 
        ? icon_box를 클릭해도 click_item이 없음.
        - icon_box에 마우스 올렸을 때 버튼이 출력되도록 변경
        - 버튼을 클릭했을 때 on 클래스가 추가되도록 변경
        */
        icon_flag = true;
        break;

      case "up_item":
        move_list(event_idx, -1);
        break;

      case "down_item":
        move_list(event_idx, +1);
        break;
    }

    /* localStorage 변경 */
    changed_value = list_value.join(";");
    localStorage.setItem("todo_list", changed_value);

    init_page();
  });

  {/* 추가버튼을 클릭시 동작
  # 역할 : 추가버튼을 클릭했을 때 item 생성

  # 동작하는 경우 : 추가버튼을 클릭했을 때

  # 동작 순서
  1. 버튼 활성화 확인
  2. 변수 선언
    test_text: 입력한 값이 없거나, 공백일 경우 체크
  3. input 창 내부에 값이 정상적으로 들어있는지 확인
    - 값이 없으면 경고
  4. 가져온 값에서 특수문자 제거
  5. localStorage에 저장할 값의 형태로 생성
  6. input 의 텍스트 초기화
  7. 전체 리스트의 값을 localStorage에 저장
  */}
  insert_btn.addEventListener("click", function () {
    if (this.className === "btn off") {
      return;
    }

    var text_value = todo_text.value,
      test_text = text_value.replace(/ /g, ""),
      now_time = new Date(),
      reg = /[\/;|`\\]/gi,
      save_value,
      formatted_date = now_time.getFullYear() + "/" + (("0" + (now_time.getMonth() + 1)).slice(-2)) + "/" + now_time.getDate() + " " + (("0" + now_time.getHours()).slice(-2)) + ":" + (("0" + now_time.getMinutes()).slice(-2)) + ":" + (("0" + now_time.getSeconds()).slice(-2));

    if (test_text.length === 0) {
      window.alert("값을 입력해주세요.");
      return;
      // console.log("테스트용 임시 값 삽입");
      // text_value = (("0" + now_time.getMinutes()).slice(-2)) + ":" + (("0" + now_time.getSeconds()).slice(-2)) + ":" + now_time.getMilliseconds();
    }

    if (reg.test(text_value)) {
      text_value = text_value.replace(reg, "");
    }

    save_value = formatted_date + "|" + text_value + "|" + "on";
    text_value = "";

    if (todo_list) {
      var total_value = save_value + ";" + todo_list;
    } else {
      var total_value = save_value;
    }

    localStorage.setItem("todo_list", total_value);

    init_page();
  });

  {/* 삭제버튼 동작
  # 역할 : 
  1. 삭제버튼 1번째 클릭시 체크박스 표시 출력
  2. 삭제버튼 2번째 클릭시 선택한 item 삭제, 초기화

  # 동작하는 경우 : 삭제버튼을 클릭했을 때

  # 동작 순서
  1. 버튼 활성화 확인, 삭제할 item이 있는지 확인
    - item이 1개일 경우 해당 아이템을 삭제 후 리스트 생성
  2. 변수 선언
    remove_count = 삭제할 요소의 개수
  3. 버튼에 off 클래스 추가
  4. X버튼을 숨기고 checkbox 버튼 표시, 체크된 버튼을 배열에 저장
  5. 삭제할 값이 있는지 체크, 있다면 삭제 및 카운트 증가
  6. 카운트가 있다면
    - 변화한 값 적용 후 리스트 생성 및 함수종료
  7. 카운트가 없다면 버튼이 두 번째 클릭인지 확인
    - 두 번째 클릭이라면 리스트 생성 후 함수종료
    - 첫 번째 클릭이라면 btn_flag를 true로 변경
  */}
  remove_btn.addEventListener("click", function () {
    if (this.className === "btn off") {
      return;
    }
    if (item.length < 2) {
      localStorage.clear("todo_list");
      init_page();
      return;
    }

    var remove_item = list.getElementsByClassName("remove_item"),
      remove_count = 0,
      remove_array = [];

    icon_flag = false;
    insert_btn.className = "btn off";
    sort_btn.className = "btn off";

    /* 삭제모드로 변경, 삭제할 아이템이 있는지 체크 */
    for (var i = 0; i < item.length; i++) {
      item[i].className = "item remove";
      // remove_array[i] = remove_item[i].checked;
      if(remove_item[i].checked) {
        remove_array.push(i);
      }
    }

    /* 삭제한 아이템이 있을 때 */
    if (remove_array.length > 0) {
      for (var i = remove_array.length; i > -1; i--) {
          list_value.splice((remove_array[i]), 1);
      }
      changed_value = list_value.join(";");
      localStorage.setItem("todo_list", changed_value);

      init_page();
      return;
    }

    /* 두 번째 클릭시 초기화 */
    if (btn_flag) {
      init_page();
      return;
    }
    /* 첫 번째 클릭시 flag 변경 */
    btn_flag = true;
  });

  {/* # 역할 : sort_area on/off
      # 동작하는 경우 : 정렬버튼 클릭
  */}
  sort_btn.addEventListener("click", function () {
    /* 버튼 활성화 확인 */
    if (this.className === "btn off") {
      return;
    }
    /* 버튼이 2개 이상일 때 동작 */
    if (item.length < 2) {
      return;
    }

    /* 버튼 비활성화, sort_area에 on 클래스 추가 */
    insert_btn.className = "btn off";
    remove_btn.className = "btn off";
    sort_area.className = "sort_area on";
    sort_num.focus();
    icon_flag = false;

    /* item에 sort 클래스 추가, 체크한 아이템의 배열 생성 */
    for (var i = 0; i < item.length; i++) {
      item[i].className = "item sort";
    }

    /* 두 번째 클릭시 초기화 */
    if (btn_flag) {
      insert_btn.className = "btn";
      remove_btn.className = "btn";
      sort_area.className = "sort_area";
      for (var i = 0; i < item.length; i++) {
        item[i].className = "item normal";
      }
      btn_flag = false;
      sort_flag = false;
      return;
    }
    /* 첫 번째 클릭시 flag 변경 */
    btn_flag = true;
  });

  {/* # 역할 : 선택한 아이템 위치 변경
      # 동작하는 경우 : 정렬_on 버튼 클릭 시
  */}
  sort_btn_on.addEventListener("click", function () {
    var sort_item = doc.getElementsByName("sort"),
      checked_item,
      temp_sort = [],
      sort_value = sort_num.value;
    
    /* sort_item이 체크가 되어있는지 확인 */
    for (var i = 0; i < item.length; i++) {
      if(sort_item[i].checked) {
        checked_item = i;
      }
    }

    /* 체크유무 확인 */
    if(isNaN(checked_item)) {
      alert("리스트를 체크해주세요");
      return;
    }

    /* 입력받은 값이 양수인지 확인 */
    if (sort_value < 1) {
      alert("양수를 입력해주세요.");
      return;
    }
    
    /* 입력받은 숫자가 리스트의 전체 개수보다 작은지 확인 */
    sort_value--;
    if (sort_value > item.length) {
      alert("리스트 전체 수보다 작은 숫자를 입력해주세요.");
      return;
    }

    /* 아이템 이동 */
    sort_flag = true;
    temp_sort = list_value[checked_item];
    list_value[checked_item] = list_value[sort_value];
    list_value[sort_value] = temp_sort;

    /* 변경값 저장 */
    changed_value = list_value.join(";");
    localStorage.setItem("todo_list", changed_value);

    init_page();
  });
});