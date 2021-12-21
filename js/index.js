document.addEventListener("DOMContentLoaded", function () {
  /* 필요한 전역 변수들 */
  var doc = document,
    insert_btn = doc.getElementById("insert_btn"),
    remove_btn = doc.getElementById("remove_btn"),
    sort_btn = doc.getElementById("sort_btn"),
    sort_btn_on = doc.getElementById("sort_btn_on"),
    list = doc.getElementById("list"),
    item = list.children,
    todo_list,
    list_data = 3,
    list_value,
    btn_flag = false,
    icon_box = doc.getElementsByClassName("icon_box"),
    icon_flag = false;


  /* 값 입력. */
  function set_list(text, time, flag) {
    var set_text = '<li class="item normal"><div class="btn_box"><button class="delete_item">❌</button><input type="checkbox" class="select_item"><input type="radio" name="sort" class="sort_item"></div><div class="text_box ' + flag + '"><h4 class="input_text">' + text + '</h4><p>work / ' + time + '</p></div><div class="icon_box"><button class="up_item">🔺</button><button class="down_item">🔻</button><button class="check_item">✅</button></div></li>';
    return set_text;
  }

  /* 리스트 생성 및 초기화 */
  function init_page() {

    insert_btn.className = "btn";
    remove_btn.className = "btn";
    sort_btn.className = "btn";
    btn_flag = false;

    /* localStorage에서 값을 가져오기. */
    todo_list = localStorage.getItem('todo_list');

    if (todo_list) {
      /* 값을 가져왔을 때 */
      list_value = todo_list.split(/[\|]/g);

      if (list_value.length % list_data !== 0) {
        /* 가져온 값에 문제가 있을 때 */
        console.log("이런! 저장된 기록에 문제가 발생했습니다.\n기록을 초기화합니다.");
        console.log(list_value);
        // alert("이런! 저장된 기록에 문제가 발생했습니다.\n기록을 초기화합니다.");
        localStorage.clear("todo_list");
        return;
      }

    } else {
      /* 값이 없을 때 */
      todo_list = "";
      list.innerHTML = "";
      return;
    }
    /* 최종 값 추가. */
    var init_text = "";
    for (var i = 0; i < list_value.length / 3; i++) {
      var list_text = list_value[(i * list_data) + 1],
        list_time = list_value[(i * list_data)],
        list_flag = list_value[(i * list_data) + 2];

      init_text += set_list(list_text, list_time, list_flag);
    }
    list.innerHTML = init_text;

    if (icon_flag) {
      for (var i = 0; i < icon_box.length; i++) {
        icon_box[i].className = "icon_box on";
      }
    }
    /* 테스트용 clear */
    // localStorage.clear("todo_list");
  };
  init_page();

  /* 리스트 이동관련 함수 */
  function move_list(target, point) {
    var temp_list = list_value.slice((target) * list_data, ((target) * list_data) + list_data);

    for (var i = 0; i < temp_list.length; i++) {
      list_value[(target) * list_data + i] = list_value[(target + point) * list_data + i];
      list_value[(target + point) * list_data + i] = temp_list[i];
    }
  }

  /* LIST 클릭시 동작. */
  list.addEventListener("click", function (e) {

    var click_item = e.target,
      event_item = click_item.parentNode.parentNode,
      text_box = click_item.parentNode,
      event_idx = 0;

    if (event_item.className !== "item normal") {
      return;
    }

    todo_list = localStorage.getItem('todo_list');
    list_value = todo_list.split(/[\|]/g);

    /* 클릭한 요소의 인덱스 */
    while ((event_item = event_item.previousElementSibling) != null) {
      event_idx++;
    }
    /* 텍스트 클릭 토글 */
    switch (text_box.className) {
      case "text_box on":
        // icon_flag = false;
        text_box.className = "text_box off";
        list_value[(event_idx * list_data) + 2] = "off";
        break;
      case "text_box off":
        // icon_flag = false;
        text_box.className = "text_box on";
        list_value[(event_idx * list_data) + 2] = "on";
        break;
    }

    /* 버튼 클릭시 동작 */
    console.log(e);
    console.log(click_item);
    console.log(click_item.className);
    switch (click_item.className) {
      case "delete_item":
        list_value.splice((event_idx * list_data), list_data);
        break;

      case "icon_box":
        icon_flag = true;
        console.log("icon_box Clicked");
        break;

      case "up_item":
        move_list(event_idx, -1);
        break;

      case "down_item":
        move_list(event_idx, +1);
        break;
    }

    /* localStorage 변경 */
    var changed_value = list_value.join("|");
    localStorage.setItem("todo_list", changed_value);

    init_page();
  });

  /* 추가버튼을 클릭했을 때 해야 할 동작 */
  insert_btn.addEventListener("click", function () {
    /* 1. 버튼 활성화 확인 */
    if (this.className === "btn off") {
      return;
    }

    /* 2. 지역변수 */
    var todo_text = doc.getElementById("todo_text"),
      text_value = todo_text.value,
      test_text = text_value.replace(/ /g, ""),
      now_time = new Date(),
      reg = /[\/;|`\\]/gi,
      formatted_date = now_time.getFullYear() + "/" + (("0" + (now_time.getMonth() + 1)).slice(-2)) + "/" + now_time.getDate() + " " + (("0" + now_time.getHours()).slice(-2)) + ":" + (("0" + now_time.getMinutes()).slice(-2)) + ":" + (("0" + now_time.getSeconds()).slice(-2));

    /* 3. input 창 내부에 값이 정상적으로 들어있는지 확인
      - 값이 없으면 경고 */
    if (test_text.length === 0) {
      // window.alert("값을 입력해주세요.");
      // return;
      // console.log("테스트용 임시 값 삽입");
      text_value = (("0" + now_time.getMinutes()).slice(-2)) + ":" + (("0" + now_time.getSeconds()).slice(-2)) + ":" + now_time.getMilliseconds();
    }

    /* 4. 가져온 값에서 특수문자 제거하기. */
    if (reg.test(text_value)) {
      text_value = text_value.replace(reg, "");
    }

    /* 5. localStorage에 저장할 값의 형태로 생성. */
    var save_value = formatted_date + "|" + text_value + "|" + "on";
    todo_list = localStorage.getItem('todo_list');
    if (todo_list) {
      /* 값이 없을 때 실행 */
      var total_value = save_value + "|" + todo_list;
    } else {
      /* 값이 있을 때 실행 */
      var total_value = save_value;
    }

    /* 6. input 의 텍스트 지우기 */
    text_value = "";

    /* 7. 전체 리스트의 값을 localStorage에도 저장. */
    localStorage.setItem("todo_list", total_value);
    init_page();
  });

  /* 삭제버튼 이벤트 */
  remove_btn.addEventListener("click", function () {
    /* 1. 버튼 활성화 확인 */
    if (this.className === "btn off") {
      return;
    }
    if (list.innerHTML === "") {
      return;
    }

    /* 변수 선언 */
    var select_item = list.getElementsByClassName("select_item"),
      remove_count = 0;
    // icon_flag = false;
    todo_list = localStorage.getItem('todo_list');
    list_value = todo_list.split(/[\|]/g);

    /* 2. 버튼에 off 클래스 추가 */
    insert_btn.className = "btn off";
    sort_btn.className = "btn off";

    var checked_array_1 = [];
    /* 3. 모든 item의 클래스에 remove를 추가 */
    for (var i = 0; i < item.length; i++) {
      item[i].className = "item remove";
      checked_array_1[i] = select_item[i].checked;
    }

    /* 체크된 아이템 삭제 */
    for (var i = checked_array.length; i > -1; i--) {
      if (checked_array_1[i]) {
        list_value.splice((i * list_data), list_data);
        remove_count++;
      }
    }

    if (remove_count > 0) {
      var changed_value = list_value.join("|");
      localStorage.setItem("todo_list", changed_value);

      init_page();
      return;
    }

    if (btn_flag) {
      btn_flag = false;

      init_page();
      return;
    }
    btn_flag = true;
  });

  sort_btn.addEventListener("click", function () {
    /* 1. 버튼 활성화 확인 */
    if (this.className === "btn off") {
      return;
    }

    /* 변수 선언 */
    var sort_area = (doc.getElementsByClassName("sort_area"))[0],
      sort_item = list.getElementsByClassName("sort_item"),
      checked_array_2 = [];

    /* 버튼 연속 클릭시 토글 */
    if (btn_flag) {
      insert_btn.className = "btn";
      remove_btn.className = "btn";
      sort_btn.className = "btn";
      sort_area.className = "sort_area";
      btn_flag = false;
      return;
    }

    insert_btn.className = "btn off";
    remove_btn.className = "btn off";
    // sort_btn.className = "btn off";
    sort_area.className = "sort_area on";

    for (var i = 0; i < item.length; i++) {
      item[i].className = "item sort";
      checked_array_2[i] = sort_item[i].checked;
    }
    console.log(checked_array_2);

    /* 클릭한 요소를 확인하기.
    현재 클릭한 요소는 checked_array_2 배열에 혼자 true 값으로 저장되어 있음.

    해야 할 일
    클릭한 요소 확인 > 완료
    클릭한 요소의 인덱스를 변수로 저장

    값은... 뭐 하나를 기본값으로 놓긴 해야 할 것 같음.
    checked_array_2를 for문 돌려서 true 인 요소를 전달?

    새로 생성된 정렬 버튼을 눌렀을 때, 어떻게 동작할 것인지.

    */
    btn_flag = true;
  });
  sort_btn_on.addEventListener("click", function () {
    var sort_num = (doc.getElementById("sort_num")).value,
      reg = /\d/;

    /* 입력받은 값이 숫자인지 확인 */
    if (!(sort_num.test(reg))) {
      alert("숫자를 입력해주세요.");
      sort_num = "";
    }
    /* 입력받은 숫자가 리스트의 전체 개수보다 작은지 확인 */
    if (item.length <= sort_num) {
      alert("리스트 전체 갯수보다 작은 숫자를 입력해주세요.");
      sort_num = "";
    }
    console.log(sort_num);
  });

});