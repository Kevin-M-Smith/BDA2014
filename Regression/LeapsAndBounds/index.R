require(leaps)
require(plyr)


H6 <- read.csv("/data/hydro.csv", header = TRUE)


y <- as.vector(unlist(H6["Q710"]))

exclude <- names(H6) %in% c("Site", "State", "Q710") 
x <- H6[!exclude]

square <- function(x){ x * x }

Log <- adply(x, 1, log)
colnames(Log) <- paste("Log", names(Log), sep = "")
Sq <- adply(x, 1, square)
colnames(Sq) <- paste("Sq", names(Sq), sep = "")

x <- data.frame(x, Log, Sq) 

best <- leaps(x = x, y = y, nbest = 10)
