# this file imports custom routes into the experiment server
import sys
sys.path.append("/opt/local/Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages")

from flask import Blueprint, render_template, request, jsonify, Response, abort, current_app, session
from jinja2 import TemplateNotFound
from functools import wraps
from sqlalchemy import or_

from psiturk.psiturk_config import PsiturkConfig
from psiturk.experiment_errors import ExperimentError
from psiturk.user_utils import PsiTurkAuthorization, nocache
# # Database setup
from psiturk.db import db_session, init_db
from psiturk.models import Participant
from json import dumps, loads

from player import Player, items, data_matrix, features
from similarities import *

#import editdistance

from random import randint
from random import sample
from random import choice
from random import shuffle
import cPickle as pickle

# load the configuration options
config = PsiturkConfig()
config.load_config()
myauth = PsiTurkAuthorization(config)  # if you want to add a password protect route use this

# explore the Blueprint
custom_code = Blueprint('custom_code', __name__, template_folder='templates', static_folder='static')


with open("pickled_data/tasks.pickle", 'r') as f:
    tasks = pickle.load(f)

with open("pickled_data/tasks_experiment2.pickle", 'r') as f:
    tasks_experiment2 = pickle.load(f)

###########################################################
#  serving warm, fresh, & sweet custom, user-provided routes
#  add them here
###########################################################


#----------------------------------------------
# Start Player
#----------------------------------------------


#----------------------------------------------
# Get similar questions
#----------------------------------------------
@custom_code.route('/get_similar', methods=['GET'])
def get_similar():
    q = request.args['question']
    try:
        answer = get_ordered_similarities(str(q))
        str_answer = ",".join([repr(elem) for elem in answer])
        return str_answer
    except TemplateNotFound:
        abort(404)



@custom_code.route('/get_object', methods=['GET'])
def get_object():
    index = int(str(request.args['index']))
    try:
        return items[index]
    except TemplateNotFound:
        abort(404)

@custom_code.route('/get_index', methods=['GET'])
def get_index():
    item = str(request.args['object'])
    try:
        return str(items.index(item))
    except TemplateNotFound:
        abort(404)



#----------------------------------------------
# Get answer
#----------------------------------------------
@custom_code.route('/get_question_response', methods=['GET'])
def get_question_response():

    item = str(request.args['item'])
    item_indx = items.index(item)

    q_indx = features.index(str(request.args['question']))
    answer = data_matrix[item_indx][q_indx]
    try:
        return str(answer)
    except TemplateNotFound:
        abort(404)


#----------------------------------------------
# Get ordered info gain
#----------------------------------------------
@custom_code.route('/get_good_questions', methods=['GET'])
def get_good_questions():
    try:
        player = Player()
        knowledge = str(request.args['knowledge']).split(",")
        for k in knowledge:
            if k == "": continue
            parts = k.split(":")
            player.add_knowledge_name(parts[0], parts[1])

        return player.ordered_features_name_and_gain_str()
    except TemplateNotFound:
        abort(404)


#----------------------------------------------
# Get ordered info gain
#----------------------------------------------
@custom_code.route('/get_good_questions_norepeat', methods=['GET'])
def get_good_questions_norepeat():
    try:
        player = Player()
        knowledge = str(request.args['knowledge']).split(",")
        shown = str(request.args['shown']).split(",")
        for k in knowledge:
            if k == "": continue
            parts = k.split(":")
            player.add_knowledge_name(parts[0], parts[1])

        thresh = 1
        to_remove = [s for s in list(set(shown)) if shown.count(s) >= thresh]

        for s in to_remove:
            try:
                player.features_left.remove(features.index(s))
            except:
                pass

        return player.ordered_features_name_and_gain_str()
    except TemplateNotFound:
        abort(404)

#----------------------------------------------
# Get if is similar object
#----------------------------------------------
@custom_code.route('/get_similarity', methods=['GET'])
def get_similarity():
    try:
        obj = str(request.args['object'])
        the_item = str(request.args['item'])
        #return str( editdistance.eval(obj, the_item) )
        return 0 if obj == the_item else 1
    except TemplateNotFound:
        abort(404)


#----------------------------------------------
# get random object
#----------------------------------------------
@custom_code.route('/get_rand_object', methods=['GET'])
def get_rand_object():
    try:
        #qa,lreturn str(items[randint(0, 1000)])
        return str(items[choice(range(999))])

    except TemplateNotFound:
        abort(404)

@custom_code.route('/get_rand_objects_without', methods=['GET'])
def get_rand_objects_without():
    try:
        #qa,lreturn str(items[randint(0, 1000)])
        options = range(999)
        obj = str(request.args['object'])
        amount = int(str(request.args['amount']))
        options.remove(items.index(obj))
        item_choices = sample(options, amount-1)
        item_choices.append(items.index(obj))
        shuffle(item_choices)
        return ':'.join([items[i] for i in item_choices]) + ',' + ':'.join([str(i) for i in item_choices])

    except TemplateNotFound:
        abort(404)

@custom_code.route('/get_questions_for_task', methods=['GET'])
def get_questions_for_task():
    try:
        task_indx = int(str(request.args['task_indx']))
        question_str = ':'.join([','.join([';'.join([repr(elem) for elem in q]) for q in questions]) for questions in tasks[task_indx][2]])
        return question_str + '/' + str(tasks[task_indx][1]) + '/' + ':'.join([items[item] for item in tasks[task_indx][3]])

    except:
        abort(404)


@custom_code.route('/get_item_for_task', methods=['GET'])
def get_item_for_task():
    return "test passed"
    try:
        task_indx = int(str(request.args['task_indx']))
        task = tasks[task_indx]
        return str(task[1])

    except:
        abort(404)


@custom_code.route('/get_questions_for_task_experiment2', methods=['GET'])
def get_questions_for_task_experiment2():
    try:

        task_indx = int(str(request.args['task_indx']))
        task = tasks_experiment2[task_indx]
        item = task["item"]
        question_str = ','.join(["{}:{}".format(question[0], question[1]) for question in task["knowledge"]])
        item_options = ":".join([items[o] for o in task["item_options"]])
        to_rank = ",".join( [ "{}:{}".format(f, data_matrix[item, f]) for f in task["current_options"] ] )

        return_str = question_str + "/"
        return_str += items[task["item"]] + "/"
        return_str += item_options + "/"
        return_str += to_rank

        return return_str

    except:
        abort(404)


@custom_code.route('/get_item_for_task_experiment2', methods=['GET'])
def get_item_for_task_experiment2():
    return "test passed"
    try:
        task_indx = int(str(request.args['task_indx']))
        task = tasks[task_indx]
        return str(items[task["items"]])

    except:
        abort(404)

