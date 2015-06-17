require(pROC)
require(plyr)
require(ggplot2)
require(grid)
require(data.table)

KBEDo <- read.csv("~/KBED_Filtered.csv", stringsAsFactors=FALSE)

KBED <- mutate(KBEDo, 
               observed = observed + 0.1, 
               predicted = predicted + 0.1,
               rain = observed > 0.1)

data <- data.table(KBED)

kernel.density <- data[, list(
                        x = density(predicted)$x, 
                        y = density(predicted)$y), 
                        by = "rain"]

g <- ggplot(KBED)
g <- g + xlab("Rainfall Predicted (x 0.01 in.)")
g <- g + geom_density(aes(x = predicted, 
                          y = ..scaled..,
                          fill = rain), alpha = 0.2) 
g

g + scale_x_log10()

q <- print(g)

kernel.density <- data.frame(
  x = q$data[[1]]$x,
  y = q$data[[1]]$scaled,
  r = q$data[[1]]$group)

g + geom_ribbon(data = subset(q$data[[1]], 10^x > 1.1 & group == 1),
                aes(x = 10^x, ymin = ymin, ymax = scaled),
                fill = "red")

g + geom_ribbon(data = subset(kernel.density, 
                              r == 1 & x < 1.1),
                aes(x = x, ymax = y),
                ymin = 0, fill = "red")

g + geom_ribbon(data = subset(kernel.density,
                              rain == FALSE & x <= 1.1))