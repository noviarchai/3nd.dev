#!/bin/bash
cd /home/pi/nex.monster
python3 -m http.server 3000 > /tmp/nex.monster.log 2>&1 &
echo "nex.monster started on port 3000"
