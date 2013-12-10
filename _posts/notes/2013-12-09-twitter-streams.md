---
layout: note
notes_active : true

title: Twitter Streams
category: note
image: 
tags: twitter

user: danielfdsilva
---
For one of our projects, we needed to track particular hashtags on Twitter and show the last status update and a total count. This post gives a quick overview of how we used the [Twitter Stream Api](https://dev.twitter.com/docs/streaming-apis/streams/public) to implement this.

Twitter has a couple of API's in place that allow you to fetch status updates. The Search API allows you to get past tweets, but only a limited amount is returned. The Twitter Firehose is an API that gives access to all of the tweets published, but is only available to a few selected partners that, among other things, proof they can handle to amount of data sent through the firehose.

During the research on how to interact with the Streaming API we found a nice script developed by [Mike Pultz](http://mikepultz.com/2013/06/mining-twitter-api-v1-1-streams-from-php-with-oauth/) which was adapted according to suggestions on his website's comments and according to our needs.  

For our project we have the script running on a server with ```screen``` and every time a tweet comes back it is stored in a database. Then we created a simple API for our project that returns the total count and the last tweet. As simple as that.  

## The Script
Since the script is easy and fun to use, we put our own version in a [Gist](https://gist.github.com/danielfdsilva/7888253).
 
The ```TwitterStream``` abstract class was created from the original script with the addition of a few methods. Nothing needs to be done to this class, it just needs to be included in the project. [Download here](https://gist.github.com/danielfdsilva/7888253/raw/TwitterStream.php).  
On the index file we extend ```TwitterStream``` and implement the abstract method ```processTweet()```.
The ```__constructor``` is used to setup credentials and keywords and every time a matching tweet is found it is sent to ```processTweet()```.
However we found that sometimes a ```disconnect``` response is returned so we check if the actual tweet text is present thus validating the data.  

{% gist 7888253 index.php %}

### Streaming API and accents
Note that when you want to track accented keywords, it might be a good idea to include all the different variations. In our case, we needed to check for the Spanish hashtag 'quécambiarias'. Since users are not always accurate in their spelling (even less when it comes to hashtags), it is important to account for variations: 'quecambiarias', 'quecambiarías', 'quécambiarias', 'quécambiarías'.