'''

def factorial(chislo):
    f = 1
    for i in range(2, chislo + 1):
        f = f * i
    print(f)


def summ1toCh(chislo):
    summ = 0
    for i in range(1, chislo + 1):
        summ += i
    print(summ)


factorial(4)
summ1toCh(4)

ch2=int(input("введите число "))
summ1toCh(ch2)

ch=int(input("введите число "))
factorial(ch)

summ1toCh(6)

'''

