require(e1071)
require(ggplot2)
require(plyr)

set.seed(1)

lower.bound = 5
upper.bound = 500

sd.estimate <- function(x){
  n <- length(x)
  sd(x) * sqrt( (n-1) / n )
}

cv.estimate <- function(x){
  sd.estimate(x) / mean(x)
}

skewness.estimate <- function(x){
  skewness(x, type = 3)
}

kurtosis.estimate <- function(x){
  kurtosis(x, type = 3)
}

monte.carlo <- function(n, sigma){
  x = rlnorm(n, 1, sigma)
  df <- data.frame(
             sd = sd.estimate(x),
             cv = cv.estimate(x),
             kurtosis = kurtosis.estimate(x),
             skewness = skewness.estimate(x)
             )
}

sigma = 2.23
mu = 1

samples <- data.frame(n = floor(runif(1E5, 5, 100)))
samples <- adply(samples, 1, transform, estimate = monte.carlo(n, sigma), .progress = "text")

lognormal.sd <- function(mu, sigma){ 
  sqrt((exp(sigma^2) - 1) * (exp( (2 * mu) + sigma^2)))
}

lognormal.mean <- function(mu, sigma){
  exp(mu + (sigma^2) / 2)
}

true.sd <- lognormal.sd(mu, sigma)
true.cv <- lognormal.sd(mu, sigma) / lognormal.mean(mu, sigma)

g <- ggplot(samples, aes(x = n, y = estimate.cv))
g <- g + stat_function(fun = cv.bound, size = 3.5, color = "#fc8d59", lineend = "round")
g <- g + geom_jitter(size = 0.6, position = position_jitter(width = 0.55))
g <- g + geom_line(aes(y = true.cv, color = "True Value"), size = 3, , lineend = "round")
g <= g + geom_line
g

# color = "#91bfdb"



g <- ggplot(samples, aes(x = n, y = estimate.sd)) 
g <- g + ggtitle(paste("Downward Bias
Biased Sample Estimates of Standard Deviation vs. Sample Size
100,000 Lognormal Samples, with Population SD of", round(true.sd, 2)))
g <- g + geom_point(size = 0.8)
g <- g + geom_line(aes(y = true.sd), 
                   size = 3, alpha = 0.5, color = "red")
g <- g + xlab("sample size, n") 
g <- g + ylab("estimate of standard deviation")
g

cv.bound <- function(n){
  sqrt(n-1)
}

g <- ggplot(samples, aes(x = n, y = estimate.cv))
g <- g + geom_jitter(size = 0.8, position = position_jitter(width = .5))
g <- g + stat_function(fun = cv.bound, size = 1, alpha = 0.5, color = "red")
g <- g + geom_line(aes(y = true.cv), size = 3, alpha = 0.5, color = "green")
g

g + xlim(5, 100)

plot(samples$n, samples$sd)

