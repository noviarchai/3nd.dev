#!/bin/bash
# Beta subdomain SSH tunnel - Pi port 80 → VPS port 8080
# VPS nginx proxies *.beta.nex.monster:443 → localhost:8080 → this tunnel → Pi nginx
sshpass -p '379K3pE7ty1VmfqTGK' ssh -o StrictHostKeyChecking=no -o BatchMode=yes -o ServerAliveInterval=30 -fN -R 8080:localhost:80 root@203.161.55.37
