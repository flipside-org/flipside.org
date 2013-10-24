---
layout: note
notes_active : true

title: Incendios 0.2 - more and improved data
category: note
image: ttclogo.png
tags: open-data incendios

user: olafveerman
---

This week we launched a new version of incendios.pt that adds the most recent data published by ICNF (2012) and makes it easier to access the raw data that powers the site.

## Download the data
The whole dataset with detailed information about each of the 400.000 fires was already available for download on Github (https://github.com/flipside-org/incendios-dataset), but in the new release we went a step further and added a download button to each administrative area. With one easy click, you'll be able to download the data for that area (district, municipality or parish) in CSV format to the level of each fire. This allows everybody to analyze the raw data and even create visualizations from it.

## Cached CSVs
Given the more or less static nature of the site (data is currently published once a year), we've opted to pre-process the CSV files for each area, decreasing the load on the database.
