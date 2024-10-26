class Solution:
    def convert(self, s: str, r: int) -> str:
        res = [["" for j in range((len(s) // r) + 1)] for i in range(r)]
        rev = 1
        print(res)
        print(s)
        j = 0
        k = 0
        for i in range(len(s)):
            print(i // r, i % r)
            res[j][k] = s[i]
            if (i + 1) % r == 0:
                rev = -rev
                
        print(res)

Solution().convert("PAYPALISHIRING", 3)