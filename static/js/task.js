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

images = { 'y':'<div style="margin-left:-109px"><img src="/static/images/slider_y.png"  alt="Definitely Yes" width=650></div>',
		  'py':'<div style="margin-left:-109px"><img src="/static/images/slider_py.png" alt="Probably/Sometimes" width=650></div>',
		   'u':'<div style="margin-left:-109px"><img src="/static/images/slider_u.png"  alt="Unknown/Not applicable" width=650></div>',
		  'pn':'<div style="margin-left:-109px"><img src="/static/images/slider_pn.png" alt="Probably not/Rarely" width=650></div>',
		   'n':'<div style="margin-left:-109px"><img src="/static/images/slider_n.png"  alt="Definitely No" width=650></div>',
		 '1.0':'<div style="margin-left:-109px"><img src="/static/images/slider_y.png"  alt="Definitely Yes" width=650></div>',
		 '0.5':'<div style="margin-left:-109px"><img src="/static/images/slider_py.png" alt="Probably/Sometimes" width=650></div>',
		 '0.0':'<div style="margin-left:-109px"><img src="/static/images/slider_u.png"  alt="Unknown/Not applicable" width=650></div>',
		'-0.5':'<div style="margin-left:-109px"><img src="/static/images/slider_pn.png" alt="Probably not/Rarely" width=650></div>',
		'-1.0':'<div style="margin-left:-109px"><img src="/static/images/slider_n.png"  alt="Definitely No" width=650></div>'};



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
var quizquestions = [["Is it mechanical?", 'y'], ['Can you hold it?', 'y'], ['Is it large?', 'u']];
var quizquestion_on = 0;
var knowledge = "";
var item = "computer";
var iterations = 1;
var max_iterations = 20;
var num_games = 4;
var game_on = 0;

var bonus = function() {
	return 1.0 - (iterations) * 0.05;
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

var start_game = function() {
	psiTurk.showPage("full_game_eig.html");
	iterations = 0;
	$.ajax({
		url: "/get_rand_object",
		type: "GET",
		success: function(data) {
			item = data;
			pre_20q();
		}
	})
}

var load_knowledge = function() {
	var knowledge_arr = knowledge.split(",");
	$("#prev-questions").html("");
	if(knowledge != "") {
		for(var k = 0; k < knowledge_arr.length; k++) {
			var knowledge_piece = knowledge_arr[k].split(":");
			$("#prev-questions").append("<h4>" + knowledge_piece[0] + "</h4>" + 
										images[knowledge_piece[1]] + "<hr>");
		}
	}
	$("#prev-questions").find( $("img") ).attr("width", 600);
	$("#prev-questions").find( $("div") ).css("margin-left", -103);
	$("#prev-questions").css("margin-left", "50px");
	$("#prev-questions").find( $("div") ).css("margin-right", -103);
}

var pre_20q = function() {
	psiTurk.showPage("full_game_eig.html");

	load_knowledge();

	if(iterations >= max_iterations) {
		$("#question-number").html("You have used up all your questions,<br>now you must guess an object");
		$("#questions").html("<br><br>");
	}

	else {
		$("#question-number").html("Question number: " + iterations.toString());
		if(game_on > 0) $("#bonus").html("Bonus: $" + bonus().toFixed(2));
		$.ajax({
			url: "/get_good_questions",
			type: "GET",
			data: {"knowledge":knowledge},
			success: function(data) {
					new_questions = data.split(',')[0].split(":");
					info_gains = data.split(',')[1].split(":");
					console.log(new_questions);
					var questions_to_ask = shuffle([[new_questions[0], info_gains[0]],
													[new_questions[10], info_gains[10]], 
													[new_questions[20], info_gains[20]],
													[new_questions[30], info_gains[30]]]);
					for(var i = 0; i < 4; i++) {
						$('#q'+ i.toString()).next('label').html(questions_to_ask[i][0]);
						$('#q'+ i.toString()).next('label').attr("info-gain", questions_to_ask[i][1]);
					}
				}

		});
	}
	
	
}

var choicecomplete = function() {
	
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
					$("#prev-questions").css("margin-left", "0px");
					$("#answer").html(images[data]);
					$("#answer").fadeTo('slow', 1.0);
					$("#submit-button").html("Next");
					$("#submit-button").removeClass('btn-success');
					$("#submit-button").addClass("btn-primary");
					
				}
			})
	}

	else {
		iterations++;
		pre_20q();
	}
	
}

var guess_submitted = function() {
	alert("Message recieved!");
	knowledge = ""
	var choice = $("#guess-box").val().toUpperCase();
	$.ajax({
		url: "/get_similar_objects",
		type: "GET",
		data: {"object": choice},
		success: function(data) {
			var correct = false;
			var error = parseInt(data, 10);
			if(error <= 1) {
				correct = true;
			}
			if(correct) {
				if(game_on == 0) alert("Correct! Good job!");
				else {
					alert("Correct! Good guess! You will recieve a bonus of $" + bonus().toFixed(2));
					psiTurk.computeBonus(bonus());
				}
			}
			else {
				if(game_on == 0) alert("Incorrect, sorry. It was a " + item);
				else {
					if(confirm("Incorrect, I am sorry but you do not recieve a bonus. It was a " + item + " Go to next game. If you think you got it right and would like to contest this, your complaint will be recorded and your response will be reviewed. If it is deemed correct, you will recieve your bonus."))
					{
						psiTurk.recordUnstructuredData("complaint", $("#guess-box").val().toUpperCase() + ":" + item.toUpperCase());
					}
					
				} 
			}

			if(game_on == 0) {
				alert("Now you will do the same thing, but if you do well, you will recieve a bonus. You start with $1 of bonus, and after each question it goes down by $.05. If you guess the object correctly, you collect whatever the current bonus is. Good luck!");
			}

			if(game_on == num_games) {
				show_questions();
			}

			else {
				game_on++;
				start_game();
			}
		}
	})
	
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
	var knowledge_arr = question_answer_pairs;
	$("#prev-questions").html("");
	if(knowledge != "") {
		for(var k = 0; k < knowledge_arr.length; k++) {
			var knowledge_piece = knowledge_arr[k].split(":");
			$("#prev-questions").append("<h4>" + knowledge_piece[0] + "</h4>" + 
										images[knowledge_piece[1]] + "<hr>");
		}
	}
	$("#prev-questions").find( $("img") ).attr("width", 600);
	$("#prev-questions").find( $("div") ).css("margin-left", -103);
	$("#prev-questions").css("margin-left", "50px");
	$("#prev-questions").find( $("div") ).css("margin-right", -103);
}

var answer_chosen = function() {
	psiTurk.recordTrialData(["Final choice", question_answer_pairs, $("input[name=q1]:checked").next().html()]);

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
    		currentview = start_game();    		
    	} // what you want to do when you are done with instructions
    );
});