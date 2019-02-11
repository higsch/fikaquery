library(tidyverse)
library(pheatmap)
# make a table with all query possibilities

# make the dataframe
df <- data.frame(WHERE = c(rep(0, 16), rep(1, 16)))
df$SORT <- rep(c(rep(0, 8), rep(1, 8)), 2)
df$LIMIT <- rep(c(rep(0, 4), rep(1, 4)), 4)
df$index_where <- rep(c(rep(0, 2), rep(1, 2)), 8)
df$index_sort <- rep(c(0, 1), 16)

# fill in solutions
df$plan <- as.numeric(factor(c(rep("full_scan", 4),
             rep("limited_scan", 4),
             rep(c("full_scan", "index_table"), 4),
             rep("full_scan", 2),
             rep("index_table", 2),
             rep("limited_scan", 2),
             rep("index_table", 2),
             rep("full_scan", 2),
             "index_WHERE_table",
             "index_WHERE_index_SORT_table",
             rep("full_scan", 2),
             "index_WHERE_table",
             "index_WHERE_index_SORT_table")))

df %>%
  pheatmap(cluster_rows = FALSE,
           cluster_cols = FALSE)
  
  