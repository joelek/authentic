#!/bin/sh

curl -i http://localhost:8080/auth/
sleep 1
read SESSION
curl -i http://localhost:8080/auth/ -H "Cookie: session=$SESSION" --data '{"command":{"type":"REGISTER"}}'
sleep 1
curl -i http://localhost:8080/auth/ -H "Cookie: session=$SESSION" --data '{"command":{"type":"REGISTER_EMAIL","email":"joel@rydaform.se"}}'
sleep 1
read CODE
curl -i http://localhost:8080/auth/ -H "Cookie: session=$SESSION" --data "{\"command\":{\"type\":\"REGISTER_CODE\",\"code\":\"$CODE\"}}"
sleep 1
read SESSION2
curl -i http://localhost:8080/ -H "Cookie: session=$SESSION2"
