---
layout: note
notes_active : true
category: note

title: Data collection with Airwolf
user: olafveerman

filters: project
image: aw-ccdashboard.png
related_post: airwolf data-collection

---
Recently we've been working with [Research Africa](http://www.researchafrica.com) on Airwolf, a platform that provides them and [Text to Change](http://www.texttochange.com) with a tool to manage their data collection process: from survey definition to final visualization. Both organizations go through exciting phases of growth and the need to manage their data with the long term in mind was getting bigger.

{% include content_img.html path="notes/collection-process-aw.png" caption="Data collection with Airwolf" %}
From the beginning, it was clear that we would not build every single component from scratch. On the data collection side, there are mature tools available like [OpenDataKit](http://www.opendatakit.org), [Formhub](http://www.formhub.org) or [Vusion](http://www.texttochange.org/vusion), TTC's own sms system, while on the visualization side the options are even more diverse.
Airwolf is therefore built with interoperability in mind. It is agnostic when it comes to data collection tool used, basically any data provided in consistently formatted CSVs can be imported into the system. New visualization tools can be integrated to allow both organizations to respond to new developments quickly and stay current, without requiring a complete re-factor of the system.

###Question repository
The question repository provides RA with an overview of all the questions ever asked in a survey. This allows them to benchmark results among different surveys, but also speed up the survey definition process by re-using existing questions.

###Data importer
Airwolf currently imports data from CSV files and does some basic validation to ensure the data integrity, for example by checking for duplicate entries, 
or whether the data is imported into right survey to begin with.

###Report builder
The report builder allows Research Africa to produce custom reports from the survey data collected, in both online format, as well as PDF.

{% include content_img.html path="notes/aw-ccdashboard.png" caption="Data collection with Airwolf" %}

###Call center
Research Africa has its own call center that can be used to collect data for their projects. Airwolf provides basic tools to manage the call center operation and detailed reports on the progress throughout the project.

##Future
The roadmap for Airwolf 2.0 is shaping up and we are excited to work on features such as improved benchmarking capabilities, improved support for Openrosa Xforms and a better data collection experience for the call center agents.