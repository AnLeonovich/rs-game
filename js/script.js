let result; 

let languages = ['js', 'css', 'html', 'c', 'java', 'php', 'ruby', 'python']; // ЯП для монстров (уровней)
let form = document.getElementById('form');
let attackQuestions, shieldQuestions, healQuestions; // массивы вопросов (чтобы исключить повторение вопросов)
let answerButtom; // кнопка "отправки" ответа, создается в процессе отображения задачи

class Helpers{ 
  constructor(){}
  randomNumber(max){ // генератор случайных чисел
    return Math.floor(Math.random() * max);
  }
  chooseLanguage(languages){ // выбор языка для уровня
    let index = new Helpers().randomNumber(languages.length);
    let language = languages.splice(index, 1).toString();
    return language;
  }
}

class Tasks{ // дополнитльные (рандомные) задания
  constructor(){}
  calculator(){
    let rules = `Calculate the result.\nIf necessary, round the number to the nearest integer.`; //правило на этот тип задач
    let signs = [' + ', ' - ', ' * ', ' / '];
    let str = new Helpers().randomNumber(100) + signs[new Helpers().randomNumber(4)] + new Helpers().randomNumber(100); // пример
    let res = Math.round(eval(str)).toString(); //результат    
    console.log('Answer ', res);
    new giveTask().showTaskSimple(rules, str, res); // выводим на экран
  }
}

class Incantations{ // заклинания
  constructor(){} //в консоли пока отображаются ответы для задач
  attack(){ 
    if (!attackQuestions){
      attackQuestions = new AttackQuestions()[levelLanguage](); // получаем массив в вопросами для данного уровня
      let index = new Helpers().randomNumber(attackQuestions.length); // генерируем рандомный индекс
      let question = attackQuestions[index]; // получаем массив с вопросом и ответом
      console.log('Answer ', question[1]);
      attackQuestions.splice(index, 1); // удаляем этот вопрос из массива (вопросы не повторяются)
      let rules = new AttackQuestions().rules; // правила для этого вида заклинаний
      new giveTask().showTaskSimple(rules, question[0], question[1]); // выводим вопрос
    }
  }
  shield(){
    //как и атака
    shieldQuestions = new ShieldQuestions()[levelLanguage]();
    let index = new Helpers().randomNumber(shieldQuestions.length);
    let question = shieldQuestions[index]; 
    console.log('Answer ', question[1]);
    shieldQuestions.splice(index, 1);
    let rules = new ShieldQuestions().rules;
    new giveTask().showTaskSimple(rules, question[0], question[1]);
  }
  heal(){
    healQuestions = new HealQuestions()[levelLanguage]();
    let index = new Helpers().randomNumber(healQuestions.length);
    let question = healQuestions[index];
    let rules = new HealQuestions().rules;
    healQuestions.splice(index, 1);
    new giveTask().showTaskWithOptions(rules, question[0], question[1], question[2]);
    console.log('Answer ', question[2]);
  }
}

class giveTask{ // вывод вопросов на экран
  constructor(){}
  showTaskSimple(rules, task, answer){ // вопросы по схеме правило -> текст 
    form.innerHTML = `<input type="text" class='task__form_answer'>
                      <input type="button" class='task__form_button' value="Answer">`;
    answerButtom = document.querySelector('.task__form_button');
    let description = document.getElementById('taskDesc');
    let text = document.getElementById('taskText');
    description.innerHTML = rules;
    text.innerHTML = task;
    result = new checkAnswer(answer); // создаем новый объект, в котором будет храниться ответ и проверяться ответ пользователя
    answerButtom.addEventListener('click', result.checkSimpleAnswer); // по клику - проверять результат
  }
  showTaskWithOptions(rules, task, options, answer){ //вопросы по схеме правило -> варианты ответов 
    form.innerHTML = `<label><input type='radio' class='task__form_options' name='answer' value='${options[0]}'>${options[0]}</label>
                      <label><input type='radio' class='task__form_options' name='answer' value='${options[1]}'>${options[1]}</label>
                      <label><input type='radio' class='task__form_options' name='answer' value='${options[2]}'>${options[2]}</label>
                      <label><input type='radio' class='task__form_options' name='answer' value='${options[3]}'>${options[3]}</label>
                      <input type="button" class='task__form_button' value="Answer">`;
    answerButtom = document.querySelector('.task__form_button');
    let description = document.getElementById('taskDesc');
    let text = document.getElementById('taskText');
    description.innerHTML = rules;
    text.innerHTML = task;
    result = new checkAnswer(answer); // создаем новый объект, в котором будет храниться ответ и проверяться ответ пользователя
    answerButtom.addEventListener('click', result.checkSelectedAnswer);
  }
}

class checkAnswer{ // класс проверки ответов
  constructor(res){
    this.result = res; // при создании запоминаем правильный ответ из условия 
  }
  checkSimpleAnswer(){ // проверка для обычного текстового ответа
    let answer = document.querySelector('.task__form_answer').value.replace(/(^\s*)|(\s*)$/g, '').toLowerCase(); 
    if (answer === result.result){
      console.log(true);
      // correct, do action
    } else {
      console.log(false);
      //wrong, just close the frame 
    }
  }
  checkSelectedAnswer(){ // проверка для вопросов с вариантами ответов
    console.log(form.querySelector(':checked').value);
    let answer = form.querySelector(':checked').value;
    if (answer === result.result){
      console.log(true);
      // correct, do action
    } else {
      console.log(false);
      //wrong, just close the frame 
    }
  }
}

let levelLanguage = new Helpers().chooseLanguage(languages);

//тест разных способностей

//new Incantations().heal();
//new Incantations().attack();
//new Incantations().shield();
//new Tasks().calculator();
