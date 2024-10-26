# import numpy

class Solution1(object):
  def uniquePathsWithObstacles(self, ogrid):
    """
    :type obstacleGrid: List[List[int]]
    :rtype: int
    """
    if ogrid[-1][-1] or ogrid[0][0]: return 0
    shape = [len(ogrid) + 1, len(ogrid[0]) + 1]
    # path = numpy.zeros((len(ogrid) + 1, len(ogrid[0]) + 1), int)
    path = [[0 for j in range(shape[1])] for i in range(shape[0])]
    # path[1, 1] = 1
    path[1][1] = 1
    # for i in range(1, path.shape[0]):
    #   for j in range(1, path.shape[1]):
    #     if i == 1 and j == 1 : continue

    #     if ogrid[i - 1][j - 1] != 1:
    #       path[i, j] = path[i - 1, j] + path[i, j - 1]


    def update(path, i, j):
      # path[i, j] = path[i - 1, j] + path[i, j - 1]
      path[i][j] = path[i - 1][j] + path[i][j - 1]

    [
      [ 
        update(path, i, j) for j in range(1, shape[1])
        if (i != 1 or j != 1) and ogrid[i - 1][j - 1] != 1
      ]
      for i in range(1, shape[0])
    ]
    return path[-1][ -1]



# import numpy

class Solution1(object):
  def uniquePathsWithObstacles(self, ogrid):
    """
    :type obstacleGrid: List[List[int]]
    :rtype: int
    """
    if ogrid[-1][-1] or ogrid[0][0]: return 0
    shape = [len(ogrid) + 1, len(ogrid[0]) + 1]
    # path = numpy.zeros((len(ogrid) + 1, len(ogrid[0]) + 1), int)
    path = [[0 for j in range(shape[1])] for i in range(shape[0])]
    # path[1, 1] = 1
    path[1][1] = 1
    # for i in range(1, path.shape[0]):
    #   for j in range(1, path.shape[1]):
    #     if i == 1 and j == 1 : continue

    #     if ogrid[i - 1][j - 1] != 1:
    #       path[i, j] = path[i - 1, j] + path[i, j - 1]


    def update(path, i, j):
      # path[i, j] = path[i - 1, j] + path[i, j - 1]
      path[i][j] = path[i - 1][j] + path[i][j - 1]

    [
      [ 
        update(path, i, j) for j in range(1, shape[1])
        if (i != 1 or j != 1) and ogrid[i - 1][j - 1] != 1
      ]
      for i in range(1, shape[0])
    ]
    return path[-1][ -1]
