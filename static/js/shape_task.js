var img_attr_choies = [ ['Rectangle', 'Triangle'],
                        ['Black', 'Red'],
                        ['Green', 'Grey'],
                        ['Dot', 'NoDot'] ]

var possible_questions_full = [  [
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
                                    ['Does it have a dot?', [3, 0]],
                                    ['Does it have a dot?', [3, 0]],
                                  ]
                              ];

var good_questions_full =  [  ['Is it a rectangle?', [0, 0]],
                              ['Is it a triangle?', [0, 1]],
                              ['Does it have a black outline?', [1, 0]],
                              ['Does it have a red outline?', [1, 1]],
                              ['Does is have a gray fill?', [2, 1]],
                              ['Does it have a dot?', [3, 0]] ];

var possible_questions = possible_questions_full.slice();
var good_questions = good_questions_full.slice();

var shape_imgs = [];
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

function add_option(q_num, q) {
  $("#answers").append(
    '<div class="radio-question" id = "radio-question-1">' +
      '<input type="radio" name="q1" value="a" id="q' + q_num.toString() + '">' +
      '<label style="margin:0.5em" for="q' + q_num.toString() + '">' + q + '</label>' +
    '</div>'
  );

}

function start_shapegame() {
  good_questions = shuffle(good_questions_full);
  shape_imgs = load_img_names();
  shape_choice = base2str(rand_num_incl(0, 15));
  possible_questions = possible_questions_full.slice();
  give_question_options();)
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
  make_alert((correct ?
              'Correct! Great Job! Now move on to Part II of this HIT' :
              'Incorrect, sorry'), function(){
                                    if(correct) show_questions_instructs();
                                    else start_shapegame();
                                  });
}

function load_shape_imgs() {
  for(var i = 0; i < 16; i++) {
    $("#shape" + (i+1).toString()).html(shape_imgs[i]);
  }
}

function give_question_options_old() {
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

function give_question_options() {

}
