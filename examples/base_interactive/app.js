import TalqsInteraction from 'talqsInteraction';

var data = [];
var currentIndex = 1;
var currentId;

// 试题请求完成
var loadComplete = function(result) {
    data = result;
    renderQS();
    getInputData();
};

var app = document.getElementById('app');
var info = document.getElementById('info');
var answer = document.getElementById('answer');
document.addEventListener('UPDATE_TALQS_DATA', function(evt) {
    console.log(evt.data)
})

// 渲染试题
var renderQS = function() {
    var currentData = data[currentIndex];
    currentId = currentData.queId;
    app.innerHTML = TalqsTemplate.render(currentData, { queIndex: currentIndex + 1 });
    var jsonStr = TalqsInteraction.getData(currentId);
    if (jsonStr) {
        TalqsInteraction.setData(JSON.parse(jsonStr))
    }
    info.innerHTML = `逻辑类型： ${currentData.logicQuesTypeName}，逻辑类型ID： ${currentData.logicQuesTypeId}`;
    TalqsTemplate.autoLayout();
};

// 切换下一道题
document.getElementById('changeQS').addEventListener('click', function() {
    // 获取作答记录
    var jsonStr = TalqsInteraction.getData(currentId);
    var info = (jsonStr ? `作答记录为：${jsonStr}` : '你还未作答此题') + '，确定切换到下一题？';
    if (window.confirm(info)) {
        currentIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0;
        renderQS()
        getInputData();
    }
})

var getInputData = function() {
    var jsonStr = TalqsInteraction.getData(currentId);
    answer.innerHTML = jsonStr ? jsonStr : '你还未作答此题'
}

// 获取作答数据
document.getElementById('getData').addEventListener('click', getInputData)

// 请求试题数据
;
(function(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../data.json');
    xhr.send();
    xhr.onload = function() {
        cb(JSON.parse(this.responseText).data)
    }
})(loadComplete)
