import cPickle as pickle

with open("pickled_data/tasks.pickle", 'r') as task_file:
	tasks = pickle.load(task_file)

print tasks