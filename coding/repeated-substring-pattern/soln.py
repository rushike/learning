import math
def factors(n):
  res = []
  for i in range(2, math.sqrt(n)):
      if n % i == 0: 
        res.append(i)
        res.append(n / i)

  return sorted(res, reverse=True)

class Solution:
    
    def repeatedSubstringPattern(self, s: str) -> bool:
      f = factors(len(s))

      if len(f) == 2: return False
      
      for l in f:
        if s[:l] != s[l: l  + l]: return False

        return True