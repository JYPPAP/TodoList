document.addEventListener("DOMContentLoaded", function () {
  /* 필요한 전역 변수들 */
  doc = document;
  var list_wrap = doc.getElementsByClassName(".todo_wrap"),
    insert_btn = doc.getElementById("insert_btn"),
    remove_btn = doc.getElementById("remove_btn"),
    sort_btn = doc.getElementById("sort_btn"),
    list = doc.getElementById("list"),
    delete_item = doc.getElementsByClassName("delete_item"),
    todo_list,
    list_value,
    item = list.children;

  /* 값 입력. */
  function set_list(text, time, flag) {
    var set_text = '<li class="item normal">\n<div class="btn_box">\n<button class="delete_item">❌</button>\n<input type="checkbox" name="" class="select_item">\n</div>\n<div class="text_box ' + flag + '">\n<h4 class="input_text">' + text + '</h4>\n<p>work / ' + time + '</p>\n</div>\n<div class="icon_box">\n<button class="up_item">🔺</button>\n<button class="down_item">🔻</button>\n<button class="check_item">✅</button>\n</div>\n</li>';
    return set_text;
  }

  /* 초기화 함수 */
  (function init_page() {
    /* 1. 처음 실행될 때 localStorage에서 값을 가져오기. */
    todo_list = localStorage.getItem('todo_list');

    if (typeof (todo_list) === "string") {
      /* 값을 가져왔을 때 */
      list_value = (todo_list.split(/[\|\;]/g)).slice(0, -1);
      console.log(list_value);
      if (list_value.length % 3 !== 0) {
        /* 가져온 값에 문제가 있을 때 */
        alert("이런! 저장된 기록에 문제가 발생했습니다.\n기록을 초기화합니다.");
        localStorage.clear("todo_list");
        return;
      }
    } else {
      /* 값이 없을 때 */
      console.log("값이 없음.");
      todo_list = "";
      return;
    }
    /* 최종 값 추가. */
    var init_text = "";
    for (var i = 0; i < list_value.length / 3; i++) {
      var list_text = list_value[(i * 3) + 1],
        list_time = list_value[(i * 3)],
        list_flag = list_value[(i * 3) + 2];

      init_text += set_list(list_text, list_time, list_flag);
    }
    list.innerHTML = init_text;
    /* 테스트용 clear */
    // localStorage.clear("todo_list");
  })();

  function save_list(text, time) {
    /* #### 삭제
    클릭한 값의 시간을 확인해서 제거... 초까지 같으면 어떻게 하지?
    클릭한 요소의 인덱스값을 확인.
    시간이 전부 동일하다고 할 때, 클릭한 요소의 인덱스값은 충분한 검색 요소.
    인덱스 확인 인덱스 *2, 인덱스 *2+1의 값이 지워야 할 대상.
    *** *** *** *** *** *** *** *** *** *** *** *** ***
    추가와 삭제할 때 중복되는지 체크 후 사용여부 판단하기.
    */
  }
  /* 클릭한 요소의 인덱스 */
  function getElementIndex(target) {
    var index = 0;
    while ((target = target.previousElementSibling) != null) {
      index++;
    }
    return index;
  }

  /* LIST 클릭시 동작. */
  list.addEventListener("click", function (e) {
    /* 생각해보니 line-through 처리한 값도 저장이 되어야하는데 그건 또 어떻게하지?
    추가해야 할 값.
    1. text_box에 추가될 off 클래스
    2. 
     */
    var click_item = e.target;
    console.log(e);
    var event_item = e.path[2];
    /* 클릭한 요소의 item 인덱스 번호 */
    var event_idx = getElementIndex(event_item);
    todo_list = localStorage.getItem('todo_list');
    list_value = (todo_list.split(/[\|\;]/g)).slice(0, -1);
    console.log(event_idx);

    /* 입력값용 배열 */
    console.log("list_value 1");
    console.log(list_value);
    console.log(click_item.parentNode);

    /* 텍스트를 클릭했을 때 동작 */
    if (click_item.parentNode.className === "text_box ") {
      click_item.parentNode.className = "text_box off";
      console.log(click_item.parentNode.className);
      list_value.splice(((event_idx * 3) + 2), 1, "off");
      console.log("list_value 2");
      console.log(list_value);
    } else if (click_item.parentNode.className === "text_box off") {
      click_item.parentNode.className = "text_box ";
      console.log(click_item.parentNode.className);
      list_value.splice(((event_idx * 3) + 2), 1, "");
    }

    /* 삭제버튼을 클릭했을 때 동작 */
    if (click_item.className === "delete_item") {
      console.log("삭제하라~~")
    }

    /* 설정할 때 flag값도 off로 적용하면 될 것 같음.
    배열로 만들고 인덱스 *3 +2번째의 값을 off로 바꾸기.
    
    */
    /* 최종 저장 */
    var changed_value ="";
    for(var i = 0; i <list_value.length/3; i++) {
      changed_value += list_value[i*3] + "|" + list_value[(i*3)+1] + "|" + list_value[(i*3)+2] + ";";
    }
    console.log(changed_value);
    localStorage.clear("todo_list");
    localStorage.setItem("todo_list", changed_value);

  });


  /* 추가버튼을 클릭했을 때 해야 할 동작 */
  insert_btn.addEventListener("click", function () {
    /* 1. 버튼 활성화 확인 */
    if (this.className === "btn off") {
      return;
    }

    /* 2. 지역변수 */
    var todo_text = doc.getElementById("todo_text");
    var text_value = todo_text.value;
    var now_time = new Date();
    var formatted_date = now_time.getFullYear() + "/" + (("0" + (now_time.getMonth() + 1)).slice(-2)) + "/" + now_time.getDate() + " " + (("0" + now_time.getHours()).slice(-2)) + ":" + (("0" + now_time.getMinutes()).slice(-2)) + ":" + (("0" + now_time.getSeconds()).slice(-2));

    /* 3. input 창 내부에 값이 정상적으로 들어있는지 확인
      - 값이 없으면 경고 */
    if (text_value === "") {
      // window.alert("값을 입력해주세요.");
      // return;
      // console.log("테스트용 임시 값 삽입, 나중에 지우기");
      text_value = "TEST";
    }

    /* 4. 가져온 값에서 특수문자 제거하기. */
    var reg = /[\/;|`\\]/gi;

    if (reg.test(text_value)) {
      text_value = text_value.replace(reg, "");
    }

    /* 5. 추가할 값 문자열로 만들기 */
    var item_text = set_list(text_value, formatted_date, "");

    /* 6. 기존의 리스트 따로 저장하기 */
    current_list = list.innerHTML;

    /* 7. 전체 값 출력하기 */
    list.innerHTML = item_text + current_list;

    /* 8. localStorage에 저장할 값의 형태로 생성. */
    var save_value = formatted_date + "|" + text_value + "|" + "" + ";";
    todo_list = localStorage.getItem('todo_list');
    if (todo_list === null) {
      /* 값이 없을 때 실행 */
      var total_value = save_value;
    } else {
      /* 값이 한 짝이라도 있을 때 실행 */
      var total_value = save_value + todo_list;
    }

    /* 9. input 의 텍스트 지우기 */
    text_value = "";

    /* 10. 전체 리스트의 값을 localStorage에도 저장. */
    localStorage.clear("todo_list");
    localStorage.setItem("todo_list", total_value);
  });
});