/*
  web SQL 与 localStorage 和 sessionStorage 不同
  web SQL 是属于关系型的数据存储，而localStorage和sessionStorage是属于键值对的形式存储
  而且 web SQL 没有明确规定的大小限制，事实上就是无限制的
  不过因为需要考虑移动设备，所以一般来说数据量最好不要超过 50M
  在 Chrome 中，通过底层集成 sqlite 来实现基于 web 的 SQL 关系型数据库
  国外一部分讨论认为，webSQL的设计太过于复杂，所以可能在将来会被弃用
  参考资料：http://programmers.stackexchange.com/questions/220254/why-is-web-sql-database-deprecated
*/
(function() {
  var db = openDatabase('staff', '1.0', '员工表', 2 * 1024 * 1024);
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS staff(name TEXT, gender TEXT, age INTEGER)");
  });
  var btn_add = document.getElementById("add");
  var btn_rm = document.getElementById("remove");
  var btn_drop = document.getElementById("drop");
  var table = document.getElementsByTagName("table")[0];
  var tbody = document.getElementsByTagName("tbody")[0];

  // 预加载数据库中的数据
  db.transaction(function(tx) {
    tx.executeSql("SELECT rowid, * FROM staff",   // rowid 需要明确的声明，不然结果中将不存在该项
    [],
    function(tx, results) {
      var rows = Array.prototype.slice.call(results.rows);
      rows.forEach(function(item) {
        var new_tr = document.createElement("tr");
        var new_tds = [
          document.createElement("td"),
          document.createElement("td"),
          document.createElement("td"),
          document.createElement("td"),
          document.createElement("td")
        ];
        new_tds[0].innerHTML = item.rowid;
        new_tds[1].innerHTML = item.name;
        new_tds[2].innerHTML = item.gender;
        new_tds[3].innerHTML = item.age;
        var tmp_checkbox = document.createElement("input");
        tmp_checkbox.type = "checkbox";
        new_tds[4].appendChild(tmp_checkbox);
        new_tds.forEach(function(item) {
          new_tr.appendChild(item);
        });
        tbody.appendChild(new_tr);
      });
    },
    function(tx, error) {
      console.log(error);
    }
    );
  });

  // 实现表格双击编辑
  table.addEventListener("dblclick", function(e) {
    var ev = e || window.event;
    var target = ev.target || ev.srcElement;
    if (target.nodeName.toLowerCase() === "td") {
      if (target.cellIndex > 0 && target.cellIndex < 4) {
        var input = document.createElement("input");
        input.type = "text";
        input.style.width = "100%";
        input.value = target.innerHTML;
        target.innerHTML = "";
        target.appendChild(input);
        input.focus();
        input.onblur = function() {
          // 修改 webSQL 中对应的数据
          // 获得 id
          var tmp_id = target.parentNode.getElementsByTagName("td")[0].innerHTML;
          // 获得当前 input 中的实际值
          var tmp_val = this.value;
          // 获得 column 的名字
          var tmp_colName;
          if (target.cellIndex === 1) {
            tmp_colName = "name";
          } else if (target.cellIndex === 2) {
            tmp_colName = "gender";
          } else {    // cellIndex === 3
            tmp_colName = "age";
          }
          // 执行 SQL 语句
          db.transaction(function(tx) {
            var sql_str = "UPDATE staff SET "+tmp_colName+" = ? WHERE rowid = ?";
            // execeuteSql 不支持 ? = ? 这种形式，列名不能为 ?
            // tx.executeSql("UPDATE staff SET ? = ? WHERE rowid = ?", [tmp_colName, tmp_val, tmp_id]);
            tx.executeSql(sql_str, [tmp_val, tmp_id]);
          });
          target.removeChild(this);
          target.innerHTML = tmp_val;
        };
      }
    }
  });
  // 监听添加按钮
  btn_add.addEventListener("click", function() {
    // 插入数据并显示元素
    var new_row = document.createElement("tr");
    var tmp_name = document.getElementById("name");
    var tmp_gender = document.getElementById("gender");
    var tmp_age = document.getElementById("age");
    // 由于 webSQL 的执行是异步的，所以要获得 id 的话需要写回调函数
    var fn_callback = function(tmp_id) {
      for (var i = 0; i < 5; i++) {
        var col = document.createElement("td");
        switch (i) {
          case 0:
            // ID
            col.innerHTML = tmp_id;
            break;
          case 1:
            // 姓名
            col.innerHTML = tmp_name.value;
            tmp_name.value = "";
            break;
          case 2:
            // 性别
            col.innerHTML = tmp_gender.value;
            tmp_gender.value = "";
            break;
          case 3:
            // 年龄
            col.innerHTML = tmp_age.value;
            tmp_age.value = "";
            break;
          case 4:
            // 复选框
            var tmp_input = document.createElement("input");
            tmp_input.type = "checkbox";
            col.appendChild(tmp_input);
            break;
        }
        new_row.appendChild(col);
      }
      tbody.appendChild(new_row);
    };
    db.transaction(function(fx) {
      fx.executeSql("INSERT INTO staff(name, gender, age) values(?, ?, ?)",
        [tmp_name.value, tmp_gender.value, tmp_age.value],
        function(tx, results) {
          fn_callback(results.insertId);
        },
        function (tx, error) {
          console.log(error);
        }
      );
    });
  });

  // 监听删除按钮
  btn_rm.addEventListener("click", function(e) {
    var rowlist = tbody.getElementsByTagName("tr");
    var rows = Array.prototype.slice.call(rowlist);    // nodeList转换成Array
    var selected_list = [];
    rows.forEach(function(item, index) {
      if (index === 0) return;
      if (item.getElementsByTagName("input")[0].checked) {
        selected_list.push(item);
      }
    });

    selected_list.forEach(function(item) {
      // 删除webSQL中对应的数据
      var tmp_id = item.getElementsByTagName("td")[0].innerHTML;
      db.transaction(function(tx) {
        tx.executeSql("DELETE FROM staff WHERE rowid = ?",
          [tmp_id],
          function(tx, results){},
          function(tx, error){console.error(error)}
        );
      });
      // 删除表格中的显示数据
      tbody.removeChild(item);
    });
  });

  // 监听清空按钮
  btn_drop.addEventListener("click", function() {
    db.transaction(function(tx) {
      // 删除数据库表
      tx.executeSql("DROP TABLE IF EXISTS staff");
      // 重建数据库表
      tx.executeSql("CREATE TABLE IF NOT EXISTS staff(name TEXT, gender TEXT, age INTEGER)");
      // 清空表格中的数据
      var tmp_trs = tbody.getElementsByTagName("tr");
      // 由于 NodeList 的 length 会动态变化，所以需要将其先转成 Array
      var tmp_arr_trs = Array.prototype.slice.call(tmp_trs);
      for (var i = 1; i < tmp_arr_trs.length; i++) {
        tbody.removeChild(tmp_arr_trs[i]);
      }
    });
  });
})();
