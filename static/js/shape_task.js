var img_attr_choies = [ ['Rectangle', 'Triangle'],
                        ['Black', 'Red'],
                        ['Green', 'Grey'],
                        ['Dot', 'NoDot'] ]

var possible_questions = [  [
                              ['Is it a rectangle?', [0, 0]],
                              ['Is it a triangle?', [0, 1]]
                            ],

                            [
                              ['Does it have a black outline?', [1, 0]],
                              ['Does it have a red outline?', [1, 1]]
                            ],

                            [
                              ['Does it have a green fill?', [2, 0]],
                              ['Does is have a gray fill?', [2, 1]]
                            ],

                            [
                              ['Does it have a dot?', [3, 1]],
                              ['Does it have a dot?', [3, 1]],
                            ]
                          ];

var shape_imgs = []
var shape_choice = '';
var knowledge_arr = [];
var iterations = 0;
var game_on = 0;

function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

function rand_num_incl(min, max) {
  return parseInt((Math.random() * (max - min + 1)), 10) + min;
}

function base2str(num) {
  return pad(num.toString(2), 4);
}

function removeArrValue(arr,index) {
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function load_img_names() {
  shape_imgs = [];
  for(var i = 0; i < 16; i++) {
    var base2 = base2str(i);

    var choice_str = "";
    for(var j = 0; j < 4; j++) {
      choice_str += img_attr_choies[j][parseInt(base2.charAt(j))];
      if(j < 3) choice_str += '-';
    }
    shape_imgs.push('<img src="/static/images/shapes/' + choice_str + '.png"  alt=' +
                      choice_str + ' width=150 bin_rep=' + base2 + '>');
  }
  return shuffle(shape_imgs);
}

function start_shapegame() {
  shape_imgs = load_img_names();
  shape_choice = base2str(rand_num_incl(0, 15));

  give_question_options();
}

function let_them_choose() {
  psiTurk.showPage('shape_choice.html');
  load_shape_imgs();
  $("#question-form").html('');
  $("td").each(function() {
    var inner = $(this).html();
    var shape_bin = $(this).find('div').find('img').attr('bin_rep');
    $(this).html('<a href="javascript:shape_chosen(\'' +
                  shape_bin + '\')">' + inner + '</a>')
  })
}

function shape_chosen(obj) {
  var correct = obj == shape_choice;
  make_alert((obj == correct ?
              'Correct! Great Job! Now move on to Part II of this HIT' :
              'Incorrect, sorry'), function(){
                                    if(correct) show_question_instructs();
                                    else start_shapegame();
                                  });
}

function load_shape_imgs() {
  for(var i = 0; i < 16; i++) {

    /* removes inconsistent shapes
    var consistent_with_knowledge = true;
    for(var j = 0; j < knowledge_arr.length; j++) {
      k = knowledge_arr[j];
      alert("This piece of knowledge: " + k);
      if(base2str(i).charAt(k[0]) != k[1]) {
        consistent_with_knowledge = false;
      }
    }
    alert("I decided it was " + (consistent_with_knowledge ? 'consistent' : 'inconsistent') +
                      ", because it had base2str, knowledge: " +
                      base2str(i) + " : " + knowledge_arr);

    */

    $("#shape" + (i+1).toString()).html(shape_imgs[i]);
  }
}

function give_question_options() {
  if(possible_questions.length == 0) {
    let_them_choose();
    return;
  }

  var q1cat = rand_num_incl(0, possible_questions.length - 1);
  if(possible_questions.length > 1) {
    var q2cat = rand_num_incl(0, possible_questions.length - 1);

    while (q2cat == q1cat) {
      q2cat = rand_num_incl(0, possible_questions.length - 1);
    }
  }

  else {
    var q2cat = q1cat;
  }

  var question1 = possible_questions[q1cat][rand_num_incl(0, 1)];
  var question2 = possible_questions[q2cat][rand_num_incl(0, 1)];

  psiTurk.showPage('shape_game.html');

  if(possible_questions.length == 1) {
    $("#q1").parent().html('');
  }

  load_shape_imgs();

  $("#q0").next('label').html(question1[0]);
  $("#q1").next('label').html(question2[0]);

  $("#q0").next('label').attr('knowledge_val', question1[1].join());
  $("#q1").next('label').attr('knowledge_val', question2[1].join());
}

var choicecomplete = function() {
	if($("#submit-button").html() == "Submit") {
		var choice = $("input[name=q1]:checked").next('label').html();
    var knowledge_val = $("input[name=q1]:checked").next('label').attr('knowledge_val').split(',');

    for(var i = 0; i < possible_questions.length; i++) {
      if(possible_questions[i][0][1][0] == knowledge_val[0]) {
        possible_questions = removeArrValue(possible_questions, i);
        break;
      }
    }

    var true_val = shape_choice.charAt(knowledge_val);
    var resp = true_val == knowledge_val[1] ? 'Yes' : 'No';
    knowledge_arr.push([knowledge_val[0], true_val]);

		$("#prev-questions").css("margin-left", "0px");
		$("#answer").html('<h1 style="margin-top: 0">' + resp + '</h1>');
		$("#answer").fadeTo('slow', 1.0);
		$("#submit-button").html("Next");
		$("#submit-button").removeClass('btn-success');
		$("#submit-button").addClass("btn-primary");
    $("#answers").remove();
    $("#form-label").html(choice);
	}

	else {
		iterations++;
		give_question_options();
	}

}
