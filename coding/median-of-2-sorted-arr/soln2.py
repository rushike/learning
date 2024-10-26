import random
import time

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
  # print("small arr : ", arr1, arr2, k)
  l = len(arr1) + len(arr2)

  if l == 2:
    return sum([*arr1, *arr2]) / 2

  sorted_arr = sorted([*arr1, *arr2])

  if l % 2 == 1:
    return sorted_arr[k - 1]
  else :
    mid = (sorted_arr[k - 1] + sorted_arr[k - 2]) / 2
    return mid


def find_median(arr1, arr2, k = None):
  if not k : k = ( len(arr1) + len(arr2) ) // 2
  
  if k < 0: 
    # print("less : ", arr1, arr2, len(arr1), len(arr2), k)
    return

  if not arr1 and arr2:
    return arr2[k - 1]
  elif not arr2 and arr1:
    return arr1[k - 1]

  # if arr1 and arr2 and arr2[0] < arr1[0]: # swap on start index
  #   arr1, arr2 = arr2, arr1
  
  arr1_mid_index = len(arr1) // 2
  arr1_mid = None
  if len(arr1) % 2 == 1:
    arr1_mid = arr1[arr1_mid_index]
  else :
    arr1_mid_index = len(arr1) // 2
    arr1_mid = (arr1[arr1_mid_index] +  arr1[arr1_mid_index - 1]) / 2

  arr2_mid_index = len(arr2) // 2
  arr2_mid = None
  if len(arr2) % 2 == 1:
    arr2_mid = arr2[arr2_mid_index]
  else:
    arr2_mid = (arr2[arr2_mid_index] +  arr2[arr2_mid_index - 1]) / 2



  if len(arr1) + len(arr2) <= 4:
    return find_klargest_in_small_arr(arr1, arr2, k)

  print("\n\ncs arr1 : ", arr1, arr1_mid, k)
  print("cs arr2 : ", arr2, arr2_mid, k)
  if arr1_mid < arr2_mid:
    if k - arr1_mid_index < 0:
      return arr1[k - arr1_mid_index - 1]
    res = find_median(arr1[arr1_mid_index - 1:], arr2, k - arr1_mid_index)
    if not res:
      print("arr1 less k, mid : ", k, arr1_mid_index, len(arr1), k - arr1_mid_index)
    return res
  else:
    if k - arr2_mid_index < 0:
      return arr2[k - arr2_mid_index - 1]
    res = find_median(arr1, arr2[arr2_mid_index:], k - arr2_mid_index)
    if not res:
      print("arr2 less k, mid : ", k, arr2_mid_index, len(arr2), k - arr2_mid_index)

    return res

M, N = 25, 19
arr1 = sorted([random.randint(0, 1000) for i in range(M)])
arr2 = sorted([random.randint(0, 1000) for i in range(N)])
# arr1 = [1, 3, 9, 19]
# arr2 = [1, 5, 7, 15]
arr1 = [66, 73, 79, 201, 213, 284, 353, 390, 403, 445, 514, 550, 568, 597, 672, 686, 736, 822, 824, 842, 895, 904, 923, 987, 990]
arr2 = [29, 32, 39, 211, 241, 341, 346, 489, 514, 587, 605, 610, 623, 689, 708, 758, 848, 868, 983]


print("arr 1:  ", arr1)
print("arr 2:  ", arr2)


t1 = time.time()
conc = sorted([*arr1, *arr2])
mid = len(conc) // 2 
m = conc[mid]
print(f"conc found mid in {mid} {m} ", time.time() - t1)
t2 = time.time()
m = find_median(arr1, arr2)
print(f"cust found mid in {mid} {m} ", time.time() - t2)

# print(conc)
