
def prod(arr):
  n = len(arr)
  res1 = [1 for i in range(n)]
  for i in range(1, n):
    res1[i] = res1[i - 1] * arr[i - 1]
    # res
  # res[0] = 0
  print(res1)
  res2 = [1 for i in range(n)]

  for i in range(n - 2, -1, -1):
    res2[i] = res2[i + 1] * arr[i + 1]
  print(res2)
  
  res = [1 for i in range(n)]
  for i in range(n):
    res[i] = res1[i] * res2[i]
  return res
  

arr1 = [-1,1,0,-3,3]
print(arr1)
prod(arr1)
arr2 = [0,0,9,0,0]