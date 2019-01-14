/********************************
*********QUIZ CONTROLLER********
********************************/

var quizContrller = (function() {

    //******* Question constructor ******
    function Question(id, questionText, options, correctAnswer) {
         this.id = id;
         this.questionText = questionText;
         this.options = options;
         this.correctAnswer = correctAnswer;
    }
  
    var questionLocalStorage = {
         setQuestionCollection: function(newCollection) {
             localStorage.setItem('questionCollection', JSON.stringify(newCollection));
         },
         getQuestionCollection: function() {
             return JSON.parse(localStorage.getItem('questionCollection'));
         }, 
         removeQuestionCollectino: function() {
             localStorage.removeItem('questionColection');
         }
    };
  
     if(questionLocalStorage.getQuestionCollection() === null) {
         questionLocalStorage.setQuestionCollection([]);
     }
  
    return {
         getQuestionLocalStorage: questionLocalStorage,
  
         addQuestionOnLocalStorage: function(newQuestText, opts) {
             var optionsArr, corrAns, questionId, newQuestion, getStoredQuest, isChecked;
  
             if(questionLocalStorage.getQuestionCollection() === null) {
                 questionLocalStorage.setQuestionCollection([]);
             }
  
             optionsArr = [];
  
             isChecked = false;
  
             for(var i = 0; i < opts.length; i++){
                 if(opts[i].value !== ''){
                     optionsArr.push(opts[i].value);
                 } 
                 
                 if(opts[i].previousElementSibling.checked && opts[i].value !== '') {
                     corrAns = opts[i].value;
                     isChecked = true;
                 }
             }
  
             if(questionLocalStorage.getQuestionCollection().length > 0) {
                 questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
             } else {
                 questionId = 0;
             }
  
             if( newQuestText.value !== '') {
                 if(optionsArr.length > 1) {
                     newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
  
                     if(isChecked) {
                         getStoredQuest = questionLocalStorage.getQuestionCollection();
                         getStoredQuest.push(newQuestion);
                         questionLocalStorage.setQuestionCollection(getStoredQuest);
             
                         newQuestText.value = '';
                         for(var x = 0; x < opts.length; x++){
                             opts[x].value = '';
                             opts[x].previousElementSibling.checked = false;
                         }
             
                         console.log(questionLocalStorage.getQuestionCollection());
  
                         return true;
                     } else {
                         alert('You missed to check correct answear, or you checked answer without value.');
                         return false;
                     }
  
                 } else {
                     alert('You must insern at least two options.');
                     return false;
                 }
                 
             } else {
                 alert('Please, insert question.');
                 return false;
             }
             
         }
    };
  
  })();
  
  /********************************
  *********UI CONTROLLER********
  ********************************/
  
  
  var UIController = (function() {
  
    var domItems = {
         /***** Admin panel elements *****/
         questInsertBtn: document.getElementById("question-insert-btn"),
         newQuestionText: document.getElementById("new-question-text"),
         adminOptions: document.querySelectorAll(".admin-option"),
         adminOptionsContainer: document.querySelector(".admin-options-container"),
         insertedQuestionWrapper: document.querySelector(".inserted-questions-wrapper"),
         questionUpdateBtn: document.getElementById('question-update-btn'),
         questionDeleteBtn: document.getElementById('question-delete-btn'),
         questionsClearBtn: document.getElementById('questions-clear-btn')
  
    }
  
    return {
        getDomItems: domItems,
  
        addInputsDynamically: function() {
  
             var addInput = function(){
                 
                 var inputHTML, z;
  
                 z = document.querySelectorAll('.admin-option').length;
  
                 inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + z + '" name="answer" value="' + z + '"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';
             
                 domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
  
                 domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
  
                 domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
  
             }
  
             domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },
  
        createQuestionList: function(getQuestions){
  
             var questHTML, numberingArr;
  
             numberingArr = [];
  
             domItems.insertedQuestionWrapper.innerHTML = '';
  
             for(var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
  
                 numberingArr.push(i + 1);
  
                 questHTML = '<p><span>' + numberingArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';
             
                 domItems.insertedQuestionWrapper.insertAdjacentHTML('afterbegin', questHTML);
             }
        },
  
        editQuestList: function(event, storageQuestList, addInpsDynFn, updateQuestListFn){
  
         var getId, getStorageQuestList, foundItem, placeInArr,optionsHTML;
  
            if("question-".indexOf(event.target.id)) {
  
                 getId = parseInt(event.target.id.split('-')[1]);
  
                 getStorageQuestList = storageQuestList.getQuestionCollection();
  
                 for(var i = 0; i < getStorageQuestList.length; i++) {
  
                     if(getStorageQuestList[i].id === getId) {
  
                         foundItem = getStorageQuestList[i];
  
                         placeInArr = i;
  
                     }
  
                }
                
                domItems.newQuestionText.value = foundItem.questionText;
  
                domItems.adminOptionsContainer.innerHTML = '';
  
                optionsHTML = '';
  
                for(var x = 0; x < foundItem.options.length; x++){
  
                     optionsHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>';
  
                }
  
                domItems.adminOptionsContainer.innerHTML = optionsHTML;
  
                domItems.questionUpdateBtn.style.visibility = 'visible';
                domItems.questionDeleteBtn.style.visibility = 'visible';
                domItems.questInsertBtn.style.visibility = 'hidden';
                domItems.questionsClearBtn.style.pointerEvents = 'none';
  
                addInpsDynFn();
  
                var updateQuestions = function() {
                     var newOptions, optionEls;
  
                     newOptions = [];
  
                     optionEls = document.querySelectorAll(".admin-option");
  
                     foundItem.questionText = domItems.newQuestionText.value;
  
                     foundItem.correctAnswer = '';
  
                     for(var i = 0; i < optionEls.length; i++){
  
                         if(optionEls[i].value !== '') {
                             newOptions.push(optionEls[i].value);
  
                             if(optionEls[i].previousElementSibling.checked) {
                                 foundItem.correctAnswer = newOptions[i].value;
                             }
                         }
                     }
  
                     foundItem.options = newOptions;
  
                     if(foundItem.questionText !== ''){
                         if(foundItem.options.length > 1){
                             if(foundItem.correctAnswer !== ''){
                                 getStorageQuestList.splice(placeInArr, 1, foundItem);
  
                                 storageQuestList.setQuestionCollection(getStorageQuestList);
  
                                 domItems.newQuestionText.value = '';
  
                                 for(var i = 0; i < optionEls.length; i++){
  
                                     optionEls[i].value = '';
                                     optionEls[i].previousElementSibling.checked = false;
  
                                 }
  
                                 domItems.questionUpdateBtn.style.visibility = 'hidden';
                                 domItems.questionDeleteBtn.style.visibility = 'hidden';
                                 domItems.questInsertBtn.style.visibility = 'visible';
                                 domItems.questionsClearBtn.style.pointerEvents = '';
  
                                 updateQuestListFn(storageQuestList);
  
                             } else {
                                 alert('You missed to check correct answear, or you checked answer without value.');
                             }
                         } else {
                             alert('You must insern at least two options.');
                         }
                         
                     } else {
                         alert('Please, insert question.');
                     }
                     
                };
  
                domItems.questionUpdateBtn.onclick = updateQuestions;
                
            }
        }
    };
  
  })();
  
  /********************************
  ************CONTROLLER***********
  ********************************/
  
  
  var controller = (function(quizCtrl, UICtrl) {
  
     var selectedDomItems = UICtrl.getDomItems;
  
     UICtrl.addInputsDynamically();
  
     UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
  
     selectedDomItems.questInsertBtn.addEventListener('click', function() {
  
         var adminOptions = document.querySelectorAll(".admin-option");
  
         var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
  
         if (checkBoolean) {
             UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
         }
  
     });
  
     selectedDomItems.insertedQuestionWrapper.addEventListener('click', function(e){
  
         UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);
  
     });
  })(quizContrller, UIController);