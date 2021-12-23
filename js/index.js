document.addEventListener("DOMContentLoaded", function () {
  /* 필요한 전역 변수들
  # 특이사항 :
  $todo_list = 로컬스토리지에서 가져온 값
  $list_value = todo_list를 배열로 변환한 결과
  */
  var doc = document,
    todo_text = doc.getElementById("todo_text"),
    insert_btn = doc.getElementById("insert_btn"),
    remove_btn = doc.getElementById("remove_btn"),
    sort_btn = doc.getElementById("sort_btn"),
    sort_btn_on = doc.getElementById("sort_btn_on"),
    list = doc.getElementById("list"),
    item = list.children,
    text_box = doc.getElementsByClassName("text_box"),
    icon_box = doc.getElementsByClassName("icon_box"),
    sort_area = (doc.getElementsByClassName("sort_area"))[0],
    sort_num = doc.getElementById("sort_num"),
    todo_list,
    list_value,
    changed_value = "",
    btn_flag = false,
    icon_flag = false,
    sort_flag = false;

  /* 리스트 생성 및 초기화
  # 역할 : 
  1. 리스트 다시 생성
  2. 추가, 삭제, 정렬 버튼 초기화

  # 동작 : 아이템의 수에 변화가 생기면 
  1. X버튼을 클릭했을 때
  2. 추가버튼을 클릭했을 때
  3. 삭제버튼을 클릭했을 때 삭제할 아이템이 있는 경우
  */
  function init_page() {
    /* 변수 선언 */
    var init_text = "",
      item_value;

    /* 1. 버튼의 상태 초기화 */
    insert_btn.className = "btn";
    remove_btn.className = "btn";
    sort_btn.className = "btn off";
    todo_text.focus();
    btn_flag = false;

    /* 2. todo_list에서 값 가져오기 */
    todo_list = localStorage.getItem('todo_list');

    /* 3. todo_list에 값이 있을 경우 배열로 분리
          없을경우 #list 초기화 후 함수 종료 */
    if (todo_list) {
      list_value = todo_list.split(/[\;]/g);
    } else {
      remove_btn.className = "btn off";
      list.innerHTML = "";
      return;
    }

    /* 4. 반복문을 이용해 총 량/ 속성의 수 만큼 추가 */
    for (var i = 0; i < list_value.length; i++) {
      /* time|text(input)|flag가 한 개의 값 */
      item_value = list_value[i].split(/[\|]/g);
      init_text += '<li class="item normal">';
      init_text += set_list(item_value[1], item_value[0], item_value[2]);
      init_text += '</li>';
    }
    list.innerHTML = init_text;

    /* 6. 정렬버튼이 활성화 되어있었다면 정렬버튼 활성화 */
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

    /* 7. item이 2개 이상일 때 정렬버튼 활성화 */
    if (item.length > 1) {
      sort_btn.className = "btn";
    }
  };
  init_page();

  /*
  # 역할 : item 생성
  # 동작 : 추가버튼을 클릭했을 때
  */
  insert_btn.addEventListener("click", function () {
    /* 1. 버튼 활성화 확인 */
    if (this.className === "btn off") {
      return;
    }

    /* 2. 변수 선언
    test_text: 입력한 값이 없거나, 공백일 경우 체크 */
    var text_value = todo_text.value,
      test_text = text_value.replace(/ /g, ""),
      now_time = new Date(),
      reg = /[\/;|`\\]/gi,
      save_value,
      formatted_date = now_time.getFullYear() + "/" + (("0" + (now_time.getMonth() + 1)).slice(-2)) + "/" + now_time.getDate() + " " + (("0" + now_time.getHours()).slice(-2)) + ":" + (("0" + now_time.getMinutes()).slice(-2)) + ":" + (("0" + now_time.getSeconds()).slice(-2));

    /* 3. input 창 내부에 값이 정상적으로 들어있는지 확인
    - 값이 없으면 경고 */
    if (test_text.length === 0) {
      // window.alert("값을 입력해주세요.");
      /*
      todo console.log("아래의 테스트용 값 지우기") */
      text_value = (("0" + now_time.getSeconds()).slice(-2)) + ":" + (("00" + now_time.getMilliseconds()).slice(-3));
      // return;
    }

    /* 4. 가져온 값에서 특수문자 제거 */
    if (reg.test(text_value)) {
      text_value = text_value.replace(reg, "");
    }

    /* 5. localStorage에 저장할 값의 형태로 생성 */
    save_value = formatted_date + "|" + text_value + "|" + "on";

    /* 6. 기존의 값이 있는지 확인 후 통합 */
    todo_list = localStorage.getItem("todo_list");
    if (todo_list) {
      var total_value = save_value + ";" + todo_list;
    } else {
      var total_value = save_value;
    }

    /* 7. 전체 리스트의 값을 localStorage에 저장 */
    localStorage.setItem("todo_list", total_value);
    init_page();
  });

  /*
  # 역할 : 이벤트 발생시 로컬스토리지 수정 후 init_page 호출
  # 동작 : #list에 클릭이벤트가 발생했을 때 동작
  */
  list.addEventListener("click", function (e) {
    /* 1. 클릭한 요소를 e.target, 조상요소를 event_item에 저장 */
    var click_item = e.target,
      event_item = click_item.parentNode.parentNode,
      check_item = event_item,
      p_target = click_item.parentNode,
      event_idx = 0;

    /* 클릭한 요소가 item일 경우 */
    if (click_item === list) {
      return;
    }

    if (p_target === list) {
      return;
    }

    /* 3. 클릭한 요소의 인덱스 찾기 */
    while ((event_item = event_item.previousElementSibling) != null) {
      event_idx++;
    }

    /* remove 상태에서 텍스트 클릭시 체크 */
    if (check_item.className === "item remove") {
      var remove_item = doc.getElementsByClassName("remove_item"),
        remove_target = remove_item[event_idx];

      if (remove_target.checked) {
        /* 체크 해제 */
        remove_target.checked = false;
        p_target.className = p_target.className.replace("remove_check", "");
      } else {
        /* 체크 */
        remove_target.checked = true;
        p_target.className += " remove_check";
      }
      return;
    }

    /* sort 상태에서 텍스트 클릭시 체크 */
    if (check_item.className === "item sort") {
      var sort_item = doc.getElementsByClassName("sort_item");

      for (var i = 0; i < text_box.length; i++) {
        text_box[i].className = text_box[i].className.replace("sort_check", "");
      }
      sort_item[event_idx].checked = true;
      p_target.className += " sort_check";
      return;
    }

    /* 4. 텍스트 클릭 토글 */
    if (p_target.className === "text_box on") {
      toggle_text(p_target, event_idx, "off");
      return
    }
    if (p_target.className === "text_box off") {
      toggle_text(p_target, event_idx, "on");
      return
    }

    /* 5. 버튼 클릭시 동작 */
    switch (click_item.className) {
      case "delete_item":
        list_value.splice((event_idx), 1);
        break;

      case "icon_box":
        icon_flag = true;
        toggle_icon();
        return;

      case "up_item":
        move_list(event_idx, event_idx - 1);
        return;

      case "down_item":
        move_list(event_idx, event_idx + 1);
        return;

      case "check_item":
        icon_flag = false;
        toggle_icon();
        break;
    }

    /* 6. localStorage 변경 */
    changed_value = list_value.join(";");
    localStorage.setItem("todo_list", changed_value);

    init_page();
  });

  /* 삭제버튼 동작
  # 역할 : 
  1. 삭제버튼 1번째 클릭시 체크박스 표시 출력
  2. 삭제버튼 2번째 클릭시 선택한 item 삭제, 초기화
  # 동작 : 삭제버튼을 클릭했을 때
  */
  remove_btn.addEventListener("click", function () {
    /* 1. 버튼 활성화 확인, 삭제할 item이 있는지 확인
    - item이 1개일 경우 해당 아이템을 삭제 후 리스트 생성 */
    if (this.className === "btn off") {
      return;
    }
    if (item.length < 2) {
      localStorage.clear("todo_list");
      init_page();
      return;
    }

    /* 2. 변수 선언 */
    var remove_item = list.getElementsByClassName("remove_item"),
      remove_array = [];

    icon_flag = false;
    insert_btn.className = "btn off";
    sort_btn.className = "btn off";

    /* 삭제모드로 변경, 삭제할 아이템이 있는지 체크 */
    for (var i = 0; i < item.length; i++) {
      item[i].className = "item remove";
      if (remove_item[i].checked) {
        remove_array.push(i);
      }
    }

    /* 삭제한 아이템이 있을 때 */
    if (remove_array.length > 0) {
      for (var i = remove_array.length - 1; i > -1; i--) {
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

  /*
  # 역할 : sort_area on/off
  # 동작 : 정렬버튼 클릭
  */
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
        text_box[i].className = text_box[i].className.replace("sort_check", "");
      }
      btn_flag = false;
      sort_flag = false;
      return;
    }

    /* 첫 번째 클릭시 flag 변경 */
    btn_flag = true;
  });

  /*
  # 역할 : 선택한 아이템 위치 변경
  # 동작 : 정렬_on 버튼 클릭 시
  */
  sort_btn_on.addEventListener("click", function () {
    var sort_item = doc.getElementsByName("sort"),
      checked_item,
      sort_value = sort_num.value;

    /* sort_item이 체크가 되어있는지 확인 */
    for (var i = 0; i < item.length; i++) {
      if (sort_item[i].checked) {
        checked_item = i;
      }
    }

    /* 체크유무 확인 */
    if (isNaN(checked_item)) {
      alert("리스트를 체크해주세요");
      return;
    }

    /* 입력받은 값이 양수인지 확인 */
    if (sort_value < 1) {
      alert("양수를 입력해주세요.");
      return;
    }

    /* 입력받은 숫자가 리스트의 전체 개수보다 작은지 확인 */
    if (sort_value > item.length) {
      alert("리스트 전체 수보다 작은 숫자를 입력해주세요.");
      return;
    }
    sort_value--;

    /* 아이템 이동 */
    move_list(checked_item, sort_value);
  });

  /* 
  # 역할 : Todo-List 아이템의 구조 생성
  # 동작 :
  1. 추가버튼을 클릭했을 때
  2. 리스트를 생성 / 초기화 할 때
  */
  function set_list(text, time, flag) {
    /* 1. 아이템의 구조 (input에 입력한 텍스트, 현재 시간, 텍스트의 line-through 유무(on/off) )를 가져와 아이템의 프레임에 입력 */
    var total_item = "",
      set_flag,
      set_text,
      set_time;

    total_item = '<div class="btn_box"><button class="delete_item">❌</button><input type="checkbox" class="remove_item"><input type="radio" name="sort" class="sort_item"></div>';
    set_flag = '<div class="text_box ' + flag + '">'
    set_text = '<h4 class="input_text">' + text + '</h4>';
    set_time = '<p>' + time + '</p>';
    total_item += set_flag + set_text + set_time + '</div>';
    total_item += '<div class="icon_box"><button class="up_item">🔺</button><button class="down_item">🔻</button><button class="check_item">✅</button></div>';

    /* 입력한 결과를 반환 */
    return total_item;
  }

  /*
  # 역할 : 클릭한 아이템을 point에 따라서 위치를 변경
  # 동작 : up_item과 down_item을 클릭했을 때 실행
  */
  function move_list(target, point) {
    var temp_list = list_value[target],
      target_value = list_value[target].split(/[\|]/g),
      point_value = list_value[point].split(/[\|]/g);

    /* 아이콘 박스 표시, 리스트의 값 변경. */
    list_value[target] = list_value[point];
    list_value[point] = temp_list;

    /* 리스트 값 변경. */
    item[point].innerHTML = set_list(target_value[1], target_value[0], target_value[2]);
    item[target].innerHTML = set_list(point_value[1], point_value[0], point_value[2]);
    toggle_icon();

    changed_value = list_value.join(";");
    localStorage.setItem("todo_list", changed_value);
  }

  /* 아이콘 상자 토글 */
  function toggle_icon() {
    if (icon_flag) {
      for (var i = 0; i < icon_box.length; i++) {
        icon_box[i].className = "icon_box on";
      }
    } else {
      for (var i = 0; i < icon_box.length; i++) {
        icon_box[i].className = "icon_box";
      }
    }
  }

  /*
  # 역할 : 텍스트 토글
  # 동작 : text에 클릭이벤트가 발생했을 때 동작
  */
  function toggle_text(p_target, target, toggle) {
    /* 1. 클릭한 인덱스의 스토리지 저장값을 배열로 변환 */
    var target_item = list_value[target].split(/[\|]/g);

    /* 2. text_box 상태 변경, 로컬스토리지 저장값 변경 */
    icon_flag = false;
    p_target.className = "text_box " + toggle;

    target_item[2] = toggle;
    target_item = target_item.join("|");
    list_value[target] = target_item;

    changed_value = list_value.join(";");
    localStorage.setItem("todo_list", changed_value);

  }
});