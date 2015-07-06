/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-ready.html",
	"quiz.html",
	"stage.html",
	"setup.html",
	"postquestionnaire.html",
	"complete.html",
	"full_game_eig.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
];

images = { 'y':'<div style="margin-left:-136px"><img src="/static/images/slider_y.png"  alt="Definitely Yes"></div>',
		  'py':'<div style="margin-left:-136px"><img src="/static/images/slider_py.png" alt="Probably/Sometimes"></div>',
		   'u':'<div style="margin-left:-136px"><img src="/static/images/slider_u.png"  alt="Unknown/Not applicable"></div>',
		  'pn':'<div style="margin-left:-136px"><img src="/static/images/slider_pn.png" alt="Probably not/Rarely"></div>',
		   'n':'<div style="margin-left:-136px"><img src="/static/images/slider_n.png"  alt="Definitely No"></div>',
		 '1.0':'<div style="margin-left:-136px"><img src="/static/images/slider_y.png"  alt="Definitely Yes"></div>',
		 '0.5':'<div style="margin-left:-136px"><img src="/static/images/slider_py.png" alt="Probably/Sometimes"></div>',
		 '0.0':'<div style="margin-left:-136px"><img src="/static/images/slider_u.png"  alt="Unknown/Not applicable"></div>',
		'-0.5':'<div style="margin-left:-136px"><img src="/static/images/slider_pn.png" alt="Probably not/Rarely"></div>',
		'-1.0':'<div style="margin-left:-136px"><img src="/static/images/slider_n.png"  alt="Definitely No"></div>'};



/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/
var question_answer_pairs = [["Is it mechanical?", "y"], ["Is it large?", "n"], ["Can you hold it?", "py"], ["Do you like it?", "y"]];
var quizquestions = [["Is it alive?", 'n'], ['Is it small?', 'y'], ['Could I hold it?', 'u']];
var quizquestion_on = 0;
var knowledge = "";
var item = "computer";
var iterations = 0;
var max_iterations = 20;

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

var pre_20q = function() {
	psiTurk.showPage("full_game_eig.html");
	$("#question-number").html("Question number: " + iterations.toString());
	$.ajax({
		url: "/get_good_questions",
		type: "GET",
		data: {"knowledge":knowledge},
		success: function(data) {
				new_questions = data.split(',')[0].split(":");
				info_gains = data.split(',')[1].split(":");
				console.log(new_questions);
				var questions_to_ask = shuffle([[new_questions[0], info_gains[0]],
												[new_questions[3], info_gains[3]], 
												[new_questions[6], info_gains[6]],
												[new_questions[9], info_gains[9]]]);
				for(var i = 0; i < 4; i++) {
					$('#q'+ i.toString()).next('label').html(questions_to_ask[i][0]);
					$('#q'+ i.toString()).next('label').attr("info-gain", questions_to_ask[i][1]);
				}
			}

	});
	
}

var choicecomplete = function() {
	
	iterations++;
	if($("#submit-button").html() == "Submit") {
		var choice = $("input[name=q1]:checked").next('label').html();
		var info_gain = $("input[name=q1]:checked").next('label').attr("info-gain");
		psiTurk.recordTrialData(["Prelim choice", iterations, choice, info_gain])
		$.ajax({
				//  send this user's unique id and get stimuli back
				url: "/get_question_response",
				type: "GET",
				data: {'question': choice, 'item': item},
				success: function(data) {
					console.log(data);

					if(knowledge == "") knowledge += choice + ":" + data;
					else knowledge += "," + choice + ":" + data;

					$("#answer").html(images[data]);
					$("#answer").fadeTo('slow', 1.0);
					$("#submit-button").html("Next");
					$("#submit-button").removeClass('btn-success');
					$("#submit-button").addClass("btn-primary");
					
				}
			})
			
		
	}

	else {
		if(iterations == max_iterations) show_questions();
		pre_20q();
	}
	
}

var guess_submitted = function() {
	
	if($("#guess-box").val().toUpperCase() == item.toUpperCase()) {
		alert("Correct! Good guess!");
		show_questions();
	}
	else {
		alert("Incorrect, guess again or ask more questions");
	}
}

var show_questions = function() {
	psiTurk.showPage('setup.html');
	for(var i = 0; i < question_answer_pairs.length; i++) {
		document.getElementById("block" + (i+1).toString()).getElementsByTagName('h2')[0].innerHTML = question_answer_pairs[i][0];
	}
}

var do_quiz = function() {
	psiTurk.showPage('quiz.html');
	document.getElementById("question-label").innerHTML = quizquestions[quizquestion_on][0];
}

var get_data = function() {
	psiTurk.showPage('stage.html');
}

var answer_chosen = function() {
	psiTurk.recordTrialData(["Final choice", question_answer_pairs, $("input[name=q1]:checked").next().htmle()]);

	setTimeout(function(){psiTurk.showPage('postquestionnaire.html')}, 500);
}

var quizcomplete = function() {
	if (quizquestion_on == quizquestions.length) quizquestion_on = 0;
	var correct = ($("input[name=q1]:checked").val() == quizquestions[quizquestion_on][1]);
	psiTurk.recordUnstructuredData("quiz-response", quizquestion_on.toString() + "," + 
				quizquestions[quizquestion_on][0] + "," + quizquestions[quizquestion_on][1] + "," + $("input[name=q1]:checked").val());
	quizquestion_on += 1;
	if (correct) {
		alert("Correct! Please proceed");
		get_data();
	}
	else {
		alert("Incorrect, please go back and try again");
		show_questions();
	}
}

var complete = function() {
    var comments = document.getElementById("comments").value;
	psiTurk.showPage('complete.html');
    psiTurk.recordUnstructuredData('comments', comments);
    psiTurk.saveData();
	psiTurk.completeHIT();
}

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { 
    		currentview = pre_20q();    		
    	} // what you want to do when you are done with instructions
    );
});