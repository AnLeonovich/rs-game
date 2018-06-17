import { ATTACK_POWER, SHIELD_POWER, HEAL_POWER, PLAYER_MAX_HEALTH } from './const'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';
import $ from 'jquery';
require('jquery-ui');
require('jquery-ui/ui/widgets/sortable');
require('jquery-ui/ui/widgets/draggable');
require('jquery-ui/ui/disable-selection');
import _ from 'lodash';
import vocabulary from '../assets/vocabularies/vocabulary.json';
import audioVocabulary from '../assets/vocabularies/audioVocabulary.json';

import '../css/style.css';

import aQ from '../assets/questions/attackQuestions.json'
import sQ from '../assets/questions/shieldQuestions.json'
import hQ from '../assets/questions/healQuestions.json'
import vocabularyReverse from '../assets/vocabularies/vocabularyReverse.json'
import smallQuestions from '../assets/questions/smallQuestions.json'
import countQuestions from '../assets/questions/countQuestions.json'
import nameQuestions from '../assets/questions/nameTask.json'
import addWordQuestions from '../assets/questions/addWordTask.json'
import celebritiesQuestions from '../assets/questions/celebritiesQuestions.json'
import ddQuestions from '../assets/questions/d&dQuestions.json'

let result;
let answerArray = [];
const englishVocab = vocabulary.english; //get english vocabulary
const SUPER_ATTACK_POWER = 60;
let languages = [/*'javaScript', 'css', */'html'/*, 'c++', 'java', 'php', 'ruby', 'python3'*/]; // ЯП для монстров (уровней)
let taskField;
let main = document.querySelector('main'),
  body = $('body');
let attackQuestions, shieldQuestions, healQuestions, monstersPhrases; // массивы вопросов (чтобы исключить повторение вопросов)
let answerButtom; // кнопка "отправки" ответа, создается в процессе отображения задачи
const spellsPower = { // силы способностей (будем тестировать)
  attack: 40,
  shield: 50,
  heal: 30,
  helper: {
    health: 40,
    attack: 15,
  },
  multipleAttack: 20,
};
let player, monster; // объекты игрока и монстра
let level = 4;
let levelLanguage;
let spell, modal;
let gameBackground,
  selectedOffice,
  offices = ['office-0', 'office-1', 'office-2', 'office-3', 'office-4', "office-5"],
  fullGameBody = `<div class="game-background">
  <div class="door door-left"></div>
  <div class="door door-right"></div>
  <div class='hero-container'>
    <div class="hero-health__wrapper">
      <div class='hero-health-scale'>
        <span class='hero-health-scale__number'></span>
      </div>
    </div>
  </div>
  <div class="monster-container">
    <div class="monster-health__wrapper">
      <div class='monster-health-scale'>
        <span class='monster-health-scale__number'></span>
      </div>
    </div>
    <div class="monster-head-container"></div>
    <div class="monster-body-container"><p class="monster-name"></p></div>
    <div class="monster-legs-container"></div>
  </div>
</div>`,
  rightDoorGameBody = `<div class="game-background game-background-mirror">
  <nav>
  <div class="humburger-btn-wrapper" id="humbergerBtn">
    <div class="humburger-btn-line"></div>
    <div class="humburger-btn-line"></div>
    <div class="humburger-btn-line"></div>
  </div>
</nav>
<div class="door door-right door-right-reception"></div>
<div class="hero-container"></div>
</div>
<div class='dialog' id='dialog'>
<p class='dialog__message' id='message'></p>
<button type="button" class="dialog__button" id = 'dialogButton'>Start</button>
</div>`;

let leftDoorGameBody = `<div class="game-background">
<nav>
<div class="humburger-btn-wrapper" id="humbergerBtn">
  <div class="humburger-btn-line"></div>
  <div class="humburger-btn-line"></div>
  <div class="humburger-btn-line"></div>
</div>
</nav>
<div class="door door-left door-left-boss"></div>
<div class="hero-container"></div>
</div>
<div class='dialog' id='dialog'>
                       <p class='dialog__message' id='message'></p>
                       <button type="button" class="dialog__button" id = 'dialogButton'>Start</button>
                     </div>`;

const heroesArray = ["hero-1", "hero-2", "hero-3", "hero-4"];

const monsterHeadContainer = $(".monster-head-container"),
  monsterBodyContainer = $(".monster-body-container"),
  monsterLegsContainer = $(".monster-legs-container"),
  monsterHeadArray = ["monster-head-1", "monster-head-2", "monster-head-3", "monster-head-4"],
  monsterBodyArray = ["monster-body-1", "monster-body-2", "monster-body-3", "monster-body-4", "monster-body-5"],
  monsterLegsArray = ["monster-legs-1", "monster-legs-2", "monster-legs-3"];

const roleArray = ["Project Manager", "Product Owner", "Scrum Master", "Team Lead", "Key Developer"],
  nameArray = ["Jack", "Tom", "Dzmitry", "Abishek", "Alyaxey", "Richard", "John", "Kiran", "Yauheniy"],
  secondNameArray = ["Jones", "Abhishek", "Smith", "Brown", "Ivanou", "Hill", "Omar", "Clark"];


let receptionHTML = `<div class="game-background game-background-mirror">
                       <div class="door door-right"></div>
                       <div class="hero-container"></div>
                     </div>
                     <div class='dialog' id='dialog'>
                       <p class='dialog__message' id='message'></p>
                       <button type="button" class="dialog__button" id = 'dialogButton'>Start</button>
                     </div>`

let sideNavHTML = `                        <div class="sidenav">
<btn class="close-btn" id="closeBtn">&#10006;</btn>
<ul class="sidenav-list">
  <li id="officeColors">Office Colors</li>
  <li id="soundSettings">Sound</li>
  <li id="bestResults">Best Results</li>
  <li id="rules">Rules</li>
</ul>
</div>                       `;
let officesSettingsHTML = `<div class="menu-modal">
                            <div class="menu-modal-content-wrapper">
                              <div class="menu-modal-content">
                                <div class="menu-modal-caption">
                                  <btn class="close-btn menu-close-btn" id="closeOffices">&#10006;</btn>
                                  <h1>Select Office Color</h1>
                                </div>
                                <div class="menu-modal-section">
                                  <div class="offices-grid">
                                    <div class="offices-row-1">
                                      <div class="office-option office-option-1-1 selected"></div>
                                      <div class="office-option office-option-1-2"></div>
                                      <div class="office-option office-option-1-3"></div>
                                      <div class="office-option office-option-1-4"></div>
                                    </div>
                                    <div class="offices-row-2">
                                      <div class="office-option office-option-2-1"></div>
                                      <div class="office-option office-option-2-2"></div>
                                      <div class="office-option office-option-2-3"></div>
                                  </div>
                                </div>
                                <div class="menu-modal-submit-wrapper">
                                  <button type="button" class="btn btn-danger menu-btn" id="saveOfficeBtn">Save</button>
                                </div>
                              </div>
                            </div>
                          </div>`;

let resultsTableHTML = `
                          <div class="menu-modal">
                            <div class="menu-modal-content-wrapper">
                              <div class="menu-modal-content">
                                <div class="menu-modal-caption">
                                  <btn class="close-btn menu-close-btn" id="closeResults">&#10006;</btn>
                                  <h1>Best Results</h1>
                                </div>
                                <div class="menu-modal-section result-modal-content">
                                
                                <table>
                                    <thead>
                                        <tr class="table-header">
                                            <th>#</th>
                                            <th>User Name</th>
                                            <th>Result</th>
                                        </tr>
                                    </thead>
                                    <tbody id="resultsTable">
                                    </tbody>
                                </table>
                               
                                </div>
                              </div>
                            </div>`;

let soundSettingsHTML = `<div class="menu-modal">
<div class="menu-modal-content-wrapper">
  <div class="menu-modal-content">
  <div class="menu-modal-caption">
  <btn class="close-btn menu-close-btn" id="closeSound">&#10006;</btn>
  <h1>Sound Settings</h1>
</div>
    <div class="menu-modal-section">
      <div class="sound-grid">
        <div class="volume-column">
          <div class="sound-wrapper">
            <div class="map-slider">
              <div class="buttons">
                <span class="fa fa-plus" id="volumePlusBtn"></span>
                <div class="drag-line">
                  <div class="line" id="volumeLine"></div> 
                  <div class="draggable-button" id="volumeBtn"></div>   
                </div>
                <div class="draggable-buton" id="volumeBtn"></div>   
                <span class="fa fa-minus" id="volumeMinusBtn"></span>
              </div>
            </div>
          </div>
          <h2 class="sound-caption">Select volume level for a game</h2>
        </div>
        <div class="speed-column">
          <div class="sound-wrapper">
            <div class="map-slider">
              <div class="buttons">
                <span class="fa fa-plus" id="speedPlusBtn"></span>
                <div class="drag-line">
                  <div class="line" id="speedLine"></div> 
                  <div class="draggable-button" id="speedBtn"></div>   
                </div>
                <div class="draggable-buton" id="speedBtn"></div>   
                <span class="fa fa-minus" id="speedMinusBtn"></span>
              </div>
            </div>
          </div>
          <h2 class="sound-caption">Select speech speed for a game</h2>
        </div>
      </div>
    </div>
    <div class="menu-modal-submit-wrapper">
      <button type="button" class="btn btn-danger menu-btn" id="saveSoundBtn">Save</button>
    </div>
  </div>
</div>
</div>`;

let playAganBtnHTML = `
<div class="menu-modal-submit-wrapper">
<button type="button" class="btn btn-danger menu-btn" id="playAgainBtn">Play Again</button>
</div>`;

let rulesHTML = `<div class="menu-modal">
  <div class="menu-modal-content-wrapper">
    <div class="menu-modal-content">
      <div class="menu-modal-caption">
        <btn class="close-btn menu-close-btn" id="closeSound">&#10006;</btn>
        <h1>Rules</h1>
      </div>
    <div class="menu-modal-section">
      <div class='rules-wrapper'>
        <p>In this game you are a programmer trying to get a job in the 'Company name'.</p>
        <p>You need to complete 5 levels to win. In each level you will come across a "monster" who will test your knowledge in some programming language.</p>
        <p>Use spells to inflict damage or to protect and heal yourself.</p>
        <p>After choosing a spell, you will be given a task. The spell will apply only if your answer is correct. Don't forget to read tasks rules carefully.</p>
        <p>You go first. After your turn a monster does his spell (regardless of the correctness of your answer). Monster can heal and protect himself or attack you (but always in 40 points). With each level the monster's health will increase.</p>
        <p>To win the level you must lower the monster's health to zero.</p>
        <p>Use the doors to go to new levels.</p>
        <p>Good luck!</p>
      </div>
    </div>
  </div>
</div>`;
let lineHeight,
  marginTop;

let synth = window.speechSynthesis;
let officeColors = ["white", "blue", "green", "red", "pink", "mint", "purple"],
  gameColor = officeColors[0];
let voices,
  volume = 1,
  rate = 1;
let blitzCount = false;
let blitzPower = 0;
let text;
let doSuper;
let levelFinished;
let description;
let soundLevels = [
  { 0: 1 },
  { 20: 0.9 },
  { 40: 0.8 },
  { 60: 0.7 },
  { 80: 0.6 },
  { 100: 0.5 },
  { 120: 0.3 },
  { 140: 0.1 },
  { 160: 0 }
],
  soundLevel = volume;
const bossOffice = "office-6";
/*const ATTACK_POWER = 40;
const SHIELD_POWER = 50;
const HEAL_POWER = 30;
const PLAYER_MAX_HEALTH = 100;*/

class Player { // класс игрока
  constructor(name, character) {
    this.name = name;
    this.health = 100;
    this.spells = ['attack', 'shield', 'heal', 'helper', 'multipleAttack'];
    this.character = character; // ссылка на выбранного персонажа;
    this.helper;
    this.shield = 0;
    this.levelPass = 0;
    this.super = 0;
  }
}

class Office {
  constructor(background, doors) {
    this.background = background;
    this.doors = doors;
  };
  createOffice() {
    if (this.doors === 2) {
      // main.innerHTML = fullGameBody;
      gameBackground = $('.game-background');
      gameBackground.addClass(this.background);
      gameBackground.css('background-image', `url("assets/img/office-background/${gameColor}-offices/${this.background}.png")`);
    } else if (this.doors === "right") {
      main.classList.add('wrapper__reception');
      main.innerHTML = rightDoorGameBody;
      gameBackground = $('.game-background');
      gameBackground.addClass(this.background);
      gameBackground.css('background-image', `url("assets/img/office-background/${gameColor}-offices/${this.background}.png")`);
      new Door($(".door-right")).openDoor();
    } else {
      main.classList.add('wrapper__reception');
      main.innerHTML = leftDoorGameBody;
      gameBackground = $('.game-background');
      gameBackground.addClass(this.background);
      gameBackground.css('background-image', `url("assets/img/office-background/${gameColor}-offices/${this.background}.png")`);
      // new Door($(".door-left")); 
    }
  };
}

class SoundSlider {
  constructor(soundLine, soundBtn, minusBtn, plusBtn) {
    this.soundLine = soundLine;
    this.soundBtn = soundBtn;
    this.minusBtn = minusBtn;
    this.plusBtn = plusBtn;
    this.soundLevel;
  };
  createSoundSlider() {
    lineHeight = ($(this.soundLine).height());
    let sliderSoundLine = this.soundLine,
      sliderSoundBtn = this.soundBtn,
      sliderMinusBtn = this.minusBtn,
      sliderPlusBtn = this.plusBtn;

    $(sliderSoundBtn).draggable({
      axis: 'y',
      containment: 'parent'
    });

    // let moveSlider = (movePosition) => {
    //   let position = currentPosition,
    //     marginTop = position.top,
    //     soundLevel = marginTop + movePosition;

    //   $(sliderSoundLine).css({
    //     'clip': 'rect(' + soundLevel + 'px,8px, 183px,0px)'
    //   });
    // }

    $(sliderSoundBtn).on('drag', function () {
      // moveSlider();
      let position = $(sliderSoundBtn).position(),
        marginTop = position.top,
        soundLevel = marginTop;

      $(sliderSoundLine).css({
        'clip': 'rect(' + marginTop + 'px,8px, 183px,0px)'
      });
    });


    $(sliderMinusBtn).on('click', function () {
      let position = $(sliderSoundBtn).position(),
        marginTop = position.top,
        soundLevel = marginTop + 20;

      $(sliderSoundLine).css({
        'clip': 'rect(' + (marginTop + 20) + 'px,8px, 183px,0px)'
      });

      if (marginTop < lineHeight - 28) {
        $(sliderSoundBtn).css({
          'top': marginTop + 20
        });
        console.log(soundLevel);
      } else {
        soundLevel = lineHeight - 10;
        console.log(soundLevel);
      }
    });

    $(sliderPlusBtn).on('click', function () {
      let position = $(sliderSoundBtn).position();
      marginTop = position.top;
      soundLevel = marginTop - 20;

      $(sliderSoundLine).css({
        'clip': 'rect(' + (marginTop - 20) + 'px,8px, 183px,0px)'
      });

      if (marginTop > 0) {
        console.log(soundLevel);
        $(sliderSoundBtn).css({
          'top': marginTop - 20
        });
      }

      if (marginTop > lineHeight - 38) {
        soundLevel = lineHeight - 40;
        console.log(soundLevel);
      }
    }
    );

  }
  getSoundSetting(sliderSoundBtn) {
    for (let i in soundLevels) {
      let sliderPosition = $(sliderSoundBtn).position().top;
      soundLevel = new Helpers().roundToTwenty(sliderPosition, 20, 0);
      if (soundLevel === Number(Object.keys(soundLevels[i]))) {
        return soundLevels[i][Number(Object.keys(soundLevels[i]))];
      }
    }
  }
}

class SideNav {
  constructor() { };
  createSideNav(level, levelLanguage) {
    $(".game-background").append(sideNavHTML);

    $("#humbergerBtn").click(() => {
      $(".background-opacity-wrapper").addClass("background-opacity-wrapper-width");
      $(".sidenav").addClass("sidenav-width");
    });

    $("#closeBtn").click(() => {
      $(".background-opacity-wrapper").removeClass("background-opacity-wrapper-width");
      $(".sidenav").removeClass("sidenav-width");
    });

    $('#officeColors').click(() => {
      this.showOfficeSelector();
    })

    $('#soundSettings').click(() => {
      this.showSoundSelector();
    });

    $("#bestResults").click(() => {
      this.showResults(true);
    });
    $('#rules').click(() => {
      this.showRules();
    });
  }
  showOfficeSelector() {
    $(".game-background").append(officesSettingsHTML);
    let officesArray = $(".office-option").toArray();
    for (let i in officesArray) {
      $(officesArray[i]).css('background-image', `url("assets/img/office-background/${officeColors[i]}-offices/${selectedOffice}.png")`);
      $(officesArray[i]).click(new Helpers().selectElement);
    }

    $("#saveOfficeBtn").click(() => {
      let selectedBgd = $(".selected").css("background-image");
      gameColor = selectedBgd.match("(?<=background\/)(.*)(?=-offices)")[0];
      gameBackground.css("background-image", selectedBgd);
      $(".menu-modal").remove();
      $(".background-opacity-wrapper").removeClass("background-opacity-wrapper-width");
      $(".sidenav").removeClass("sidenav-width");
    }
    )

    this.closeMenuModal("#closeOffices");
  }
  showSoundSelector() {
    $(".game-background").append(soundSettingsHTML);

    let volumeSlider = new SoundSlider("#volumeLine", "#volumeBtn", "#volumeMinusBtn", "#volumePlusBtn");
    let speedSlider = new SoundSlider("#speedLine", "#speedBtn", "#speedMinusBtn", "#speedPlusBtn");
    volumeSlider.createSoundSlider();
    speedSlider.createSoundSlider();

    $("#saveSoundBtn").click(() => {
      volume = volumeSlider.getSoundSetting("#volumeBtn");
      rate = speedSlider.getSoundSetting("#speedBtn");
      $(".menu-modal").remove();
      $(".background-opacity-wrapper").removeClass("background-opacity-wrapper-width");
      $(".sidenav").removeClass("sidenav-width");
      console.log(volume, rate);
    });

    this.closeMenuModal("#closeSound");
  }
  showRules() {
    $(".game-background").append(rulesHTML);
    this.closeMenuModal("#closeSound");
  }
  showResults(btn) {
    new ResultsTable().showResults();
    this.closeMenuModal("#closeResults");
    if (btn) {
      this.addPlayAgainBtn();
    }
  }
  closeMenuModal(closeBtn) {
    $(closeBtn).click(() => {
      $(".menu-modal").remove();
      $(".background-opacity-wrapper").removeClass("background-opacity-wrapper-width");
      //$(".sidenav").removeClass("sidenav-width");
    })
  }
  addPlayAgainBtn() {
    $(".menu-modal-content").append(playAganBtnHTML);
    $("#playAgainBtn").click(
      new createPage().greeting()
    )
  }
}

class createPage { // класс для создания страниц (скорее всего, все уровни будут создаваться одним методом level)
  constructor() { }
  greeting() {
    const characters = document.getElementById('characters');
    Array.from(characters.children).forEach(div => {
      div.addEventListener('click', new Helpers().selectElement)
    });
    const startButton = document.getElementById('startGame');
    startButton.addEventListener('click', new createPage().reception);
  }
  reception() { // страница ресепшена 
    new Helpers().createPlayer();
    document.querySelector('body').style.overflow = 'hidden';
    selectedOffice = offices[0];
    new Office(offices[0], "right").createOffice();
    new SideNav().createSideNav();
    $(".hero-container").addClass(player.character).addClass("hero-container-mirror");
    offices.splice(0, 1); //delete reception from office list, this array will be used for random office generation

    let rDoor = document.querySelector('.door-right');
    rDoor.addEventListener('click', function () {
      //new Door(rDoor).openDoor();
      synth.cancel(); //stops reading
      setTimeout(new createPage().level, 1500);
    });

    setTimeout(function () {
      let dialogText = new Dialogs().instructions();
      new dialogActions().showDialog(dialogText, 'female');
    }, 200);
  }
  level() { // страница уровня
    level++;
    levelFinished = false;
    levelLanguage = new Helpers().chooseLanguage(languages);
    main.innerHTML = `<div class = "background-opacity-wrapper"> </div>
                      <div class="game-background">
                      <nav>
                        <div class="humburger-btn-wrapper" id="humbergerBtn">
                          <div class="humburger-btn-line"></div>
                          <div class="humburger-btn-line"></div>
                          <div class="humburger-btn-line"></div>
                        </div>
                        <h1 class='level__caption'>Level ${level} - ${levelLanguage}</h1>
                      </nav>
                        <ul class='spells'>

                          <li class='spell attack'><p class='spell_wrapper'><span class='spell__name'>Attack</span><span class='spell__description'>40 damage to monster</span></li>
                          <li class='spell shield'><p class='spell_wrapper'><span class='spell__name'>Shield</span><span class='spell__description'>+50 to your defense (absorbs damage)</span></li>
                          <li class='spell heal'><p class='spell_wrapper'><span class='spell__name'>Heal</span><span class='spell__description'>+30 to your health</span></li>
                          <li class='spell blitzAttack'><p class='spell_wrapper'><span class='spell__name'>Blitz Attack</span><span class='spell__description'>3 tasks, each gives +20 to your attack power (max is 60)</span></li>
                          <li class='spell super blockSuper'><p class='spell_wrapper'><span class='spell__name'>Super Attack</span><span class='spell__description'>60 damage to monster. Available when the yellow scale is full</span></li>
                        <li class='tips-background'></li>
                        </ul>
                        <div class="door door-left"></div>
                        <div class="door door-right"></div>
                        <div class='hero-container'>
                          <div class="hero-health__wrapper">
                           <div class='hero-shield'>
                             <span>Shield: <span class='hero-shield__number'></span></span>
                           </div>
                            <div class='hero-health-scale'>
                              <span class='hero-health-scale__number'></span>
                            </div>
                            <div class='hero-super'>
                              <div class='hero-super_scale'>
                              </div>
                            </div>
                          </div>
                          <div class='hero-spell-vis'><img class='hero-spell-image'></div>
                        </div>
                        <div class="monster-container">
                          <div class="monster-head-container">
                            <div class="monster-health__wrapper">
                              <div class='monster-shield'>
                                <span>Shield: <span class='monster-shield__number'></span></span>
                              </div>                          
                              <div class='monster-health-scale'>
                                <span class='monster-health-scale__number'></span>
                              </div>
                            </div>
                          </div>
                          <div class="monster-body-container"><p class="monster-name"></p></div>
                          <div class="monster-legs-container">
                            <div class='monster-spell-vis'><img class='monster-spell-image'></div>
                          </div>
                        </div>
                        <div id="taskModal" class="modal">
                          <div class="task-modal-content">
                            <div class='task-task-content'>
                              <p class='task-task-description' id='taskDesc'></p>
                              <div class='task-task-text-wrapper'><p class='task-task-text' id='taskText'></p></div>
                            </div>
                            <div class='task-field' id='taskField'>
                              <div class='task-field-answer-container' id="taskFieldAnswer"></div>
                              <div class='answer'><span id='answer__correct' class='correct'></span><span id='answer__wrong' class='wrong'></span></div>
                            </div>
                          </div>
                        </div>                      
                        <div class='dialog' id = dialog>
                          <p class='dialog__message' id='message'></p>
                          <button type="button" class="dialog__button" id = 'dialogButton'>Close</button>
                        </div>
                      
                      </div> `; //нарисовать страницу

    selectedOffice = new Helpers().randomArrayElem(offices);
    new Office(selectedOffice, 2).createOffice(); //создает рандомный офис, пока закомментила, чтобы не мешать твоему innerHTML
    $(".hero-container").addClass(player.character);
    new MonsterGenerator($(".monster-head-container"), $(".monster-body-container"), $(".monster-legs-container"), ).generateMonster(monsterHeadArray, monsterBodyArray, monsterLegsArray);

    //side-nav
    new SideNav().createSideNav(level, levelLanguage);

    monster = new Monster(level);
    taskField = document.getElementById('taskFieldAnswer');
    document.querySelector('.monster-health__wrapper').style.width = `${200 + 20 * level}px`;
    document.querySelector('.hero-health-scale__number').innerHTML = player.health;
    document.querySelector('.monster-health-scale__number').innerHTML = monster.health;
    document.querySelector('.hero-shield__number').innerHTML = player.shield;
    document.querySelector('.monster-shield__number').innerHTML = monster.shield;
    gameBackground.addClass(new Helpers().randomArrayElem(offices));
    text = document.getElementById('taskText');
    description = document.getElementById('taskDesc');
    monstersPhrases = new Dialogs().monstersPhrasesLevelStart();
    if (level === 5) {
      monstersPhrases = new Dialogs().monstersPhrasesFinal();
    }
    setTimeout(function () {
      let dialogText = new Helpers().randomArrayElem(monstersPhrases);
      new dialogActions().showDialog([dialogText]);
    }, 1000);

    let magic = document.querySelector('.spells');
    Array.from(magic.children).forEach(div => {
      div.addEventListener('click', e => {
        spell = e.target.classList[1];
        if (spell !== 'super') {
          document.querySelector('.spells').classList.toggle('showSpells');
          modal = document.getElementById('taskModal');
          modal.style.display = 'block';
          new Spells()[spell]();
        }
      });
    });
  }
  endGame() {
    // new Helpers().createPlayer();
    level = 'boss';
    selectedOffice = bossOffice;
    new Office(selectedOffice, "left").createOffice();
    new SideNav().createSideNav();
    setTimeout(function () {
      let dialogText = new Dialogs().boss();
      new dialogActions().showDialog([dialogText]);
    }, 500);
  }
}

class Helpers {
  constructor() { }
  randomNumber(max) { // генератор случайных чисел
    return Math.floor(Math.random() * max);
  }
  randomArrayElem(arr) { // взять из массива случайный элемент и удалить его из массива
    let index = new Helpers().randomNumber(arr.length - 1); // слуйный индекс
    return arr.splice(index, 1)[0]; // удаляем этот элемент из массива и возвращаем его 
  }
  chooseLanguage(languages) { // выбор языка для уровня
    let index = new Helpers().randomNumber(languages.length);
    let language = languages.splice(index, 1).toString();
    return language;
  }
  selectElement(e) {
    let current = document.querySelector('.selected');
    let elem = e.target;
    if (current) {
      current.classList.remove('selected');
    }
    if (elem.tagName === 'IMG') {
      elem = e.target.parentElement;
    };
    elem.classList.add('selected');
  };
  roundToTwenty(number, increment, offset) {
    return Math.ceil((number - offset) / increment) * increment + offset;
  };
  generateRandomArrayIndex(array) { // random index generator
    return _.random(0, array.length - 1, 0);
  };
  addRandomClass(target, sourceArray) {
    return target.addClass(sourceArray[this.generateRandomArrayIndex(sourceArray)]);
  }
  generateRandomObjProperty(obj) {
    let result,
      count = 0;
    for (let prop in obj)
      if (Math.random() < 1 / ++count)
        result = prop;
    return result;
  }
  createPlayer() { // создание объекта игрока
    let character = document.querySelector('.selected') ? document.querySelector('.selected').id : 'hero-2'; // если пользователь не выбрал персонажа - взять персонажа по умолчанию
    player = new Player(document.getElementById('name').value || 'Anonim', character);
  }
  createMonster() { } // сюда запихнем создание имени, тела, объекта 
  showIfAnswerCorrect() { // показывает Correct, если введенные ответ правильный
    new dialogActions().writeDialogText('answer__correct', ['Correct'], 100);
    if (blitzCount > 0) {
      blitzCount--;
      blitzPower += 20;
    }

    if (blitzCount === 0 || blitzCount === false) {
      setTimeout(function () {
        modal.style.display = 'none';
        text.innerHTML = '';
        document.getElementById('answer__correct').innerHTML = '';
        document.querySelector(".task-modal-content").classList.remove('options');
        document.querySelector(".task-modal-content").classList.remove('countTask');
        new doSpell()[spell]();
      }, 1500);
    } else {
      setTimeout(function () {
        modal.style.display = 'none';
        text.innerHTML = '';
        document.getElementById('answer__correct').innerHTML = '';
        document.querySelector(".task-modal-content").classList.remove('countTask');
      }, 1000);

      setTimeout(function () {
        new Spells().blitzAttack();
      }, 1500);
    }
  }
  showIfAnswerWrong() { // показывает Wrong, если введенные ответ не правильный
    new dialogActions().writeDialogText('answer__wrong', ['Wrong'], 100);
    if (blitzCount > 0) {
      blitzCount--;
    }
    if (blitzCount === false) {
      setTimeout(function () {
        modal.style.display = 'none';
        text.innerHTML = '';
        document.getElementById('answer__wrong').innerHTML = '';
        document.querySelector(".task-modal-content").classList.remove('options');
        document.querySelector(".task-modal-content").classList.remove('countTask');
        new monsterAttack();
      }, 1500);
    }
    if (doSuper === true) {
      doSuper = false;
      player.super = 0;
      document.querySelector(".task-modal-content").classList.remove('countTask');
      document.querySelector('.hero-super_scale').style.width = `${player.super}%`;
      new Helpers().blockSuperAttack();
    }
    if (blitzCount === 0) {
      setTimeout(function () {
        modal.style.display = 'none';
        text.innerHTML = '';
        document.getElementById('answer__wrong').innerHTML = '';
        document.querySelector(".task-modal-content").classList.remove('countTask');
        new doSpell()[spell]();
      }, 1500);
    } else if (blitzCount > 0) {
      setTimeout(function () {
        modal.style.display = 'none';
        text.innerHTML = '';
        document.getElementById('answer__wrong').innerHTML = '';
        document.querySelector(".task-modal-content").classList.remove('countTask');
      }, 1000);

      setTimeout(function () {
        new Spells().blitzAttack();
      }, 1500);
    }
  }
  setVoiceGender(reading, gender) {
    voices = synth.getVoices();
    (gender === 'female') ? reading.voice = _.find(voices, (o) => { return o.voiceURI === "Google UK English Female"; }) : reading.voice = _.find(voices, (o) => { return o.voiceURI === "Google UK English Male"; });
  }
  createReadableText(text) {
    let readableText = new SpeechSynthesisUtterance(text);
    readableText.volume = volume;
    readableText.rate = rate;
    return readableText;
  }
  unblockSuperAttack() {
    document.querySelector('.super').classList.toggle('blockSuper');
    document.querySelector('.hero-super').classList.toggle('super__full');
    document.querySelector('.super').addEventListener('click', new Helpers().superClick);
  }
  blockSuperAttack() {
    document.querySelector('.super').classList.toggle('blockSuper');
    document.querySelector('.hero-super').classList.toggle('super__full');
    document.querySelector('.super').removeEventListener('click', new Helpers().superClick);
  }
  superClick() {
    spell = 'superAttack';
    doSuper = true;
    document.querySelector('.spells').classList.toggle('showSpells');
    modal = document.getElementById('taskModal');
    modal.style.display = 'block';
    new Spells()[spell]();
  }
  randomTasksArray() {
    let arr = ['calculator', 'firstNumberInEquation', 'secondNumberInEquation'];
    if (Object.keys(englishVocab).length !== 0) {
      arr.push('translate');
    }
    if (Object.keys(audioVocabulary).length !== 0) {
      arr.push('audioTask');
    }
    if (vocabularyReverse.length !== 0) {
      arr.push('translateRUtoEN');
    }
    if (smallQuestions.length !== 0) {
      arr.push('trueAndFalseQuestions');
    }
    if (countQuestions.length !== 0) {
      arr.push('count');
    }
    if (nameQuestions.length !== 0) {
      arr.push('nameTheThing');
    }
    if (addWordQuestions.length !== 0) {
      arr.push('addWord');
    }
    if (celebritiesQuestions.length !== 0) {
      arr.push('chooseRightName');
    }
    if (ddQuestions.length !== 0) {
      arr.push('putInRightOrder');
    }
    return arr;
  }
}

class dialogActions { // методы окна диалога
  constructor() { }
  showDialog(text, gender) { //показать окно
    let dialogWrapper = document.getElementById('dialog');
    dialogWrapper.classList.toggle('dialog-active');
    let dialogButton = document.getElementById('dialogButton');
    dialogButton.addEventListener('click', new dialogActions().closeDialog);
    new dialogActions().writeDialogText('message', text, 50, gender);
  }
  writeDialogText(id, text, speed, gender) { // вывод текста 
    document.getElementById('message').innerHTML = '';
    let ele = document.getElementById(id),
      txt = text.join("").split("");
    let readDialogText = new Helpers().createReadableText(text);
    new Helpers().setVoiceGender(readDialogText, gender);

    synth.speak(readDialogText); //read dialog  
    let interval = setInterval(function () {
      if (!txt[0]) {
        return clearInterval(interval);
      };
      ele.innerHTML += txt.shift();
    }, speed != undefined ? speed : 100);
    return false;
  }
  closeDialog() { // закрыть окно
    synth.cancel(); //stop reading
    let dialogWrapper = document.getElementById('dialog');
    dialogWrapper.classList.toggle('dialog-active');
    if (level && levelFinished === false) {
      document.querySelector('.spells').classList.toggle('showSpells');
    }
    if (level === 'boss' || level === 'lose') {
      new SideNav().showResults(true);
    }
  }
}

class Tasks { // дополнитльные (рандомные) задания
  constructor() { }
  calculator() {
    let rules = `Calculate the result<br>If necessary, round the number to the nearest integer`; //правило на этот тип задач
    let signs = [' + ', ' - ', ' * ', ' / '];
    let str = new Helpers().randomNumber(100) + signs[new Helpers().randomNumber(4)] + new Helpers().randomNumber(100); // пример
    let res = Math.round(eval(str)).toString(); //результат    
    console.log('Answer ', res);
    new giveTask().showTaskSimple(rules, str, res); // выводим на экран
  }
  putInRightOrder() {
    let rules = `Put code parts in the right order`;
    let res = ddQuestions;
    console.log(res);
    let index = new Helpers().randomNumber(res.length); // генерируем рандомный индекс
    let answer = res[index]; // получаем массив с ответом
    let task = _.shuffle(res[index]);
    res.splice(index, 1); // удаляем этот вопрос из массива (вопросы не повторяются)
    new giveTask().showTaskOrder(rules, task, answer); // выводим на экран
  }
  translate() {
    let rules = `Translate the word into russian`;
    let task = new Helpers().generateRandomObjProperty(englishVocab),
      answer = englishVocab[task];
    new giveTask().showTaskSimple(rules, task, answer);
    delete englishVocab[task];
  }
  audioTask() {
    let rules = `Write what you hear`;

    let task = new Helpers().generateRandomObjProperty(audioVocabulary),
      answer = audioVocabulary[task];
    new giveTask().showTaskAudio(rules, task, answer);

  }
  translateRUtoEN() {
    let rules = `Translate the word into english`;
    let task = new Helpers().generateRandomObjProperty(vocabularyReverse),
      answer = vocabularyReverse[task];
    new giveTask().showTaskSimple(rules, task, answer);
    delete vocabularyReverse[task];
  }
  trueAndFalseQuestions() {
    let rules = `Select if the fact is true or false`;
    let question = new Helpers().randomArrayElem(smallQuestions);
    new giveTask().showTrueFalseTask(rules, question[0], question[1]);
  }
  count() {
    let rules = `Read the task and write the correct number`;
    let question = new Helpers().randomArrayElem(countQuestions);
    new giveTask().showCountTask(rules, question[0], question[1], question[2]);
  }
  nameTheThing() {
    let rules = `Write the name of what is shown in the picture (in English)`;
    let question = new Helpers().randomArrayElem(nameQuestions);
    new giveTask().showCountTask(rules, null, question[0], question[1]);
  }
  firstNumberInEquation() {
    let rules = `Write a number to make the equation correct`;
    let signs = [' + ', ' - ', ' * '];
    let a = new Helpers().randomNumber(100);
    let b = new Helpers().randomNumber(100);
    let sign = signs[new Helpers().randomNumber(3)];
    let res = eval(`${a} ${sign} ${b}`);
    let task = ` ${sign} ${b} = ${res}`;
    new giveTask().showTaskFirstInEquation(rules, task, a.toString());
  }
  secondNumberInEquation() {
    let rules = `Write a number to make the equation correct`;
    let signs = [' + ', ' - ', ' * '];
    let a = new Helpers().randomNumber(100);
    let b = new Helpers().randomNumber(100);
    let sign = signs[new Helpers().randomNumber(3)];
    let res = eval(`${a} ${sign} ${b}`);
    let firstPart = `${a} ${sign} `;
    let secondPart = ` = ${res}`;
    new giveTask().showTaskSecondInEquation(rules, firstPart, secondPart, b.toString());
  }
  addWord() {
    let rules = `Insert a word to get a sentence`;
    let question = new Helpers().randomArrayElem(addWordQuestions);
    new giveTask().showTaskAddWord(rules, question[0], question[1], question[2]);
  }
  chooseRightName() {
    let rules = `Select the name of the person in the photo`;
    let question = new Helpers().randomArrayElem(celebritiesQuestions);
    new giveTask().showTaskCelebrities(rules, question[0], question[1], question[2]);
  }
}

class Spells { // заклинания
  constructor() { } //в консоли пока отображаются ответы для задач
  attack() {
    if (!attackQuestions) {
      attackQuestions = aQ[levelLanguage]; // получаем массив в вопросами для данного уровня
    };
    let question = new Helpers().randomArrayElem(attackQuestions);
    console.log('Answer ', question[1]);
    let rules = aQ.rules; // правила для этого вида заклинаний
    new giveTask().showTaskSimple(rules, question[0], question[1]); // выводим вопрос
  }
  shield() {
    if (!shieldQuestions) {
      shieldQuestions = sQ[levelLanguage];
    }
    let question = new Helpers().randomArrayElem(shieldQuestions);
    console.log('Answer ', question[1]);
    let rules = sQ.rules;
    new giveTask().showTaskSimple(rules, question[0], question[1]);
  }
  heal() {
    if (!healQuestions) {
      healQuestions = hQ[levelLanguage];
    }
    let question = new Helpers().randomArrayElem(healQuestions);
    let rules = hQ.rules;
    new giveTask().showTaskWithOptions(rules, question[0], question[1], question[2]);
    console.log('Answer ', question[2]);
  }
  blitzAttack() {
    modal.style.display = 'block';
    let tasks = new Helpers().randomTasksArray();
    let task = new Helpers().randomArrayElem(tasks);
    if (!blitzCount) {
      blitzCount = 3;
    };
    new Tasks()[task]();
  }

  superAttack() {
    modal.style.display = 'block';
    let tasks = new Helpers().randomTasksArray();
    let task = new Helpers().randomArrayElem(tasks);
    new Tasks()[task]();
  }
}

class giveTask { // вывод вопросов на экран
  constructor() { }
  showTaskSimple(rules, task, answer) { // вопросы по схеме правило -> текст 
    taskField.innerHTML = `<input type="text" class='task__form_answer' autofocus>
    <input type="button" class='btn task-field-btn' value="Answer">`;
    answerButtom = document.querySelector('.btn');
    description.innerHTML = rules;
    text.innerHTML = task;
    result = new checkAnswer(answer); // создаем новый объект, в котором будет храниться ответ и проверяться ответ пользователя
    answerButtom.addEventListener('click', result.checkSimpleAnswer); // по клику - проверять результат
  }
  showTaskAudio(rules, task, answer) {
    taskField.innerHTML = `<input type="text" class='task__form_answer' autofocus>
    <input type="button" class='btn task-field-btn' value="Answer">`;

    let description = document.querySelector('#taskDesc'),
      text = document.querySelector('#taskText');

    answerButtom = document.querySelector('.btn');
    description.innerHTML = rules;

    text.innerHTML = `<input type="button" class='btn' id="audioBtn" value= "Click to listen">`;
    let audioBtn = $('#audioBtn');

    audioBtn.click(() => {
      let readTaskText = new SpeechSynthesisUtterance(task);
      synth.speak(readTaskText)
    });

    console.log(answer);
    result = new checkAnswer(answer); // создаем новый объект, в котором будет храниться ответ и проверяться ответ пользователя
    console.log(result);
    answerButtom.addEventListener('click', result.checkSimpleAnswer); // по клику - проверять результат
    delete audioVocabulary[task]; //delete alredy used question
  };
  showTaskWithOptions(rules, task, options, answer) { //вопросы по схеме правило -> варианты ответов 
    taskField.innerHTML = `<label class='options-label'><input type='radio' class='task__form_options' name='answer' value='${options[0]}'>${options[0]}</label>
                           <label class='options-label'><input type='radio' class='task__form_options' name='answer' value='${options[1]}'>${options[1]}</label>
                           <label class='options-label'><input type='radio' class='task__form_options' name='answer' value='${options[2]}'>${options[2]}</label>
                           <label class='options-label'><input type='radio' class='task__form_options' name='answer' value='${options[3]}'>${options[3]}</label>
                           <input type="button" class='btn task-field-btn' value="Answer">`;
    answerButtom = document.querySelector('.btn');
    document.querySelector(".task-modal-content").classList.add('options');
    description.innerHTML = rules;
    text.innerHTML = task;
    result = new checkAnswer(answer);
    answerButtom.addEventListener('click', result.checkSelectedAnswer);
  }
  showTaskOrder(rules, task, answer) {
    text.innerHTML = `<ul class="sortable task-filed-answer">
                        <li class="default" id="id_1">${task[0]}</li>
                        <li class="default" id="id_2">${task[1]}</li>
                        <li class="default" id="id_3">${task[2]}</li>
                        <li class="default" id="id_4">${task[3]}</li>
                        <li class="default" id="id_5">${task[4]}</li>
                        <li class="default" id="id_6">${task[5]}</li>
                        <li class="default" id="id_7">${task[6]}</li>
                        <li class="default" id="id_7">${task[7]}</li>
                        <li class="default" id="id_7">${task[8]}</li>
                      </ul>`;
    taskField.innerHTML = `<input type="button" class='btn task-field-btn' value="Answer">`;
    answerButtom = document.querySelector('.task-field-btn');
    description.innerHTML = rules;
    result = new checkAnswer(answer);
    $(function () {
      $(".sortable").sortable();
    });
    answerButtom.addEventListener('click', result.checkDroppedAnswer);


  }
  showTrueFalseTask(rules, task, answer) {
    taskField.innerHTML = `<label class='options-label'><input type='radio' class='task__form_options' name='answer' value='True'>True</label>
                           <label class='options-label'><input type='radio' class='task__form_options' name='answer' value='False'>False</label> 
                           <input type="button" class='btn task-field-btn' value="Answer">`;
    answerButtom = document.querySelector('.btn');
    document.querySelector(".task-modal-content").classList.add('options');
    description.innerHTML = rules;
    text.innerHTML = task;
    result = new checkAnswer(answer);
    answerButtom.addEventListener('click', result.checkSelectedAnswer);
  }
  showCountTask(rules, task, src, answer) {
    taskField.innerHTML = `<img src=${src} class='count-task'>
                            <input type="text" class='task__form_answer' autofocus>
                            <input type="button" class='btn task-field-btn' value="Answer">`;
    document.querySelector(".task-modal-content").classList.add('countTask');
    answerButtom = document.querySelector('.btn');
    description.innerHTML = rules;
    if (task !== null) {
      text.innerHTML = task;
    }
    result = new checkAnswer(answer);
    answerButtom.addEventListener('click', result.checkSimpleAnswer);
  }
  showTaskFirstInEquation(rules, task, answer) {
    taskField.innerHTML = `<label><input type="text" class='task__form_answer math' autofocus>${task}</label>
                          <input type="button" class='btn task-field-btn' value="Answer">`;
    answerButtom = document.querySelector('.btn');
    description.innerHTML = rules;
    console.log('Answer', answer);
    result = new checkAnswer(answer);
    answerButtom.addEventListener('click', result.checkSimpleAnswer);
  }
  showTaskSecondInEquation(rules, firstPart, secondPart, answer) {
    taskField.innerHTML = `<label>${firstPart}<input type="text" class='task__form_answer math' autofocus>${secondPart}</label>
                          <input type="button" class='btn task-field-btn' value="Answer">`;
    answerButtom = document.querySelector('.btn');
    description.innerHTML = rules;
    console.log('Answer', answer);
    result = new checkAnswer(answer);
    answerButtom.addEventListener('click', result.checkSimpleAnswer);
  }
  showTaskAddWord(rules, firstPart, secondPart, answer) {
    taskField.innerHTML = `<label>${firstPart}<input type="text" class='task__form_answer word' autofocus>${secondPart}</label>
                          <input type="button" class='btn task-field-btn' value="Answer">`;
    answerButtom = document.querySelector('.btn');
    description.innerHTML = rules;
    console.log('Answer', answer);
    result = new checkAnswer(answer);
    answerButtom.addEventListener('click', result.checkSimpleAnswer);
  }
  showTaskCelebrities(rules, src, options, answer) {
    taskField.innerHTML = `<img src=${src} class='celebrities-task'>
                           <div class='options-wrapper'>
                           <label class='options-label'><input type='radio' class='task__form_options' name='answer' value='${options[0]}'>${options[0]}</label>
                           <label class='options-label'><input type='radio' class='task__form_options' name='answer' value='${options[1]}'>${options[1]}</label>
                           <label class='options-label'><input type='radio' class='task__form_options' name='answer' value='${options[2]}'>${options[2]}</label>
                           <label class='options-label'><input type='radio' class='task__form_options' name='answer' value='${options[3]}'>${options[3]}</label>
                           <input type="button" class='btn task-field-btn' value="Answer">
                           </div>`;
    answerButtom = document.querySelector('.btn');
    document.querySelector(".task-modal-content").classList.add('countTask');
    description.innerHTML = rules;
    result = new checkAnswer(answer); // создаем новый объект, в котором будет храниться ответ и проверяться ответ пользователя
    answerButtom.addEventListener('click', result.checkSelectedAnswer);
  }
}

class checkAnswer { // класс проверки ответов
  constructor(res) {
    this.result = res; // при создании запоминаем правильный ответ из условия 
  }
  checkSimpleAnswer() { // проверка для обычного текстового ответа
    let answer = document.querySelector('.task__form_answer').value.replace(/(^\s*)|(\s*)$/g, '').toLowerCase();
    if (typeof result.result === 'string') {
      if (answer === result.result) {
        new Helpers().showIfAnswerCorrect();
      } else {
        new Helpers().showIfAnswerWrong();
      }
    }
    if (typeof result.result === 'object') {
      for (let i in result.result) {
        if (_.lowerCase(result.result[i]) === answer) {
          return new Helpers().showIfAnswerCorrect();
        }
      }
      return new Helpers().showIfAnswerWrong();
    }
  }
  checkSelectedAnswer() { // проверка для вопросов с вариантами ответов
    let answer = taskField.querySelector(':checked') || '';
    if (answer.value === result.result) {
      new Helpers().showIfAnswerCorrect();
    } else {
      new Helpers().showIfAnswerWrong();
    }
  }
  checkDroppedAnswer() {
    let children = $('.sortable').sortable('refreshPositions').children();
    $.each(children, function () {
      answerArray.push($(this).text().trim());
    });
    if (_.isEqual(answerArray, result.result)) {
      answerArray = [];
      new Helpers().showIfAnswerCorrect();
    } else {
      answerArray = [];
      new Helpers().showIfAnswerWrong();
    }
  }
}


class showSpell {
  constructor() { }
  attack(who) {
    let wrapper = document.querySelector(`.${who}-spell-vis`);
    let image = document.querySelector(`.${who}-spell-image`);
    wrapper.style.width = '140px';
    wrapper.style.height = '140px';
    wrapper.style.left = document.querySelector(`.${who}-container`).offsetWidth / 2 - 70 + 'px';
    image.style.display = 'block';
    image.src = '../assets/img/spells/Exattack.png';
    image.style.width = '1200%';
    image.style.height = '100%';

    let attack = setInterval(() => {
      let now = parseInt(image.style.left) || 0;
      image.style.left = now - 100 + '%';
    }, 50);

    setTimeout(function () {
      clearInterval(attack);
      image.style.display = 'none';
      image.style.left = 0;
      image.style.top = 0;
    }, 500);
  }
  shield(who) {
    let wrapper = document.querySelector(`.${who}-spell-vis`);
    let image = document.querySelector(`.${who}-spell-image`);
    wrapper.style.width = '150px';
    wrapper.style.height = '160px';
    wrapper.style.left = document.querySelector(`.${who}-container`).offsetWidth / 2 - 75 + 'px';
    image.style.display = 'block';
    image.src = '../assets/img/spells/Exshield.png';
    image.style.width = '1048px';
    image.style.height = '472px';

    let shield = setInterval(() => {
      let now = parseInt(image.style.left) || 0;

      if (now === -900) {
        let top = parseInt(image.style.top) || 0;
        image.style.top = top - 160 + 'px';
        now = 150;
      }
      image.style.left = now - 150 + 'px';
    }, 100);

    setTimeout(function () {
      clearInterval(shield);
      image.style.display = 'none';
      image.style.left = 0;
      image.style.top = 0;
    }, 1900);
  }
  heal(who) {
    let wrapper = document.querySelector(`.${who}-spell-vis`);
    let image = document.querySelector(`.${who}-spell-image`);
    wrapper.style.width = '215px';
    wrapper.style.height = '220px';
    wrapper.style.left = document.querySelector(`.${who}-container`).offsetWidth / 2 - 108 + 'px';
    image.style.display = 'block';
    image.src = '../assets/img/spells/Exheal.png';
    image.style.width = '870px';
    image.style.height = '673px';


    let heal = setInterval(() => {
      let now = parseInt(image.style.left) || 0;

      if (now === -645) {
        let top = parseInt(image.style.top) || 0;

        image.style.top = top - 220 + 'px';
        now = 215;
      }
      image.style.left = now - 215 + 'px';
    }, 100);
    setTimeout(function () {
      clearInterval(heal);
      image.style.display = 'none';
      image.style.left = 0;
      image.style.top = 0;
    }, 1000);
  }
}
class doSpell { // игрок применяет заклинание
  constructor() { }
  attack(power) {
    let audio = new Audio(`../assets/sounds/attack/${new Helpers().randomNumber(9)}.mp4`);
    audio.play();
    //let force = ATTACK_POWER;
    let force = 200;
    new showSpell().attack('monster');
    if (power !== undefined) {
      force = power;
    }
    if (!monster.shield) {
      monster.health -= force;
    }
    if (monster.shield) {
      if (monster.shield < force) {
        monster.health += monster.shield;
        monster.shield = 0;
        monster.health -= force;
      }
      if (monster.shield > force) {
        monster.shield -= force;
      }
    }
    player.super += 20;
    if (player.super > 100) {
      player.super = 100;
    }
    document.querySelector('.hero-super_scale').style.width = `${player.super}%`;
    if (player.super === 20) {
      new Helpers().unblockSuperAttack();
    }
    if (monster.health <= 0) {
      monster.health = 0;
      document.querySelector('.monster-health-scale').style.width = `${monster.health}%`;
      document.querySelector('.monster-health-scale__number').innerHTML = monster.health;
      if (level < 5) {
        setTimeout(() => {
          new levelResults().win();
        }, 2000);
      }
      if (level === 5) {
        setTimeout(() => {
          new levelResults().winGame();
        }, 2000);
      }
    };
    if (monster.health > 0) {
      document.querySelector('.monster-health-scale').style.width = `${monster.health * 100 / (100 + 20 * level)}%`;
      document.querySelector('.monster-health-scale').style.marginLeft = `${100 - monster.health * 100 / (100 + 20 * level)}%`;
      document.querySelector('.monster-health-scale__number').innerHTML = monster.health;
      document.querySelector('.monster-shield__number').innerHTML = monster.shield;
      setTimeout(() => {
        new monsterAttack();
      }, 2000);
    };
  }
  shield() {
    let audio = new Audio(`../assets/sounds/shield/${new Helpers().randomNumber(5)}.mp4`);
    audio.play();
    player.shield += SHIELD_POWER;
    document.querySelector('.hero-shield__number').innerHTML = player.shield;
    new showSpell().shield('hero');
    setTimeout(() => {
      new monsterAttack();
    }, 2000);
  }
  heal() {
    let audio = new Audio(`../assets/sounds/heal/${new Helpers().randomNumber(7)}.mp4`);
    audio.play();
    if (player.health < PLAYER_MAX_HEALTH) {
      player.health += HEAL_POWER;
      if (player.health > PLAYER_MAX_HEALTH) {
        player.health = PLAYER_MAX_HEALTH;
      }
    }
    new showSpell().heal('hero');
    document.querySelector('.hero-health-scale').style.width = `${player.health}%`;
    document.querySelector('.hero-health-scale__number').innerHTML = player.health;
    setTimeout(() => {
      new monsterAttack();
    }, 2000);
  }
  blitzAttack() {
    new doSpell().attack(blitzPower);
    blitzCount = false;
    blitzPower = 0;
  }
  superAttack() {
    new doSpell().attack(SUPER_ATTACK_POWER);
    player.super = 0;
    doSuper = false;
    document.querySelector('.hero-super_scale').style.width = `${player.super}%`;
    new Helpers().blockSuperAttack();
  }
}

class monsterAttack { // монстр выбирает рандомную способность и применяет
  constructor() {
    this.spells = ['attack'];
    if (monster.shield === 0) {
      this.spells.push('shield');
    }
    if (monster.health < (100 + 20 * level)) {
      this.spells.push('heal');
    };
    let spell = this.spells[new Helpers().randomNumber(this.spells.length)];
    setTimeout(this[spell], 1000);
  }
  attack() {
    let audio = new Audio(`../assets/sounds/attack/${new Helpers().randomNumber(9)}.mp4`);
    audio.play();
    new showSpell().attack('hero');
    if (!player.shield) {
      player.health -= ATTACK_POWER;
    }
    if (player.shield) {
      if (player.shield < ATTACK_POWER) {
        player.health += player.shield;
        player.shield = 0;
        player.health -= ATTACK_POWER;
      }
      if (player.shield > ATTACK_POWER) {
        player.shield -= ATTACK_POWER;
      }
    }
    if (player.health <= 0) {
      player.health = 0;
      // запустить страницу проигрыша с таблицей рекордов
      document.querySelector('.hero-health-scale').style.width = `${player.health}%`;
      document.querySelector('.hero-health-scale__number').innerHTML = player.health;
      document.querySelector('.hero-shield__number').innerHTML = player.shield;
      setTimeout(() => {
        new levelResults().lose();
      }, 2000);
    };
    if (player.health > 0) {
      document.querySelector('.hero-health-scale').style.width = `${player.health}%`;
      document.querySelector('.hero-health-scale__number').innerHTML = player.health;
      document.querySelector('.hero-shield__number').innerHTML = player.shield;
      setTimeout(function () {
        document.querySelector('.spells').classList.toggle('showSpells');
      }, 1000);
    }
  }
  shield() {
    let audio = new Audio(`../assets/sounds/shield/${new Helpers().randomNumber(5)}.mp4`);
    audio.play();
    monster.shield += SHIELD_POWER;
    document.querySelector('.monster-shield__number').innerHTML = monster.shield;
    new showSpell().shield('monster');
    setTimeout(function () {
      document.querySelector('.spells').classList.toggle('showSpells');
    }, 1000);
  }
  heal() {
    let audio = new Audio(`../assets/sounds/heal/${new Helpers().randomNumber(7)}.mp4`);
    audio.play();
    monster.health += HEAL_POWER;
    if (monster.health > (100 + 20 * level)) {
      monster.health = 100 + 20 * level;
    };
    document.querySelector('.monster-health-scale').style.width = `${monster.health * 100 / (100 + 20 * level)}%`;
    document.querySelector('.monster-health-scale').style.marginLeft = `${100 - monster.health * 100 / (100 + 20 * level)}%`;
    document.querySelector('.monster-health-scale__number').innerHTML = monster.health;
    new showSpell().heal('monster');
    setTimeout(function () {
      document.querySelector('.spells').classList.toggle('showSpells');
    }, 1000);
  }
}

class levelResults { // уровень закончен
  constructor() { }
  win() { //победой
    player.levelPass++;
    player.health = 100;
    player.shield = 0;
    player.super = 0;
    attackQuestions = 0, shieldQuestions = 0, healQuestions = 0;
    levelFinished = true;
    localStorage.setItem(player.name, player.levelPass); //save player name to local storage
    document.querySelector('.level__caption').innerHTML = "Congratulations!";
    monstersPhrases = new Dialogs().monstersPhrasesLevelWin();
    setTimeout(function () {
      let dialogText = new Helpers().randomArrayElem(monstersPhrases);
      new dialogActions().showDialog([dialogText]);
    }, 500);
    new Door($(".door-right")).openDoor();
    //synth.cancel(); //stop reading
    document.querySelector('.door-right').addEventListener('click', function () { setTimeout(new createPage().level, 1500); });
    new Door($(".door-left")).openDoor();
    document.querySelector('.door-left').addEventListener('click', function () { setTimeout(new createPage().level, 1500); });
  }
  lose() {
    levelFinished = true;
    level = 'lose';
    localStorage.setItem(player.name, player.levelPass); //save player name to local storage
    monstersPhrases = new Dialogs().monstersPhrasesLevelLose();
    setTimeout(function () {
      let dialogText = new Helpers().randomArrayElem(monstersPhrases);
      new dialogActions().showDialog([dialogText]);
    }, 500);
  }
  winGame() {
    document.querySelector('.level__caption').innerHTML = "Congratulations!";
    player.levelPass++;
    levelFinished = true;
    localStorage.setItem(player.name, player.levelPass); //save player name to local storage

    setTimeout(function () {
      let dialogText = new Dialogs().monstersPhrasesWinFinal();
      new dialogActions().showDialog([dialogText]);
    }, 500);

    new Door($(".door-right")).openDoor();
    synth.cancel(); //stop reading
    document.querySelector('.door-right').addEventListener('click', function () { setTimeout(new createPage().endGame, 1500); });
    new Door($(".door-left")).openDoor();
    document.querySelector('.door-left').addEventListener('click', function () { setTimeout(new createPage().endGame, 1500); });

  }
}

class Dialogs {
  constructor() { }
  instructions() {
    let arr = [`Hello, ${player.name}! Welcome to 'Company name' - one of the best companies in the world. To learn more, look to the rules in your menu. When you are ready - go through that door. Good luck!`];
    return arr;
  }
  monstersPhrasesLevelStart() {
    let arr = [
      `Well ${player.name}, let's check your ${levelLanguage} skills.`,
      `Heard you are a big fan of ${levelLanguage}. Will see!`,
      `Glad to see you, ${player.name}! Let's do ${levelLanguage}.`,
      `You think my level is easy? ${levelLanguage} is not a language, it's a life style!`,
      `Let's see what you got, ${player.name}!`,
      `Let's see how you cope with ${levelLanguage} level, ${player.name}!`,
      `I can't wait to start, ${player.name}!`,
      `Don't be afraid, ${player.name}, ${levelLanguage} - it's easy. Let's start!`,
      `You shall not pass, ${player.name}!!!`,
      `Only one candidate have passed this level. Are you ready, ${player.name}?`
    ];
    return arr;
  }
  monstersPhrasesLevelWin() {
    let arr = [
      `Excellent work, ${player.name}! Choose your way and good luck.`,
      `You're really good in ${levelLanguage}. You can go through any door for the next interview.`,
      `I'm impressed, ${player.name}! Good luck on the next interview, choose any door.`,
      `Your knowledge of ${levelLanguage} is very good! You can go to any door for next level.`,
      `Good interview, I wish good luck to the next. Choose any door, ${player.name}`,
      `Amazing skills, ${player.name}! Go through one of this doors to continue.`,
      `You really are good at ${levelLanguage}. Choose the door and good luck.`,
      `Good job, ${player.name}. You can go to any door for next level.`,
      `I see, ${levelLanguage} is to easy for you, isn't it? Go through one of this doors to continue.`,
      `I see, you're really big fan of ${levelLanguage}! Good luck on the next interview, ${player.name}, choose any door.`
    ];
    return arr;
  }
  monstersPhrasesLevelLose() {
    let arr = [
      `Better luck next time, ${player.name}.`,
      `I'm sorry, ${player.name}, but as long as your knowledge is not enough.`,
      `You need to pay more attention to ${levelLanguage}. Come again when you are ready.`,
      `You should seriously study ${levelLanguage}. Your knowledge is not enough yet.`,
      `I think in half a year you will succeed. Good luck, ${player.name}!`,
      `Your skills are not enough yet. Good buy, ${player.name}.`,
      `Not bad, ${player.name}, but you still need to learn  a lot. See you!`,
      `We will call you, ${player.name}`,
      `Sorry, ${player.name}, but we can't offer you job now.`,
      `You have serious problems with ${levelLanguage}. Keep learning, ${player.name}`
    ];
    return arr;
  }
  monstersPhrasesFinal() {
    let arr = [
      `Great work, ${player.name}! It is the last test, let's begin!`,
      `Was it easy to get here? Well, the last fight!`,
      `Don't be too happy, ${player.name}! Here everything can end!`
    ];
    return arr;
  }
  monstersPhrasesWinFinal() {
    let arr = [`Congratulations, ${player.name}, your level is really great. I'll be glad to see you sometime and talk a bit more about ${levelLanguage}. Go through any door, your Boss is waiting.`];
    return arr;
  }
  boss() {
    let arr = [`Hello, ${player.name}! My "monsters" have tested you well, right? But now we know for sure that you are worthy to become a part of our company! Welcome and good luck in your future work!`];
    return arr;
  }
}

class Door {
  constructor(door) {
    this.door = door;
  }
  openDoor() {
    this.door.click(
      function openDoor() {
        $(this).addClass("doorOpened");
      }
    );
  }
}

class MonsterGenerator {
  constructor(head, body, legs) {
    this.head = head;
    this.body = body;
    this.legs = legs;
  };
  generateMonster(headArray, bodyArray, legsArray) {
    new Helpers().addRandomClass(this.head, headArray);
    new Helpers().addRandomClass(this.body, bodyArray);
    new Helpers().addRandomClass(this.legs, legsArray);
    new NameGenerator(roleArray, nameArray, secondNameArray).showMonsterName();
  }

}

class NameGenerator {
  constructor(nameOptionsArray1, nameOptionsArray2, nameOptionsArray3) {
    this.position = nameOptionsArray1;
    this.name = nameOptionsArray2;
    this.surname = nameOptionsArray3;
  };
  generateRandomName() {
    return this.position[new Helpers().randomNumber(this.position.length)] + ' ' +
      this.name[new Helpers().randomNumber(this.name.length)] + ' ' +
      this.surname[new Helpers().randomNumber(this.surname.length)];
  };
  showMonsterName() {
    let monsterRandomName = this.generateRandomName();
    $(".monster-name").append(monsterRandomName);
  }

}


class Monster { // класс монстра
  constructor(level) {
    this.name = new NameGenerator(roleArray, nameArray, secondNameArray).generateRandomName();
    this.health = 100 + 20 * level;  // переменная, которая будет определять номер уровеня (1, 2, 3, 4, 5)
    this.spells = ['attack', 'shield', 'heal', 'helper', 'multipleAttack'];
    this.shield = 0;
  }
}


let resultsTable;

class ResultsTable {
  constructor() {
    this.bestResults = Object.keys(localStorage).reduce(function (obj, str) {
      obj[str] = localStorage.getItem(str);
      return obj
    }, {});
    this.bestResultsSortedArray = [];
  };
  createSortedResults() {
    for (result in this.bestResults) {
      if (!isNaN(Number(this.bestResults[result]))) {
        this.bestResultsSortedArray.push([result, this.bestResults[result]]);
      }
    }
    this.bestResultsSortedArray.sort(function (a, b) {
      return b[1].localeCompare(a[1]);
    });
    this.bestResultsSortedArray = this.bestResultsSortedArray.slice(0, 10);
  };
  createResultsTable(bestResultsSortedArray) {
    $(".game-background").append(resultsTableHTML);

    resultsTable = document.getElementById("resultsTable");
    if (bestResultsSortedArray.length !== 0) {
      while (resultsTable.firstChild) {
        resultsTable.removeChild(resultsTable.firstChild);
      }
      for (let i in bestResultsSortedArray) {
        let resultRow = document.createElement("tr"),
          position = document.createElement("td"),
          userName = document.createElement("td");

        position.innerHTML = parseInt(i) + 1;
        userName.innerHTML = bestResultsSortedArray[i][0];
        let userResult = document.createElement("td");
        userResult.innerHTML = bestResultsSortedArray[i][1];

        resultRow.appendChild(position);
        resultRow.appendChild(userName);
        resultRow.appendChild(userResult);
        resultsTable.appendChild(resultRow);
      }
    } else {
      let resultRow = document.createElement("tr"),
        noResults = document.createElement("td");

      resultRow.appendChild(noResults);
      noResults.innerHTML = "No Results Yet";

      for (let i = 0; i < 2; i++) {
        let emptyCell = document.createElement("td");
        resultRow.appendChild(emptyCell);
      }

      resultsTable.appendChild(resultRow);
    }
  };
  showResults() {
    this.createSortedResults();
    this.createResultsTable(this.bestResultsSortedArray);
  }
}


new createPage().greeting();
// rightDoor.addEventListener('click', new createPage().level);
// leftDoor.addEventListener('click', new createPage().level);
//тест разных способностей

//new Spells().heal();
//new Spells().attack();
//new Spells().shield();
//new Tasks().calculator();

// $("#myBtn").click(new Tasks().putInRightOrder());