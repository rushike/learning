
def split_half(arr1, arr2):
  a1_half = len(arr1) // 2 + 1
  a2_half = len(arr2) // 2 + 1
  # if a1_half <= len(arr1) and a2_half <= len(arr2):
  #   return arr1[:a1_half], arr1[a1_half:], arr2[:a2_half], arr2[a2_half:]
  
  if a1_half >= len(arr1):
    return arr1[:a1_half], arr2[:a2_half], arr2[a2_half:], []
  
  return arr1[:a1_half], arr1[a1_half:], arr2[:a2_half], arr2[a2_half:]
  

def sort_chunks(arr11, arr12, arr21, arr22):
  """ Sorts the arrays given, based on their start and end indexes.
  Assumption arr11[0] <= arr22[0] and arr21[0] <= arr12[0]
  Args:
      arr11 (List): arr11
      arr12 (List): arr12
      arr21 (List): arr21
      arr22 (List): arr22

  Returns:
      (List, List, List, List): return the chunks order by their start and end indexes
  """
  if arr11 and arr21 and arr21[0] < arr11[0]: # swap on start index
    arr11, arr21 = arr21, arr11
  
  if arr12 and arr21 and arr21[0] < arr12[0]: # swap on start index, the start / middle guys
    arr21, arr12 = arr12, arr21

  if arr21 and arr22 and arr21[0] > arr22[0]: # swap on end index
    arr21, arr22 = arr22, arr21
  
  """
    At this point of time we should have 
     1. arr11[import random
import time
M, N = 100, 199
arr1 = sorted([random.randint(0, 1000) for i in range(M)])
arr2 = sorted([random.randint(0, 1000) for i in range(N)])
# arr1 = [1, 3, 9, 19]
# arr2 = [1, 3, 9, 19]
# print(arr1, arr2)

t1 = time.time()
conc = sorted([*arr1, *arr2])
mid = len(conc) // 2 
m = conc[mid]
print(f"conc found mid in {mid} {m} ", time.time() - t1)
t2 = time.time()
m = find_median(arr1, arr2)
print(f"cust found mid in {mid} {m} ", time.time() - t2)
0]  <= arr12[0] <= arr21[0] <= arr22[0]
  """
  return arr11, arr12, arr21, arr22

def find_klargest_in_small_arr(arr1, arr2, k):
#   cnt = 0
#   i = 0
#   j = 0
#   while i < len(arr1) and j < len(arr2):
#     el = None
#     if arr1[i] <= arr2[j]:
#       el = arr1[i]
#       i += 1
#     else:
#       el = arr2[j]
#       j += 1
#     if cnt == k:
#       return el
#     cnt += 1
  
#   print("cs : ", i, j, cnt)
  
#   if i < len(arr1):
#     return arr1[i + k - j ]
#   if j < len(arr2):
#     return arr2[j + k - i ]
  return sorted([*arr1, *arr2])[k - 1]

def locate_klargest(arr1, arr2, k):
  """locate kth largest elements if ambiguous call find_klargest

  Args:
      arr1 (List): arr1
      arr2 (List): arr1
      k (int): int

  Returns:
      int: kth largest element
  """

  # print("arr1: ", arr1, " arr2: ", arr2, " k: ", k)
  # assert(len(arr1) + len(arr2) >= k, f"can't locate {k}th largest in merge array of size {len(arr1) + len(arr2)}")
  if len(arr1) + len(arr2) <= 4: return find_klargest_in_small_arr(arr1, arr2, k)
  if k < 0: return
  if not arr1: return arr2[k - 1]
  elif not arr2: return arr1[k - 1]
  elif arr1[0] <= arr2[0] and arr1[-1] <= arr2[0]:
    print("arr1: ", arr1, " arr2: ", arr2, " k: ", k)
    if k <= len(arr1): 
      return arr1[k - 1]
    else : 
      return arr2[k - len(arr1) - 1]
  return find_klargest(arr1, arr2, k)

def find_klargest(arr1, arr2, k):
  """Find the kth largest element from the given two sorted arrays

  Args:
      arr1 (List): sorted array of numbers
      arr2 (List): sorted array of numbers
      k (int): int < len(arr1) + len(arr2)

  Returns:
      int: kth largest element
  """
  # assert(k <= (len(arr1) + len(arr2)), f"unable to find {k}th largest in merge array of size {len(arr1) + len(arr2)}")

  arr11, arr12, arr21, arr22 = split_half(arr1, arr2)
  arr11, arr12, arr21, arr22 = sort_chunks(arr11, arr12, arr21, arr22)

  l1 = len(arr11)
  l2 = len(arr11) + len(arr12)
  l3 = len(arr11) + len(arr12) + len(arr21)
  l4 = len(arr11) + len(arr12) + len(arr21) + len(arr22)
  # print(k, "----------------------------------------------------------------")
  # print(l1, l2, l3, l4)
  # print(arr11, arr12, arr21, arr22)
  if k <= l1:
    return locate_klargest(arr11, arr12, k)
  elif l1 < k <= l2:
    return locate_klargest(arr11, arr12, k)
  elif l2 < k <= l3:
    return locate_klargest(arr12, arr21, k - l1)
  elif l3 < k <= l4:
    return locate_klargest(arr21, arr22, k - l2)
    
  print("Unable to find k th largest, refractor me...")

def find_median(arr1, arr2):
  k =  (len(arr1) + len(arr2)) // 2 
  # print("k = ", k)
  return find_klargest(arr1, arr2, k)






# print(arr1, arr2)
# print("conc " , mid, conc )  
print("meding found : ", m)
print("expecting : ",conc[mid])

# for i in range(1000):
#   s = random.randint(0, 4)
#   a = sorted([random.randint(M, N) for i in range(s)])
#   b = sorted([random.randint(M, N) for i in range(4 - s)])
#   k = random.randint(0, 4)
#   print("arr1, arr2, k", a,b , k)
#   m1 = sorted([*a, *b])[k - 1]
#   m2 = find_klargest_in_small_arr(a, b, k)
#   print("m1, m2", m1, m2)
#   assert(m1 == m2)