---
layout: note
notes_active : true

title: Twitter Streams
category: note
image: 
tags: twitter

user: danielfdsilva
---
A project we developed required a section where the total tweet count and the last tweet made with a give hashtag were shown. This required integration with the [Twitter Stream Api](https://dev.twitter.com/docs/streaming-apis/streams/public). Our first approach was to use the twitter firehose but there were two problems with this:
- There is a lot of data coming through the firehose and a lot of processing is needed.
- The access to this endpoint is limited and special permissions are required.

After some research we found our solution. Here is how we did it:

We came across the [statuses/filters](https://dev.twitter.com/docs/api/1.1/post/statuses/filter) which is similar to the firehose except it needs to have some filter applied, either keyword or user.  
During the research on how to interact with this API we found a nice script developed by [Mike Pultz](http://mikepultz.com/2013/06/mining-twitter-api-v1-1-streams-from-php-with-oauth/) which was adapted according to suggestions on his website's comments and according to our needs.  
We keep the script running on a server with ```screen``` and every time a tweet comes back it is stored in a database. Then we created a simple API for our project that returns the total count and the last tweet. As simple as that.  

## The Script
Since the script is easy and fun to use we leave our own version with some instructions.

{% gist 7888253 TwitterStream.php %}

The ```TwitterStream``` class was made abstract so it needs to be extended.  
The ```__constructor``` method is used to setup credentials and keywords and every time a matching tweet is found it is sent to ```processTweet()```.
However we found that sometimes a ```disconnect``` response is returned so we check if the actual tweet text is present thus validating the data.  

When setting up the keywords we found that twitter differentiates accented keywords from non accented. In our case we needed to check for a hashtag in Spanish "quécambiarías" so, to be sure we got everything, we needed to account for every variation: "quecambiarias", "quecambiarías", "quécambiarias", "quécambiarías"

{% gist 7888253 index.php %}