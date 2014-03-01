---
layout: note
category: note
  
title: Text to Change's commitment to open data
image: ttc-mobilephones.jpg
user: olafveerman

filters: work

background_color: A01E22

featured: false
featured_image: 
  mobile: 
  desktop: 
  polaroid:
  
related_post:
---

_This is a slightly adapted version of a blog post that was originally published on the [Text to Change blog](http://www.texttochange.org/blog/our-commitment-open-data). As technology partners, we_ _are supporting them to open up the datasets that are valuable to other people and organisations._

<img class="right" src="/images/notes/ttclogo.png" alt="Text to Change">
At Text to Change we are firm believers in the benefits of open source: we use it ourselves where possible and our interactive sms platform Vusion is also open source. The benefits of 'open', however, stretch beyond software or code alone. Which is why in the coming months we'll be sharing some of the data we have compiled and we are using in our projects.

The first set of data we've published, is a list with [Ugandan administrative divisions](https://github.com/texttochange/uganda-admin-divisions/blob/master/data.csv), up to the sub-county level. We use this particular dataset in a lot of our surveys and believe it is valuable for other people or organisations as well, especially since a comprehensive list is not easy to come by.

Based on a PDF from 2011 by the Electoral Commission of Uganda, we generated the CSV file that contains every district, county and sub-county in Uganda, plus an indication of its parent divisions and region. To make it easily readable for machines, the file is de-normalized and all the individual rows contain the necessary information about that administrative division. Making it available in such a structured way, allows other software to process and use this information without much further human intervention.

## Collaboration and re-use
The full dataset is published on [TTC's Github](https://github.com/texttochange/uganda-admin-divisions) account under an Open Data Commons Public Domain license. This particular license puts no restrictions on the use of the data, allowing everybody to use, mix, match and re-share it under the terms they want.

We've settled on Github to share the datasets. Over the past years, this has become a popular tool to collaborate on software development, but more recently itis becoming a place to collaborate on much more than that. Their recent support for [rendering CSV and TSV](https://help.github.com/articles/rendering-csv-and-tsv-data) in the browser, makes it a great tool to share small datasets. Users can browse and filter the data instantly, while the collaborative features it is so well known for allow them to correct mistakes they encounter.

To properly describe the data we are using the Data Packages [standard](http://www.dataprotocols.org/en/latest/data-packages.html), which allows us to specify the metadata and schema. The datapackage.json includes information such as title, descriptions, source, license and schema.

## Future
Over the coming months we will publish those datasets that are valuable to the general public. If you have questions or suggestions about how we go about opening up our data, feel free to write us.