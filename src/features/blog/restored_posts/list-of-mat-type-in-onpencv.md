---
title: "List of Mat Type in onpenCV"
date: 2019-03-25T09:23:30.000Z
tags: [opencv]
categories: [opencv]
---

LIST OF MAT TYPE IN OPENCV

A Mapping of Type to Numbers in OpenCV

| C1 | C2 | C3 | C4  
:-|-:|-:|-:|-:|-:  
CV\_8U | 0 |8 | 16 | 24  
CV\_8S | 1 |9 | 17 | 25  
CV\_16U | 2 |10 | 18 | 26  
CV\_16S | 3 |11 | 19 | 27  
CV\_32S | 4 |12 | 20 | 28  
CV\_32F | 5 |13 | 21 | 29  
CV\_64F | 6 |14 | 22 | 30

## Unsigned 8bits uchar 0~255

IplImage: IPL\_DEPTH\_8U  
Mat: CV\_8UC1, CV\_8UC2, CV\_8UC3, CV\_8UC4

## Signed 8bits char -128~127

IplImage: IPL\_DEPTH\_8S  
Mat: CV\_8SC1，CV\_8SC2，CV\_8SC3，CV\_8SC4

## Unsigned 16bits ushort 0~65535

IplImage: IPL\_DEPTH\_16U  
Mat: CV\_16UC1，CV\_16UC2，CV\_16UC3，CV\_16UC4

## Signed 16bits short -32768~32767

IplImage: IPL\_DEPTH\_16S  
Mat: CV\_16SC1，CV\_16SC2，CV\_16SC3，CV\_16SC4

## Signed 32bits int -2147483648~2147483647

IplImage: IPL\_DEPTH\_32S  
Mat: CV\_32SC1，CV\_32SC2，CV\_32SC3，CV\_32SC4

## Float 32bits float -1.18_10-38~3.40_10-38

IplImage: IPL\_DEPTH\_32F  
Mat: CV\_32FC1，CV\_32FC2，CV\_32FC3，CV\_32FC4

## Double 64bits double

Mat: CV\_64FC1，CV\_64FC2，CV\_64FC3，CV\_64FC4

## Unsigned 1bit bool

IplImage: IPL\_DEPTH\_1U