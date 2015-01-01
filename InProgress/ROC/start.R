require(pROC)
require(plyr)
require(ggplot2)
require(grid)

KBEDo <- read.csv("~/KBED_Filtered.csv", stringsAsFactors=FALSE)


g <- ggplot(KBED, aes(x = observed, y = predicted))
g <- g + scale_x_log10() + scale_y_log10()
g <- g + geom_jitter() 
g

roc(observed ~ predicted, KBED, plot = TRUE)

KBED <- mutate(KBEDo, 
               observed = observed + 0.1, 
               predicted = predicted + 0.1,
               rain = observed > 0.1,
               true.positive = predicted > 1.1 & rain,
               true.negative = predicted < 1.1 & !rain,
               false.positive = predicted > 1.1 & !rain,
               false.negative = predicted < 1.1 & rain,)

summary <- summarize(KBED, 
                     true.positive.rate = sum(true.positive) / nrow(KBED),
                     true.negative.rate = sum(true.negative) / nrow(KBED),
                     false.positive.rate = sum(false.positive) / nrow(KBED),
                     false.negative.rate = sum(false.negative) / nrow(KBED)
                     )

true.density <- stat_density(
  unlist(subset(KBED, select = "predicted", subset = rain)),
  from = min(KBED$predicted), to = max(KBED$predicted))

false.density <- stat_density(
  unlist(subset(KBED, select = "predicted", subset = !rain)),
  from = 0.01, to = 300)

dens <- data.frame(x = true.density$x, rain = true.density$y, no.rain = false.density$y)

g <- ggplot(KBED, aes(x = predicted + 0.1, fill = rain))
g <- g + xlab("Rainfall Predicted (x 0.01 in.)")
g <- g + geom_density(alpha = 0.5) + scale_x_log10()
g

info <- print(g)

info <- data.frame(x = info$data[[1]]$x,
                   y = info$data[[1]]$scaled,
                   g = info$data[[1]]$group)

info2 <- mutate(info,
                rain = g <= 1,
                pred = x > 1.5,
                g2 = -rain + pred)

dens <- stat_density(data = KBED, aes(x = predicted, fill = rain))


g + annotate("ribbon", 
                  x = dens$x,
                  xmin = min(true.density$x),
                  xmax = 1.1,
                  ymax = dens$rain,
                  ymin = 0)



g <- ggplot(KBED, aes(x = predicted + 0.1, fill = rain))
g <- g + xlab("Rainfall Predicted (x 0.01 in.)")
g <- g + geom_histogram(alpha = 0.5) + scale_x_log10()
g

g <- ggplot(KBED, aes(x = predicted, fill = Rain))
g <- g + xlab("Rainfall Predicted (x 0.01 in.)")
g <- g + geom_histogram(alpha = 0.5) 
g

breakpoint = 10
test <- transform(KBED, observed)

g + geom_vline(x = 10)

g + geom_density()
