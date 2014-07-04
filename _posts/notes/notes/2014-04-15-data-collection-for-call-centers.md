---
layout: note
category: note
  
title: A data collection approach for call centers
image: aw-respondents.png
user: olafveerman

filters: work

background_color: 057A99

featured: false
featured_image:
  mobile: 
  desktop: aw-survey-desktop.png
  polaroid: 
  
related_post:
  - airwolf
---

Open source data collection tools have taken a big flight in the past years, in part because of the proliferation of affordable mobile devices. Tools like Open Data Kit allow organizations to switch from paper based surveys to digital versions, thus greatly improving the process (eg. less data entry) and the possibilities (GPS, constraints and skip logic). The surge of mobile devices on the consumer side has allowed organizations like [Text to Change](http://texttochange.com) to pioneer the field of interactive sms programs for a wide range of purposes.

With all these tools and methods available, it is very important to pick the right one for each collection effort. Text to Change understands this very well and they have been building their capacity to reach people in different ways. For more complex surveys, they have set up a small call center in Kampala that can efficiently conduct personal interviews throughout the region.

Over the past couple of months we have worked with Text to Change to rethink the data collection capabilities of [Airwolf](http://flipside.org/projects/airwolf/) - the application used by their call center - an effort partly funded by [SIDA](http://www.sida.se). This post contains a brief overview of the tool and its key features.

## Survey definition
{% include content_img.html path="notes/aw-respondents.png" %}
Any data collection effort by TTC starts with the definition of the survey itself. For a smaller learning curve for the staff and to ensure interoperability with other data collection tools, this is done in the XLSForm format OPENROSA. The same file that configures an Airwolf survey, could for example be used to conduct a face-to-face interview using a mobile device equipped with [Open Data Kit](http://opendatakit.org). It's this flexibility that allows TTC to pick the right tool(s) for each survey.

## Anonymization
Since Airwolf is used in a call center context, respondents are a central concept in the application. Moderators can upload lists with phone numbers that will be called and define whether these should be anonymized. This is especially important when dealing with sensitive information. Data of an anonymized survey, is never sent back or stored with the phone number, thus contributing to the anonymity of the responses.

## Offline data collection
One of the advantages of building Airwolf on top of an existing standard such as Openrosa, is the amount of open source tools that can be used. For the actual data collection, Airwolf relies on [Enketo](http://enketo.org), a library that provides elegant and functional webforms that run in any modern browser. After the call center agent confirms the respondents' consent to participate in the survey, the webform is launched with all the question and logic that were defined in the survey definition.

Once the data is collected, Airwolf will attempt to sent it back to the server. If the internet connection is temporarily down, it will store the results locally in the browser instead. This is extremely important given Kampala's less than stable internet supply. Since Enketo is already off-line ready, the only limitation for off-line collection in Airwolf is the amount of phone numbers that are reserved locally on the agent's computer. Once these run out, data collection can only resume when the internet is back up.

## Further reading
In the near future we'll open up the codebase and set up a public demo to get a better sense of the application. For more information on Openrosa, we recommend you to read the excellent [introduction on the Enketo website](https://enketo.org/openrosa).