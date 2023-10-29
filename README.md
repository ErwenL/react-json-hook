# React-Json-Hook

## Key Features

## Motivation

In a recent project built on MongoDB, I found myself frequently needing to inspect my JSON data. Initially, I was using MongoDB Compass as my GUI data browser. However, I soon realized that MongoDB Compass fell short of meeting the specific demands of my project, paritcularly in terms of rendering customizability and UI performance.

- For instance, in my project, I often stored a lot of physics quantities, each contains a value and a unit, like `{value: 1, unit: "mm"}`. I really hope it can be renderd as `'${value} ${unit}'` instead of nested objects.
- Additionaly, the majority of data relationships in my project are implemented ung links. It would have been more convenient, if I could simply navigate to the related data by clicking on linked IDs, rather than performing separate queries.
- Lastly, my biggest complain about MongoDB Compass is its poor support for large data. When dealing with documents containing thousounds of lines, inadvertently clicking the "expand all" button would cause the software to freeze for a few seconds, which is completely unacceptable. Although, the performance has been significantly improved from 1.3x to 1.4x, the noticale lag still persisted.

All of these unconvenients have led me to think that maybe I should build my own JSON viewer.