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
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-4.html",
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
	// "instructions/instruct-1.html",
	// "instructions/instruct-2.html",
	"instructions/instruct-3.html",
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
var num_games = 2;
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
			$("#prev-questions").prepend("<h4>" + knowledge_piece[0] + "</h4>" + 
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
	$("#game-on").html("Game on: " + game_on.toString() + " / " + num_games.toString());
	if(iterations >= max_iterations) {
		$("#question-number").html("You have used up all your questions,<br>now you must guess an object");
		$("#questions").html("<br><br>");
	}

	else {
		$("#question-number").html("Question number: " + iterations.toString() + "/" + max_iterations.toString());
		if(game_on > 0) $("#bonus").html("Bonus: $" + bonus().toFixed(2));
		$.ajax({
			url: "/get_good_questions",
			type: "GET",
			data: {"knowledge":knowledge},
			success: function(data) {
					new_questions = data.split(',')[0].split(":");
					info_gains = data.split(',')[1].split(":");
					console.log(new_questions);
					var questions_to_ask = shuffle([[new_questions[2], info_gains[2]],
													[new_questions[5], info_gains[5]], 
													[new_questions[8], info_gains[8]],
													[new_questions[11], info_gains[11]],
													[new_questions[14], info_gains[14]],
													[new_questions[17], info_gains[17]],
													[new_questions[20], info_gains[20]],
													[new_questions[23], info_gains[23]]]);
					for(var i = 0; i < 8; i++) {
						$('#q'+ i.toString()).next('label').html('<span class="question-text">' + questions_to_ask[i][0] + '</span>');
						$('#q'+ i.toString()).next('label').attr("info-gain", questions_to_ask[i][1]);
					}
				}

		});
	}
	
	
}

var hide_info_gain = function() {
	$("#answers").find("label").each(function() {
						$(this).find('span').each(function() {
							if(!$(this).hasClass('question-text')) {
								$(this).remove();
							}
						});
					});
}

var show_info_gain = function() {
	$("#answers").find("label").each(function() {
						var num_spans = 0;
						$(this).find("span").each(function() {
							num_spans++;
						})
						if(num_spans == 1) {
							var info_gain = $(this).attr("info-gain");
							$(this).append('<span>, info gain: ' + parseFloat(info_gain).toFixed(3) + "</span>");
						}
					});
}

var choicecomplete = function() {
	if($("#submit-button").html() == "Submit") {
		var choice = $("input[name=q1]:checked").next('label').find('.question-text').html();
		alert(choice);
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
					//$("#question-form").html("<h3 style='margin-bottom: 40px'>"+choice+"</h3>");
					show_info_gain();
				}
			})
	}

	else {
		iterations++;
		pre_20q();
	}
	
}

var make_alert = function(message, onclose) {
	$("<p>" + message + "</p>").dialog(
	    {
	    	dialogClass: "no-close",
	        modal: true, //Not necessary but dims the page background
	        width: 400,
	        buttons:{
	            'Close':function() {
	             	onclose();
	             }
	             
	        },
	        close: function(event, ui) {
	        	event.preventDefault();
	        	onclose();
	        }
	    }
	);
}

function check_correct_color() {
	if($("#guess-box").val() == '') {
		$("#submit-button-guess").attr('class', '');
		$("#submit-button-guess").addClass('btn');
		$("#submit-button-guess").addClass('btn-continue');
	}
	else {
		$("#submit-button-guess").attr('class', '');
		$("#submit-button-guess").addClass('btn');
		$("#submit-button-guess").addClass('btn-primary');
	}
}

var guess_submitted = function() {
	knowledge = ""
	var choice = $("#guess-box").val().toUpperCase();
	$.ajax({
		url: "/get_similarity",
		type: "GET",
		data: {"object": choice.toUpperCase(), 'item':item.toUpperCase()},
		success: function(data) {
			var correct = false;
			var error = parseInt(data, 10);
			if(error <= 1) {
				correct = true;
			}
			if(correct) {
				if(game_on == 0) make_alert("Correct! Good job!", finish_guess_submitted);
				else {
					make_alert("Correct! Good guess! You will recieve a bonus of $" + bonus().toFixed(2), finish_guess_submitted);
				}
			}
			else {
				if(game_on == 0) {
					make_alert("Incorrect, sorry. The object is <strong>" + item + "</strong>.", finish_guess_submitted);
				}
				else {
					
					$("<p>Incorrect, I am sorry but you do not recieve a bonus. The object is <strong>" + item + "</strong>. Go to next game. If you think you got it right and would like to contest this, your complaint will be recorded and your response will be reviewed. If it is deemed correct, you will recieve your bonus.</p>").dialog(
					    {
					    	dialogClass: "no-close",
					        modal:true, //Not necessary but dims the page background
					        width: 400,
					        buttons:{
					        	'Continue':function() {
					             	finish_guess_submitted();
					             },
					            'Complain':function() {
					                psiTurk.recordUnstructuredData("complaint", $("#guess-box").val().toUpperCase() + ":" + item.toUpperCase());
					             	finish_guess_submitted();
					             }
					             
					        },
					        close: function(event, ui) {
					        	finish_guess_submitted();
					        }
					    }
					);
				} 
			}

			
		}
	})
	
}

var finish_guess_submitted = function() {
	if(game_on == 0) {
		make_alert("Now you will do the same thing, but if you do well, you will recieve a bonus." +
					"You start with $1 of bonus, and after each question it goes down by $.05. " +
					"If you guess the object correctly, you collect whatever the current bonus is. Good luck!", 
						function() {game_on++; start_game();});
	}

	else if(game_on >= num_games) {
		show_questions_instructs();
	}

	else {
		game_on++;
		start_game();
	}
}


var show_questions_instructs = function() {
	psiTurk.showPage("instructions/instruct-4.html");
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
			$("#prev-questions").prepend("<h4>" + knowledge_piece[0] + "</h4>" + 
										images[knowledge_piece[1]] + "<hr>");
		}
	}
	$("#prev-questions").find( $("img") ).attr("width", 600);
	$("#prev-questions").find( $("div") ).css("margin-left", -103);
	$("#prev-questions").css("margin-left", "50px");
	$("#prev-questions").find( $("div") ).css("margin-right", -103);
}

var answer_chosen = function() {
	if($("#1").val() == "#" ||
		$("#2").val() == "#" ||
		$("#3").val() == "#" ||
		$("#4").val() == "#") make_alert("Please choose a question for each rank", function(){});


	else {
		psiTurk.recordTrialData(["Final choice", question_answer_pairs, [$("#1").val(), $("#2").val(), $("#3").val(), $("#4").val()] ] );
		setTimeout(function(){psiTurk.showPage('postquestionnaire.html')}, 500);
	}
	
}

var quizcomplete = function() {
	if (quizquestion_on == quizquestions.length) quizquestion_on = 0;
	var correct = ($("input[name=q1]:checked").val() == quizquestions[quizquestion_on][1]);
	psiTurk.recordUnstructuredData("quiz-response", quizquestion_on.toString() + "," + 
				quizquestions[quizquestion_on][0] + "," + quizquestions[quizquestion_on][1] + "," + $("input[name=q1]:checked").val());
	quizquestion_on += 1;

	if (correct) {
		make_alert("Correct! Please proceed", get_data);

	}
	else {
		make_alert("Incorrect, please go back and try again. Really pay attention this time!", show_questions);
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