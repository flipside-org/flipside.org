---
layout: note
category: note
  
title: Incendios.pt - eleven years of fire data
image: incendios-pt_map.png
user: olafveerman

filters: work

background_color: BF503E

featured: false
featured_image: 
  mobile: 
  desktop: 
  polaroid:
  
related_post:
  - incendios
---
Large areas of forest and agricultural land burn down each year in Portugal, especially during the hot summer months. Between 2001 and 2011, fires destroyed 416 hectares on average per day, an area equal to 671 football pitches.

Today we are launching [incendios.pt](http://incendios.pt) 0.1, a project we've been working on internally for the past months. Based on a dataset with close to 370.000 occurrences for the period 2001 and 2011, it allows users to explore data on fires in Portugal by location and topic. The site is available in Portuguese and English and built with responsiveness in mind.

##Explore by location
{% include content_img.html path="notes/incendios-pt_explore-location.png" caption="Image showing data for the district of Viseu." %}
With every occurrence being geo-referenced, maps play an important role on the site. These maps - powered by Tilemill, Mapbox and Leaflet - show some striking regional differences, both in terms of frequency of fires as in size of the area burnt.

Every administrative area in Portugal (district, municipality and parish) has its own linkable page showing statistics on occurrences and the size of area burnt. Users can easily drill down to their area of choice, using the hierarchical selector.

##Explore by topic
The original dataset is very detailed and contains a lot of information about each occurrence, including start and end dates, causes and type of area burnt. Since it doesn't always make sense to show the data aggregated by administrative area, we've added _story_ pages that contain analysis on specific topics.

{% include content_img.html path="notes/incendios-pt_explore-topic.png" caption="Image showing the topic 'Big Fires'." %}

In the coming weeks we will add more pages with analysis on a certain topic. If you would like to contribute with your own analysis, we'd love to hear from you.

##Technology
[Incendios.pt](http://www.incendios.pt) is fully built on Open Source technology, mainly on Express, MongoDB, Mapbox, Leaflet and Morris. For a more complete list of the technology we used for this site, please see the [About](http://www.incendios.pt/en/data) page. We'll be publishing more notes that explain some of the technical aspects in more detail.

Over the coming months you can also expect improvements and some new features to the site, follow us on [Twitter](http://www.twitter.com/flipside_org) to be kept up to date. If in the meantime you have a question, feedback or suggestions, feel free to drop us a line at [info@flipside.org](mailto:info@flipside.org).