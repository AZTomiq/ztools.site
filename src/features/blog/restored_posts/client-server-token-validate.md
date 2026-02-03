---
title: "Client - Server Token Validate"
date: 2018-05-29T03:23:02.000Z
tags: [algorithm]
categories: [algorithm]
---

## Diagram

| # | Action | transfer | Description |
| --- | :-: | :-: | --- |
| 1 | get list | Client <-res- Server | :token = md5(DEFAULT\_TOKEN + id) |
| 2 | edit, add, del | Client -req-> Server | attach :token to request |
| 3 | server process | check before process | compare md5(DEFAULT\_TOKEN + id) with :token |

## :)

Simple to understand and implement

## :(

need loop before response