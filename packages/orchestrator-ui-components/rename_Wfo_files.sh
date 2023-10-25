#!/bin/bash
Wfo_files=$(find . -name '*Wfo*' -type f -not -path './node_modules/*')
for file in $Wfo_files;do
    new_name=$(echo "$file" | sed "s/\(.*\)Wfo/\1Wfo/")
    echo "$file - $new_name"
    git mv $file $new_name
done




