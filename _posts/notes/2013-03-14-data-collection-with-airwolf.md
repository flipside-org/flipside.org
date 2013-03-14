---
layout: note
title: Data collection with Airwolf
category: note
tags: airwolf drupal mongodb

user: olafveerman
---
Recently we've been working with [Research Africa](http://www.researchafrica.com) on Airwolf, a platform that provides them and [Text to Change](http://www.texttochange.com) with a tool to manage their data collection process, from survey definition to final visualization. Both organizations go through exciting phases of growth and the need to manage their data with a long term vision became ever more evident.

<img src="/images/notes/collection-process-aw.png" class="eleven columns border alpha omega" alt="Data collection with Airwolf" />
  

From the beginning, it was clear that we would not build every single component from scratch. On the data collection side, there are mature tools available like OpenDataKit, Formhub or Vusion, TTC's own sms system, while on the visualization side the options are even more diverse.
Airwolf is therefore built with interoperability in mind. It is agnostic when it comes to data collection tool used, basically any data provided in consistently formatted CSVs can be imported into the system. New visualization tools can be integrated to allow both organizations to respond to new developments quickly and stay current, without requiring a complete re-factor of the system.

The roadmap for Airwolf 2.0 is shaping up and we are excited to work on features such as improved benchmarking capabilities, improved support for Openrosa Xforms and a better data collection experience for the call center agents.