#!/bin/bash

ip -o a | grep 192 | awk '{ print $4}' | cut -d "/" -f1