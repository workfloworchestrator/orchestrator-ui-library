#!/bin/bash
folder='./src/components'
Wfo_directories=$(find src/components -name '*Wfo*' -type d -not -path './node_modules/*')
for directory in $Wfo_directories;do
    new_name=$(echo "$directory" | sed "s/\(.*\)Wfo/\1Wfo/")
    git mv $directory tmp
    git mv tmp $new_name
done

