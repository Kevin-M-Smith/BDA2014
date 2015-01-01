

df1 <- replicate(10000, floor(runif(21, 1, 4)))
df2 <- replicate(10000, floor(runif(21, 1, 4)))

checkAnswers <- function(x){
  sum((df1[1:21, x] - df2[1:21, x])==0)
}

df3 <- lapply(1:10000, checkAnswers)

df3 <- sort(unlist(df3))

(10000 - which(df3 == 7)[1])/10000

(10000 - which(df3 == 8)[1])/10000



df1 <- replicate(10000, floor(runif(15, 1, 4)))
df2 <- replicate(10000, floor(runif(15, 1, 4)))

checkAnswers <- function(x){
  sum((df1[1:15, x] - df2[1:15, x])==0)
}

df3 <- lapply(1:10000, checkAnswers)

df3 <- sort(unlist(df3))

(10000 - which(df3 == 6)[1])/10000

(10000 - which(df3 == 7)[1])/10000




