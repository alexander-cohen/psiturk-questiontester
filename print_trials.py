import pickle
depths = [0, 6, 4, 2, 6, 4, 2, 6, 4, 2]

with open("/Users/alxcoh/Documents/BrendenLake/psiturk-questiontester/pickled_data/tasks.pickle", 'r') as trialfile:
	trials = pickle.load(trialfile)

with open("/Users/alxcoh/Documents/BrendenLake/psiturk-questiontester/data/intel_feat.txt", "r") as feats:
    features = [l[:-2] for l in feats]


for d, t in zip(depths, trials[:10]):
	print '\n**************\n'
	print "Item:", t[1]
	for q in t[2][:d]:
		print features[q[0][0]], q[0][1]
	print ''
	print '\n'.join([features[t[2][d][n][0]] + " " + str(t[2][d][n][1]) for n in range(6)]) 