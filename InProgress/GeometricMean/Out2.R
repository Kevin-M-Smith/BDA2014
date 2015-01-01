
require(plyr)
require(ggplot2)

experiment <- function(n, mu, sigma){
  sample <- rlnorm(n, mu, sigma)
  m <- mean(sample)
  g <- exp(mean(log(sample)))
  d <- median(sample)
  result <- data.frame(m = m, g = g, d = d)
}

mse <- function(x, X){
  x <- unlist(x)
  se <- (x - X)^2
  return(mean(se))
}

monte.carlo <- function(n.samples, mu, sigma){
  M <- exp(mu + sigma/2)
  experimental.results <- replicate(n.experiments, experiment(n.samples, mu, sigma), simplify = "data.frame")
  mean.squared.error <- (adply(experimental.results, 1, mse, M))
  t(data.frame(mean.squared.error, row.names = 1))
}

n.experiments = 2000;

n.samples <- c(3, 5, 7, 11, 19)
mu <- seq(-2,2)
sigma <- seq(0.01, 2, length.out = 10) 
  
experimental.classes <- expand.grid(mu = mu, sigma = sigma, n.samples = n.samples)

output <- adply(experimental.classes, 1, mutate,
                mse = monte.carlo(n.samples, mu, sigma),
                eff = mse[,1] / mse, .progress = "text")

outa <- subset(output, mu == 1 & sigma < 1.2)

g <- ggplot(outa, aes(x = sigma, y = eff[,2], linetype = as.factor(n.samples))) + geom_smooth(level = 0,method = "lm", formula = y~poly(x, 2))
g


g <- ggplot(outa, aes(x = sigma, y = eff[,2], color = as.factor(n.samples))) + geom_line()
g + geom_point(aes(color = as.factor(n.samples)))

plots <- list()

plotter <- function(mu){
  outa <- subset(output, mu == mm & sigma < 1.2)
  g <- ggplot(outa, aes(x = sigma, y = eff[,2])) 
  g <- g + geom_rect( xmin = -10, xmax = 10, ymin = 1, ymax = 10, fill = "grey20")
  g <- g + geom_rect( xmin = -10, xmax = 10, ymin = -10, ymax = 1, fill = "grey40")
  g <- g + geom_line(aes(color = as.factor(n.samples)), size = 1.5)
  g <- g + geom_point(aes(color = as.factor(n.samples)), size = 4)
  g <- g + theme(legend.position = "none")
  g <- g + ggtitle(mm)
  g
}


legend <- ggplot_gtable(ggplot_build(plotter(0)+ theme(legend.position = "top")))
index <- which(sapply(legend$grobs, function(x) x$name) == "guide-box")
legend <- legend$grobs[[index]]

grid.arrange(legend, plotter(-2), plotter(-1), plotter(0), plotter(1), plotter(2))


