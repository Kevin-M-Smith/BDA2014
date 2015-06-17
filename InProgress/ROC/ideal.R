# Receiver Operator Curves

set.seed(100)

# Number | Mean | Standard Deviation
lN = 1000;  lM = 190; lS = 5          # Left-Handed
rN = 9000;  rM = 120; rS = 10         # Right-Handed


data <- data.frame(
  
  left.handed = c(rep(TRUE, lN), 
                  rep(FALSE, rN)),
  
  iq = c(rnorm(lN, lM, lS), 
         rnorm(rN, rM, rS))
  
  )

head(data); tail(data);


g <- ggplot(data = data) + theme_bw()
g <- g + geom_density(
  aes(x = iq, fill = left.handed))
g <- g + scale_fill_discrete(name = "Left Handed")
g <- g + theme(legend.position = "top") 
g


data <- as.data.frame(
  rbind(
      cbind(left.handed = TRUE,  iq = rnorm(1000, 140, 5)),
      cbind(left.handed = FALSE, iq = rnorm(9000, 120, 10))
      )
  )

g <- ggplot(data = data)
g <- g + geom_density(
  aes(x = iq, fill = as.factor(left.handed)), alpha = 0.2) 
g


