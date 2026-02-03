---
title: "Star Rating with HTML + Pure CSS"
date: 2018-03-26T04:35:05.000Z
tags:
  [CSS, Font Awesome, Frontend, HTML, JavaScript, Pure CSS, Star Rating, UI/UX]
categories: [Frontend, CSS, HTML]
playground_slug: star-rating
---

## Introduction

Today I had a task in a project related to rating evaluation. Star rating is widely used, most commonly in restaurant and hotel rating systems where 5 stars represent the highest quality.

Instead of using available plugins/libraries, this article will guide you on how to create a star rating purely with **HTML + CSS** with the criterion **"MINIMIZE EXTERNAL LIBRARIES"**.

## Basic Structure

To create a star, we use 2 tags:

- **`input[type="radio"]`**: Contains the value selected by the user. Stars must have the same `name` to ensure only one value can be selected at a time.
- **`label`**: Displays the star icon and serves as the GUI for the radio input.

> **Important note**: HTML must be written in order from **5→1** instead of 1→5 because CSS does not have a selector for previous siblings.

## HTML Implementation

### 5-Level Version (1-5 stars)

```html
<div id="rating">
  <input type="radio" id="star5" name="rating" value="5" />
  <label class="full" for="star5" title="Excellent - 5 stars"></label>

  <input type="radio" id="star4" name="rating" value="4" />
  <label class="full" for="star4" title="Pretty good - 4 stars"></label>

  <input type="radio" id="star3" name="rating" value="3" />
  <label class="full" for="star3" title="Normal - 3 stars"></label>

  <input type="radio" id="star2" name="rating" value="2" />
  <label class="full" for="star2" title="Bad - 2 stars"></label>

  <input type="radio" id="star1" name="rating" value="1" />
  <label class="full" for="star1" title="Very bad - 1 star"></label>
</div>
```

_... (rest of the post would be here, but I'll stop here for the demo)_
