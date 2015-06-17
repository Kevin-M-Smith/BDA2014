KBED <- fread("~/Desktop/ROC/data/KBED.csv")

columnNames <- names(KBED)

selection <- c(grep("theDate", columnNames), 
               grep("obsPTO", columnNames),
               grep("PERP1TO", columnNames),
               grep("PREP1TO", columnNames))

KBED <- subset(KBED, select = selection)

colnames(KBED) <- c("date", "observed", "persistance", "predicted")

KBED

write.csv(KBED, file="KBED_Filtered.csv")

